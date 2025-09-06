import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, UserPlus, Search, UserMinus, User } from "lucide-react";
import { useConnections } from "../hooks/useConnections";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function ConnectionsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState({ type: '', text: '' });

  const { connections, availableUsers, addConnection, removeConnection, refetch } = useConnections(user?.id);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
      } else {
        setUser(user);
      }
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  const handleConnect = async (connectionId: string) => {
    try {
      await addConnection(connectionId);
      setMessage({ type: 'success', text: 'Connection added successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleDisconnect = async (connectionId: string) => {
    try {
      await removeConnection(connectionId);
      setMessage({ type: 'success', text: 'Connection removed successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const filteredAvailableUsers = availableUsers.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredConnections = connections.filter(connection =>
    connection.profiles?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    connection.profiles?.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0f2c] to-[#1c1f40] text-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <motion.div
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        <motion.div className="mb-8" variants={fadeInUp}>
          <h2 className="text-3xl font-bold mb-2 flex items-center">
            <Users className="w-8 h-8 mr-3 text-blue-400" />
            Professional Connections
          </h2>
          <p className="text-gray-300">Build and manage your professional network</p>
        </motion.div>

        {/* Message Display */}
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-xl text-sm font-medium ${
              message.type === 'error' 
                ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                : 'bg-green-500/20 text-green-300 border border-green-500/30'
            }`}
          >
            {message.text}
          </motion.div>
        )}

        {/* Search */}
        <motion.div className="mb-8" variants={fadeInUp}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search connections and users..."
              className="w-full pl-12 pr-4 py-4 bg-[#11152e] border border-gray-600 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>
        </motion.div>

        {/* My Connections */}
        <motion.div className="mb-12" variants={fadeInUp}>
          <h3 className="text-2xl font-semibold mb-6 flex items-center">
            <Users className="w-6 h-6 mr-2 text-green-400" />
            My Connections ({filteredConnections.length})
          </h3>
          
          {filteredConnections.length === 0 ? (
            <div className="bg-[#11152e] rounded-2xl p-8 border border-gray-800 text-center">
              <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No connections found</p>
              <p className="text-gray-500">Start connecting with other professionals</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredConnections.map((connection) => (
                <motion.div 
                  key={connection.id} 
                  className="bg-[#11152e] hover:bg-[#1a1d3a] p-6 rounded-2xl border border-gray-800 transition-all duration-300"
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      {connection.profiles?.avatar_url ? (
                        <img 
                          src={connection.profiles.avatar_url} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-lg">
                        {connection.profiles?.name || 'Anonymous User'}
                      </h4>
                      <p className="text-gray-400 text-sm">{connection.profiles?.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleDisconnect(connection.connection_id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                    >
                      <UserMinus className="w-4 h-4" />
                      <span>Disconnect</span>
                    </button>
                    {connection.profiles?.linkedin_url && (
                      <a
                        href={connection.profiles.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors text-center"
                      >
                        LinkedIn
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Available Users */}
        <motion.div variants={fadeInUp}>
          <h3 className="text-2xl font-semibold mb-6 flex items-center">
            <UserPlus className="w-6 h-6 mr-2 text-blue-400" />
            Connect with Others ({filteredAvailableUsers.length})
          </h3>
          
          {filteredAvailableUsers.length === 0 ? (
            <div className="bg-[#11152e] rounded-2xl p-8 border border-gray-800 text-center">
              <UserPlus className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No users available to connect</p>
              <p className="text-gray-500">All users are already in your network</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAvailableUsers.map((availableUser) => (
                <motion.div 
                  key={availableUser.id} 
                  className="bg-[#11152e] hover:bg-[#1a1d3a] p-6 rounded-2xl border border-gray-800 transition-all duration-300"
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center">
                      {availableUser.avatar_url ? (
                        <img 
                          src={availableUser.avatar_url} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-lg">
                        {availableUser.name || 'Anonymous User'}
                      </h4>
                      <p className="text-gray-400 text-sm">{availableUser.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleConnect(availableUser.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Connect</span>
                    </button>
                    {availableUser.linkedin_url && (
                      <a
                        href={availableUser.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors text-center"
                      >
                        LinkedIn
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}