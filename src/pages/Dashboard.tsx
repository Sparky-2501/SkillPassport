import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Award, Calendar, ExternalLink, FileText, User, Eye } from "lucide-react";
import Navbar from "../components/Navbar";
import CredentialModal from "../components/CredentialModal";
import ProfilePage from "./Profile";
import ConnectionsPage from "./Connections";
import SettingsPage from "./Settings";
import { useCredentials } from "../hooks/useCredentials";
import { useTheme, type Theme } from "../hooks/useTheme";
import type { UserStats } from "../types";
import { supabase } from "../supabaseClient";
import { useProfile } from "../hooks/useProfile";
import { useConnections } from "../hooks/useConnections";

export default function Dashboard() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Theme management
  const currentTheme = (localStorage.getItem('skillpassport-theme') as Theme) || 'theme1';
  const theme = useTheme(currentTheme);

  const { profile } = useProfile(user?.id);
  const { connections } = useConnections(user?.id);
  const { credentials, refetch: refetchCredentials } = useCredentials(user?.id);
  
  // Check authentication status
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

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate('/login');
      } else if (session?.user) {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.className = currentTheme;
  }, [currentTheme]);

  const handleCredentialSuccess = () => {
    refetchCredentials();
  };

  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-b ${theme.background} text-white flex items-center justify-center`}>
        <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const userStats: UserStats = {
    credentials: credentials.length,
    verifiedSkills: credentials.length,
    profileViews: 247,
    connections: connections.length
  };

  const statsCards = [
    { label: "Credentials", value: userStats.credentials, color: theme.button, icon: Award },
    { label: "Verified Skills", value: userStats.verifiedSkills, color: "from-green-500 to-green-600", icon: FileText },
    { label: "Profile Views", value: userStats.profileViews, color: "from-purple-500 to-purple-600", icon: Eye },
    { label: "Connections", value: userStats.connections, color: "from-pink-500 to-pink-600", icon: User }
  ];

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "profile":
        return <ProfilePage />;
      case "connections":
        return <ConnectionsPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return (
          <div className="p-6 max-w-7xl mx-auto">
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-2">
                Welcome back, {profile?.name || user?.email?.split('@')[0] || 'User'} ✨
              </h2>
              <p className="text-gray-300 text-lg">Manage your digital skill passport and track your progress.</p>
            </motion.div>

            {/* Stats Cards */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {statsCards.map((stat, index) => (
                <motion.div 
                  key={index}
                  className={`${theme.card} ${theme.cardHover} p-6 rounded-2xl shadow-lg border ${theme.border} transition-all duration-300`}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <stat.icon className={`w-8 h-8 ${theme.accent}`} />
                    <div className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                      {stat.value}
                    </div>
                  </div>
                  <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Credentials Section */}
            <motion.div 
              className={`${theme.card} rounded-2xl p-8 border ${theme.border}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold flex items-center">
                  <Award className={`w-6 h-6 mr-2 ${theme.accent}`} />
                  My Credentials ({credentials.length})
                </h3>
                <button
                  onClick={() => setShowModal(true)}
                  className={`bg-gradient-to-r ${theme.button} ${theme.buttonHover} px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105`}
                >
                  Add Credential
                </button>
              </div>
              
              {credentials.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🏆</div>
                  <p className="text-gray-400 text-lg mb-6">No Credentials Yet</p>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    Start building your professional reputation by adding your first credential to showcase your expertise.
                  </p>
                  
                  <button
                    onClick={() => setShowModal(true)}
                    className={`bg-gradient-to-r ${theme.button} ${theme.buttonHover} px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg`}
                  >
                    Add Your First Credential
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                        <span className={`px-3 py-1 bg-gradient-to-r ${theme.button} rounded-full text-xs font-medium text-white`}>
                          {credential.type}
                        </span>
                      </div>
                      
                      <h4 className="text-lg font-semibold text-white mb-2">{credential.name}</h4>
                      <p className="text-gray-400 text-sm mb-3">{credential.issuer}</p>
                      
                      <div className="flex items-center text-gray-500 text-sm mb-4">
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
                          <FileText className="w-4 h-4 mr-1" />
                          View Certificate
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b ${theme.background} text-white`}>
      <Navbar setShowModal={setShowModal} currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {renderCurrentPage()}

      {showModal && user && (
        <CredentialModal 
          setShowModal={setShowModal} 
          userId={user.id}
          onSuccess={handleCredentialSuccess}
        />
      )}
    </div>
  );
}