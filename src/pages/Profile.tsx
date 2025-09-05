import { useState } from "react";
import { User, Mail, Linkedin, Github, Twitter, Save } from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: "Prathamesh",
    email: "youremail@example.com",
    linkedin: "",
    github: "",
    twitter: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Save profile logic here
    console.log("Profile saved:", profile);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Profile Settings</h2>
        <p className="text-gray-300">Manage your personal information and social links</p>
      </div>

      <div className="bg-[#11152e] rounded-2xl p-8 border border-gray-800">
        <div className="space-y-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Profile Picture</h3>
              <p className="text-gray-400">Upload a professional photo</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <User className="inline w-4 h-4 mr-2" />
                Full Name
              </label>
              <input 
                name="name" 
                value={profile.name} 
                onChange={handleChange} 
                placeholder="Full Name"
                className="w-full p-4 bg-[#1a1d3a] border border-gray-600 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Mail className="inline w-4 h-4 mr-2" />
                Email Address
              </label>
              <input 
                name="email" 
                value={profile.email} 
                onChange={handleChange} 
                placeholder="Email"
                className="w-full p-4 bg-[#1a1d3a] border border-gray-600 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Linkedin className="inline w-4 h-4 mr-2" />
                LinkedIn Profile
              </label>
              <input 
                name="linkedin" 
                value={profile.linkedin} 
                onChange={handleChange} 
                placeholder="LinkedIn URL"
                className="w-full p-4 bg-[#1a1d3a] border border-gray-600 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Github className="inline w-4 h-4 mr-2" />
                GitHub Profile
              </label>
              <input 
                name="github" 
                value={profile.github} 
                onChange={handleChange} 
                placeholder="GitHub URL"
                className="w-full p-4 bg-[#1a1d3a] border border-gray-600 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Twitter className="inline w-4 h-4 mr-2" />
                Twitter Profile
              </label>
              <input 
                name="twitter" 
                value={profile.twitter} 
                onChange={handleChange} 
                placeholder="Twitter URL"
                className="w-full p-4 bg-[#1a1d3a] border border-gray-600 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <button 
              onClick={handleSave}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}