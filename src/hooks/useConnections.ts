import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import type { Connection, Profile } from '../types';

export function useConnections(userId: string | undefined) {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Connection[]>([]);
  const [sentRequests, setSentRequests] = useState<Connection[]>([]);
  const [availableUsers, setAvailableUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetchConnections();
    fetchPendingRequests();
    fetchSentRequests();
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
        .eq('user_id', userId)
        .eq('status', 'accepted');

      if (error) throw error;
      setConnections(data || []);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('connections')
        .select(`
          *,
          profiles!connections_user_id_fkey(*)
        `)
        .eq('connection_id', userId)
        .eq('status', 'pending');

      if (error) throw error;
      setPendingRequests(data || []);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchSentRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('connections')
        .select(`
          *,
          profiles!connections_connection_id_fkey(*)
        `)
        .eq('user_id', userId)
        .eq('status', 'pending');

      if (error) throw error;
      setSentRequests(data || []);
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

      // Get existing connections and requests
      const { data: existingConnections, error: connectionsError } = await supabase
        .from('connections')
        .select('connection_id, user_id')
        .or(`user_id.eq.${userId},connection_id.eq.${userId}`);

      if (connectionsError) throw connectionsError;

      const connectedIds = existingConnections?.map(c => 
        c.user_id === userId ? c.connection_id : c.user_id
      ) || [];
      const available = allProfiles?.filter(profile => !connectedIds.includes(profile.id)) || [];
      
      setAvailableUsers(available);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const sendConnectionRequest = async (connectionId: string) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('connections')
        .insert({
          user_id: userId,
          connection_id: connectionId,
          status: 'pending'
        });

      if (error) throw error;
      
      // Refresh all lists
      await fetchSentRequests();
      await fetchAvailableUsers();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const acceptConnectionRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('connections')
        .update({ status: 'accepted' })
        .eq('id', requestId);

      if (error) throw error;
      
      // Refresh all lists
      await fetchConnections();
      await fetchPendingRequests();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const rejectConnectionRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('connections')
        .update({ status: 'rejected' })
        .eq('id', requestId);

      if (error) throw error;
      
      // Refresh pending requests
      await fetchPendingRequests();
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
        .or(`and(user_id.eq.${userId},connection_id.eq.${connectionId}),and(user_id.eq.${connectionId},connection_id.eq.${userId})`);

      if (error) throw error;
      
      // Refresh all lists
      await fetchConnections();
      await fetchAvailableUsers();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    connections,
    pendingRequests,
    sentRequests,
    availableUsers,
    loading,
    error,
    sendConnectionRequest,
    acceptConnectionRequest,
    rejectConnectionRequest,
    removeConnection,
    refetch: () => {
      fetchConnections();
      fetchPendingRequests();
      fetchSentRequests();
      fetchAvailableUsers();
    }
  };
}