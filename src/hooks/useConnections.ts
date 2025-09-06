import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import type { Connection, Profile } from '../types';

export function useConnections(userId: string | undefined) {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [availableUsers, setAvailableUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetchConnections();
    fetchAvailableUsers();
  }, [userId]);

  const fetchConnections = async () => {
    try {
      const { data, error } = await supabase
        .from('connections')
        .select(`
          *,
          profiles!connections_connection_id_fkey(*)
        `)
        .eq('user_id', userId);

      if (error) throw error;
      setConnections(data || []);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchAvailableUsers = async () => {
    try {
      // Get all profiles except current user
      const { data: allProfiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', userId);

      if (profilesError) throw profilesError;

      // Get existing connections
      const { data: existingConnections, error: connectionsError } = await supabase
        .from('connections')
        .select('connection_id')
        .eq('user_id', userId);

      if (connectionsError) throw connectionsError;

      const connectedIds = existingConnections?.map(c => c.connection_id) || [];
      const available = allProfiles?.filter(profile => !connectedIds.includes(profile.id)) || [];
      
      setAvailableUsers(available);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addConnection = async (connectionId: string) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('connections')
        .insert({
          user_id: userId,
          connection_id: connectionId
        });

      if (error) throw error;
      
      // Refresh both lists
      await fetchConnections();
      await fetchAvailableUsers();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const removeConnection = async (connectionId: string) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('connections')
        .delete()
        .eq('user_id', userId)
        .eq('connection_id', connectionId);

      if (error) throw error;
      
      // Refresh both lists
      await fetchConnections();
      await fetchAvailableUsers();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    connections,
    availableUsers,
    loading,
    error,
    addConnection,
    removeConnection,
    refetch: () => {
      fetchConnections();
      fetchAvailableUsers();
    }
  };
}