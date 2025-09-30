import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { User, Mail, Linkedin, Github, Save, Camera, Upload } from "lucide-react";
import { useProfile } from "../hooks/useProfile";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useTheme, type Theme } from "../hooks/useTheme";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Theme management
  const currentTheme = (localStorage.getItem('skillpassport-theme') as Theme) || 'theme1';
  const theme = useTheme(currentTheme);

  const { profile, updateProfile, uploadAvatar, refetch } = useProfile(user?.id);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    linkedin_url: '',
    github_url: ''
  });

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
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        linkedin_url: profile.linkedin_url || '',
        github_url: profile.github_url || ''
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (message.text) setMessage({ type: '', text: '' });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateProfile(formData);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select an image file' });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image must be less than 2MB' });
      return;
    }

    try {
      setUploading(true);
      await uploadAvatar(file);
      setMessage({ type: 'success', text: 'Avatar updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setUploading(false);
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

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <motion.div
        initial="initial"
        animate="animate"
        variants={fadeInUp}
      >
        <div className="mb-8">
          <h2 className={`text-2xl sm:text-3xl font-bold mb-2 ${theme.text}`}>Profile Settings</h2>
          <p className={theme.textSecondary}>Manage your personal information and social links</p>
        </div>

        <div className={`${theme.card} rounded-2xl p-6 sm:p-8 border ${theme.border}`}>
          <div className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center space-x-6 mb-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  {profile?.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-white" />
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute -bottom-2 -right-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 p-2 rounded-full transition-colors"
                >
                  {uploading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Camera className="w-4 h-4 text-white" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Profile Picture</h3>
                <p className={theme.textSecondary}>Upload a professional photo (max 2MB)</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="mt-2 text-blue-400 hover:text-blue-300 text-sm font-medium disabled:text-gray-500 flex items-center space-x-1"
                >
                  <Upload className="w-4 h-4" />
                  <span>{uploading ? 'Uploading...' : 'Change Photo'}</span>
                </button>
              </div>
            </div>

            {/* Message Display */}
            {message.text && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl text-sm font-medium ${
                  message.type === 'error' 
                    ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                    : 'bg-green-500/20 text-green-300 border border-green-500/30'
                }`}
              >
                {message.text}
              </motion.div>
            )}

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <User className="inline w-4 h-4 mr-2" />
                  Full Name
                </label>
                <input 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  placeholder="Enter your full name"
                  className={`w-full p-4 ${theme.card} border ${theme.border} rounded-xl ${theme.text} focus:border-blue-500 focus:outline-none transition-colors`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Mail className="inline w-4 h-4 mr-2" />
                  Email Address
                </label>
                <input 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  placeholder="Enter your email"
                  type="email"
                  className={`w-full p-4 ${theme.card} border ${theme.border} rounded-xl ${theme.text} focus:border-blue-500 focus:outline-none transition-colors`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Linkedin className="inline w-4 h-4 mr-2" />
                  LinkedIn Profile
                </label>
                <input 
                  name="linkedin_url" 
                  value={formData.linkedin_url} 
                  onChange={handleChange} 
                  placeholder="https://linkedin.com/in/username"
                  className={`w-full p-4 ${theme.card} border ${theme.border} rounded-xl ${theme.text} focus:border-blue-500 focus:outline-none transition-colors`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Github className="inline w-4 h-4 mr-2" />
                  GitHub Profile
                </label>
                <input 
                  name="github_url" 
                  value={formData.github_url} 
                  onChange={handleChange} 
                  placeholder="https://github.com/username"
                  className={`w-full p-4 ${theme.card} border ${theme.border} rounded-xl ${theme.text} focus:border-blue-500 focus:outline-none transition-colors`}
                />
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <motion.button 
                onClick={handleSave}
                disabled={saving}
                className={`bg-gradient-to-r ${theme.button} ${theme.buttonHover} disabled:from-gray-600 disabled:to-gray-700 px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:scale-100 flex items-center space-x-2 text-white`}
                whileHover={{ scale: saving ? 1 : 1.05 }}
                whileTap={{ scale: saving ? 1 : 0.95 }}
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Save className="w-5 h-5" />
                )}
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}