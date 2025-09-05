import { useState } from "react";
import { Settings, Moon, Sun, Trash2, Shield, Bell, Activity } from "lucide-react";

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [activityLog] = useState([
    { action: "Issued credential: Blockchain Basics", date: "2024-01-15", type: "credential" },
    { action: "Verified credential: AWS Certificate", date: "2024-01-14", type: "verification" },
    { action: "Profile updated", date: "2024-01-13", type: "profile" },
    { action: "New connection: Alice Johnson", date: "2024-01-12", type: "connection" }
  ]);

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      console.log("Account deletion requested");
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 flex items-center">
          <Settings className="w-8 h-8 mr-3 text-blue-400" />
          Settings
        </h2>
        <p className="text-gray-300">Manage your account preferences and security settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Appearance Settings */}
        <div className="bg-[#11152e] rounded-2xl p-6 border border-gray-800">
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            {darkMode ? <Moon className="w-5 h-5 mr-2 text-blue-400" /> : <Sun className="w-5 h-5 mr-2 text-yellow-400" />}
            Appearance
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Dark Mode</p>
                <p className="text-sm text-gray-400">Toggle between light and dark themes</p>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  darkMode ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    darkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Notifications</p>
                <p className="text-sm text-gray-400">Receive updates about your credentials</p>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications ? 'bg-green-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-[#11152e] rounded-2xl p-6 border border-gray-800">
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-green-400" />
            Security
          </h3>
          
          <div className="space-y-4">
            <button className="w-full bg-blue-600 hover:bg-blue-700 py-3 px-4 rounded-xl font-medium transition-colors text-left">
              Change Password
            </button>
            
            <button className="w-full bg-purple-600 hover:bg-purple-700 py-3 px-4 rounded-xl font-medium transition-colors text-left">
              Enable Two-Factor Authentication
            </button>
            
            <button className="w-full bg-gray-600 hover:bg-gray-700 py-3 px-4 rounded-xl font-medium transition-colors text-left">
              Download Account Data
            </button>
            
            <button 
              onClick={handleDeleteAccount}
              className="w-full bg-red-600 hover:bg-red-700 py-3 px-4 rounded-xl font-medium transition-colors text-left flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Activity Log */}
      <div className="mt-8 bg-[#11152e] rounded-2xl p-6 border border-gray-800">
        <h3 className="text-xl font-semibold mb-6 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-purple-400" />
          Recent Activity
        </h3>
        
        <div className="space-y-3">
          {activityLog.map((activity, index) => (
            <div 
              key={index} 
              className="bg-[#1a1d3a] p-4 rounded-xl border border-gray-700 hover:bg-[#2a2d55] transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    activity.type === 'credential' ? 'bg-blue-400' :
                    activity.type === 'verification' ? 'bg-green-400' :
                    activity.type === 'profile' ? 'bg-purple-400' : 'bg-yellow-400'
                  }`}></div>
                  <p className="text-white font-medium">{activity.action}</p>
                </div>
                <p className="text-gray-400 text-sm">{activity.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}