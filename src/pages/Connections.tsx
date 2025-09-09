import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, UserPlus, Search, UserMinus, User, UserCheck, UserX, Eye } from "lucide-react";
import { useConnections } from "../hooks/useConnections";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import UserProfile from "../components/UserProfile";
import { useTheme, type Theme } from "../hooks/useTheme";

export default function ConnectionsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState<'discover' | 'connections' | 'requests'>('discover');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const currentTheme = (localStorage.getItem('skillpassport-theme') as Theme) || 'theme1';
  const theme = useTheme(currentTheme);

  const { connections, pendingRequests, sentRequests, availableUsers, addConnection, acceptConnection, rejectConnection, removeConnection, refetch } = useConnections(user?.id);

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
      setMessage({ type: 'success', text: 'Connection request sent!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleAccept = async (requestId: string) => {
    try {
      await acceptConnection(requestId);
      setMessage({ type: 'success', text: 'Connection accepted!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await rejectConnection(requestId);
      setMessage({ type: 'success', text: 'Connection request rejected' });
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

  const getFilteredData = () => {
    switch (activeTab) {
      case 'discover':
        return availableUsers.filter(user =>
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case 'connections':
        return connections.filter(connection =>
          connection.profiles?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          connection.profiles?.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case 'requests':
        return pendingRequests.filter(request =>
          request.profiles?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.profiles?.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      default:
        return [];
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-b ${theme.background} text-white flex items-center justify-center`}>
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

  const filteredData = getFilteredData();

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <motion.div
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        <motion.div className="mb-8" variants={fadeInUp}>
          <h2 className="text-3xl font-bold mb-2 flex items-center">
            <Users className={`w-8 h-8 mr-3 ${theme.accent}`} />
            Professional Network
          </h2>
          <p className="text-gray-300">Discover, connect, and grow your professional network</p>
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

        {/* Tabs */}
        <motion.div className="mb-8" variants={fadeInUp}>
          <div className="flex space-x-1 bg-white/5 p-1 rounded-xl">
            {[
              { key: 'discover', label: 'Discover People', count: availableUsers.length },
              { key: 'connections', label: 'My Connections', count: connections.length },
              { key: 'requests', label: 'Requests', count: pendingRequests.length }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.key
                    ? `bg-gradient-to-r ${theme.button} text-white shadow-lg`
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </motion.div>

        {/* Search */}
        <motion.div className="mb-8" variants={fadeInUp}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search ${activeTab === 'discover' ? 'people' : activeTab}...`}
              className={`w-full pl-12 pr-4 py-4 ${theme.card} border border-gray-600 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-colors`}
            />
          </div>
        </motion.div>

        {/* Content */}
        <motion.div variants={fadeInUp}>
          {filteredData.length === 0 ? (
            <div className={`${theme.card} rounded-2xl p-12 border ${theme.border} text-center`}>
              <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-2">
                {activeTab === 'discover' && 'No new people to discover'}
                {activeTab === 'connections' && 'No connections yet'}
                {activeTab === 'requests' && 'No pending requests'}
              </p>
              <p className="text-gray-500">
                {activeTab === 'discover' && 'All users are already in your network'}
                {activeTab === 'connections' && 'Start connecting with other professionals'}
                {activeTab === 'requests' && 'Connection requests will appear here'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Discover People */}
              {activeTab === 'discover' && filteredData.map((availableUser: any) => (
                <motion.div 
                  key={availableUser.id} 
                  className={`${theme.card} ${theme.cardHover} p-6 rounded-2xl border ${theme.border} transition-all duration-300`}
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
                    <div className="flex-1">
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
                    <button
                      onClick={() => setSelectedUserId(availableUser.id)}
                      className="bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}

              {/* My Connections */}
              {activeTab === 'connections' && filteredData.map((connection: any) => (
                <motion.div 
                  key={connection.id} 
                  className={`${theme.card} ${theme.cardHover} p-6 rounded-2xl border ${theme.border} transition-all duration-300`}
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
                    <div className="flex-1">
                      <h4 className="font-semibold text-white text-lg">
                        {connection.profiles?.name || 'Anonymous User'}
                      </h4>
                      <p className="text-gray-400 text-sm">{connection.profiles?.email}</p>
                      <p className="text-gray-500 text-xs">
                        Connected {new Date(connection.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedUserId(connection.connection_id)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Profile</span>
                    </button>
                    <button 
                      onClick={() => handleDisconnect(connection.connection_id)}
                      className="bg-red-600 hover:bg-red-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                    >
                      <UserMinus className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}

              {/* Pending Requests */}
              {activeTab === 'requests' && filteredData.map((request: any) => (
                <motion.div 
                  key={request.id} 
                  className={`${theme.card} ${theme.cardHover} p-6 rounded-2xl border ${theme.border} transition-all duration-300`}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-r from-yellow-500 to-orange-600 flex items-center justify-center">
                      {request.profiles?.avatar_url ? (
                        <img 
                          src={request.profiles.avatar_url} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white text-lg">
                        {request.profiles?.name || 'Anonymous User'}
                      </h4>
                      <p className="text-gray-400 text-sm">{request.profiles?.email}</p>
                      <p className="text-yellow-400 text-xs">
                        Sent {new Date(request.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleAccept(request.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Accept</span>
                    </button>
                    <button 
                      onClick={() => handleReject(request.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                    >
                      <UserX className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* User Profile Modal */}
      {selectedUserId && (
        <UserProfile
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
        />
      )}
    </div>
  );
}