import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings, Trash2, Shield, Bell, Activity, Key, Eye, EyeOff, Palette } from "lucide-react";
import { useProfile } from "../hooks/useProfile";
import { useTheme, themes, type Theme } from "../hooks/useTheme";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function SettingsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  // Theme management
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('skillpassport-theme');
    return (saved as Theme) || 'theme1';
  });

  const theme = useTheme(currentTheme);
  const { profile, updateProfile } = useProfile(user?.id);

  const [activityLog] = useState([
    { action: "Profile updated", date: "2024-01-15", type: "profile" },
    { action: "New connection: Alice Johnson", date: "2024-01-14", type: "connection" },
    { action: "Avatar uploaded", date: "2024-01-13", type: "profile" },
    { action: "LinkedIn profile linked", date: "2024-01-12", type: "profile" }
  ]);

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

  useEffect(() => {
    // Apply theme to document
    document.documentElement.className = currentTheme;
    localStorage.setItem('skillpassport-theme', currentTheme);
  }, [currentTheme]);

  const handleThemeChange = async (newTheme: Theme) => {
    setCurrentTheme(newTheme);
    
    try {
      if (profile) {
        await updateProfile({ theme: newTheme });
        setMessage({ type: 'success', text: `Switched to ${themes[newTheme].name}!` });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setPasswordData({ newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone and will remove all your data including profile, connections, and credentials."
    );
    
    if (!confirmed) return;

    const doubleConfirm = window.confirm(
      "This is your final warning. Deleting your account will permanently remove all your data. Are you absolutely sure?"
    );

    if (!doubleConfirm) return;

    try {
      // Delete user account (this will cascade delete profile and connections due to foreign key constraints)
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      
      if (error) throw error;

      // Sign out and redirect
      await supabase.auth.signOut();
      localStorage.removeItem("visited");
      navigate("/");
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-b ${theme.background} ${theme.text} flex items-center justify-center`}>
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
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <motion.div
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        <motion.div className="mb-8" variants={fadeInUp}>
          <h2 className={`text-2xl sm:text-3xl font-bold mb-2 flex items-center ${theme.text}`}>
            <Settings className={`w-6 sm:w-8 h-6 sm:h-8 mr-3 ${theme.accent}`} />
            Settings
          </h2>
          <p className={theme.textSecondary}>Manage your account preferences and security settings</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Appearance Settings */}
          <motion.div className={`${theme.card} rounded-2xl p-6 ${theme.border} border`} variants={fadeInUp}>
            <h3 className={`text-xl font-semibold mb-6 flex items-center ${theme.text}`}>
              <Palette className={`w-5 h-5 mr-2 ${theme.accent}`} />
              Appearance
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${theme.textSecondary} mb-3`}>
                  Theme Selection
                </label>
                <select
                  value={currentTheme}
                  onChange={(e) => handleThemeChange(e.target.value as Theme)}
                  className={`w-full p-3 ${theme.card} border ${theme.border} rounded-xl ${theme.text} focus:border-blue-500 focus:outline-none transition-colors`}
                >
                  {Object.entries(themes).map(([key, themeData]) => (
                    <option key={key} value={key} className={theme.card}>
                      {themeData.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className={`font-medium ${theme.text}`}>Notifications</p>
                  <p className={`text-sm ${theme.textSecondary}`}>Receive updates about your credentials</p>
                </div>
                <button
                  className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-green-600"
                >
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Security Settings */}
          <motion.div className={`${theme.card} rounded-2xl p-6 ${theme.border} border`} variants={fadeInUp}>
            <h3 className={`text-xl font-semibold mb-6 flex items-center ${theme.text}`}>
              <Shield className="w-5 h-5 mr-2 text-green-400" />
              Security
            </h3>
            
            <div className="space-y-4">
              <button 
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className={`w-full bg-gradient-to-r ${theme.button} ${theme.buttonHover} py-3 px-4 rounded-xl font-medium transition-colors text-left flex items-center text-white`}
              >
                <Key className="w-4 h-4 mr-2" />
                Change Password
              </button>

              {showPasswordForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`space-y-4 p-4 ${theme.card} rounded-xl border ${theme.border}`}
                >
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="New Password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      className={`w-full p-3 ${theme.card} border ${theme.border} rounded-xl ${theme.text} focus:border-blue-500 focus:outline-none transition-colors pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${theme.textSecondary} hover:${theme.text}`}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm New Password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    className={`w-full p-3 ${theme.card} border ${theme.border} rounded-xl ${theme.text} focus:border-blue-500 focus:outline-none transition-colors`}
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handlePasswordChange}
                      className="flex-1 bg-green-600 hover:bg-green-700 py-2 px-4 rounded-lg font-medium transition-colors text-white"
                    >
                      Update Password
                    </button>
                    <button
                      onClick={() => {
                        setShowPasswordForm(false);
                        setPasswordData({ newPassword: '', confirmPassword: '' });
                      }}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 py-2 px-4 rounded-lg font-medium transition-colors text-white"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}
              
              <button className="w-full bg-purple-600 hover:bg-purple-700 py-3 px-4 rounded-xl font-medium transition-colors text-left text-white">
                Enable Two-Factor Authentication
              </button>
              
              <button className="w-full bg-gray-600 hover:bg-gray-700 py-3 px-4 rounded-xl font-medium transition-colors text-left text-white">
                Download Account Data
              </button>
              
              <button 
                onClick={handleDeleteAccount}
                className="w-full bg-red-600 hover:bg-red-700 py-3 px-4 rounded-xl font-medium transition-colors text-left flex items-center text-white"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </button>
            </div>
          </motion.div>
        </div>

        {/* Activity Log */}
        <motion.div className={`mt-8 ${theme.card} rounded-2xl p-6 ${theme.border} border`} variants={fadeInUp}>
          <h3 className={`text-xl font-semibold mb-6 flex items-center ${theme.text}`}>
            <Activity className="w-5 h-5 mr-2 text-purple-400" />
            Recent Activity
          </h3>
          
          <div className="space-y-3">
            {activityLog.map((activity, index) => (
              <div 
                key={index} 
                className={`${theme.card} p-4 rounded-xl border ${theme.border} ${theme.cardHover} transition-colors`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      activity.type === 'credential' ? 'bg-blue-400' :
                      activity.type === 'verification' ? 'bg-green-400' :
                      activity.type === 'profile' ? 'bg-purple-400' : 'bg-yellow-400'
                    }`}></div>
                    <p className={`${theme.text} font-medium`}>{activity.action}</p>
                  </div>
                  <p className={`${theme.textSecondary} text-sm`}>{activity.date}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}