import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import type { CredentialType } from '../types';

export function useCredentials(userId: string | undefined) {
  const [credentials, setCredentials] = useState<CredentialType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetchCredentials();
  }, [userId]);

  const fetchCredentials = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('credentials')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCredentials(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addCredential = async (credential: Omit<CredentialType, 'id' | 'user_id' | 'created_at'>) => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('credentials')
        .insert({
          ...credential,
          user_id: userId
        })
        .select()
        .single();

      if (error) throw error;
      setCredentials(prev => [data, ...prev]);
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const uploadCertificate = async (file: File) => {
    if (!userId) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('certificates')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('certificates')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteCredential = async (credentialId: string) => {
    try {
      const { error } = await supabase
        .from('credentials')
        .delete()
        .eq('id', credentialId);

      if (error) throw error;
      setCredentials(prev => prev.filter(c => c.id !== credentialId));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    credentials,
    loading,
    error,
    addCredential,
    uploadCertificate,
    deleteCredential,
    refetch: fetchCredentials
  };
}