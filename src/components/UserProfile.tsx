import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Linkedin, Github, Award, Calendar, X, ExternalLink } from "lucide-react";
import { supabase } from "../supabaseClient";
import type { Profile, CredentialType } from "../types";
import { useTheme, type Theme } from "../hooks/useTheme";

interface UserProfileProps {
  userId: string;
  onClose: () => void;
}

export default function UserProfile({ userId, onClose }: UserProfileProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [credentials, setCredentials] = useState<CredentialType[]>([]);
  const [loading, setLoading] = useState(true);
  
  const currentTheme = (localStorage.getItem('skillpassport-theme') as Theme) || 'theme1';
  const theme = useTheme(currentTheme);

  useEffect(() => {
    fetchUserProfile();
    fetchUserCredentials();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchUserCredentials = async () => {
    try {
      // Check if current user is connected to this user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: connectionData } = await supabase
        .from('connections')
        .select('*')
        .or(`and(user_id.eq.${user.id},connection_id.eq.${userId}),and(user_id.eq.${userId},connection_id.eq.${user.id})`)
        .eq('status', 'accepted')
        .single();

      // Only show credentials if connected or viewing own profile
      if (connectionData || user.id === userId) {
        const { data, error } = await supabase
          .from('credentials')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setCredentials(data || []);
      }
    } catch (error) {
      console.error('Error fetching credentials:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
        <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
        <div className={`${theme.card} p-8 rounded-2xl border ${theme.border}`}>
          <p className={theme.text}>Profile not found</p>
          <button onClick={onClose} className="mt-4 text-blue-400 hover:text-blue-300">
            Close
          </button>
        </div>
      </div>
    );
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <motion.div 
        className={`${theme.card} rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border ${theme.border}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        {/* Header */}
        <div className={`sticky top-0 bg-inherit p-6 border-b ${theme.border} flex justify-between items-center`}>
          <h2 className={`text-2xl font-bold ${theme.text}`}>Profile</h2>
          <button
            onClick={onClose}
            className={`${theme.textSecondary} hover:${theme.text} transition-colors`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <motion.div variants={fadeInUp} initial="initial" animate="animate">
            {/* Profile Header */}
            <div className="flex items-center space-x-6 mb-8">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                {profile.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-white" />
                )}
              </div>
              <div>
                <h3 className={`text-3xl font-bold ${theme.text} mb-2`}>
                  {profile.name || 'Anonymous User'}
                </h3>
                <div className={`flex items-center ${theme.textSecondary} mb-2`}>
                  <Mail className="w-4 h-4 mr-2" />
                  {profile.email}
                </div>
                <div className="flex space-x-4">
                  {profile.linkedin_url && (
                    <a
                      href={profile.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Linkedin className="w-4 h-4 mr-1" />
                      LinkedIn
                    </a>
                  )}
                  {profile.github_url && (
                    <a
                      href={profile.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      <Github className="w-4 h-4 mr-1" />
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Credentials Section */}
            <div>
              <h4 className={`text-2xl font-semibold mb-6 flex items-center ${theme.text}`}>
                <Award className={`w-6 h-6 mr-2 ${theme.accent}`} />
                Credentials ({credentials.length})
              </h4>
              
              {credentials.length === 0 ? (
                <div className="text-center py-12">
                  <Award className={`w-16 h-16 ${theme.textSecondary} mx-auto mb-4`} />
                  <p className={`${theme.textSecondary} text-lg`}>No credentials shared</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {credentials.map((credential) => (
                    <motion.div
                      key={credential.id}
                      className={`${theme.card} ${theme.cardHover} p-6 rounded-xl border ${theme.border} transition-all duration-300`}
                      whileHover={{ y: -5, scale: 1.02 }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${theme.button} rounded-xl flex items-center justify-center`}>
                          <Award className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <span className={`px-3 py-1 bg-gradient-to-r ${theme.button} rounded-full text-xs font-medium text-white`}>
                            {credential.type}
                          </span>
                          {/* Verification Status */}
                          {credential.evidence_url ? (
                            <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium border border-green-500/30">
                              ✓ Verified
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium border border-yellow-500/30">
                              ⚠ Non Verified
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <h5 className="text-lg font-semibold text-white mb-2">{credential.name}</h5>
                      <p className={`${theme.textSecondary} text-sm mb-3`}>{credential.issuer}</p>
                      
                      <div className={`flex items-center ${theme.textSecondary} text-sm mb-4`}>
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(credential.issue_date).toLocaleDateString()}
                      </div>
                      
                      {credential.evidence_url && (
                        <a
                          href={credential.evidence_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center text-sm font-medium ${theme.accent} hover:text-blue-300 transition-colors`}
                        >
                          View Certificate
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}