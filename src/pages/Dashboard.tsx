import { useState } from "react";
import Navbar from "../components/Navbar";
import CredentialModal from "../components/CredentialModal";
import ProfilePage from "./Profile";
import ConnectionsPage from "./Connections";
import SettingsPage from "./Settings";
import type { UserStats } from "../types";

export default function Dashboard() {
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  
  const userStats: UserStats = {
    credentials: 0,
    verifiedSkills: 0,
    profileViews: 247,
    connections: 89
  };

  const statsCards = [
    { label: "Credentials", value: userStats.credentials, color: "from-blue-500 to-blue-600" },
    { label: "Verified Skills", value: userStats.verifiedSkills, color: "from-green-500 to-green-600" },
    { label: "Profile Views", value: userStats.profileViews, color: "from-purple-500 to-purple-600" },
    { label: "Connections", value: userStats.connections, color: "from-pink-500 to-pink-600" }
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
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Welcome back, Prathamesh ✨</h2>
              <p className="text-gray-300 text-lg">Manage your digital skill passport and track your progress.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {statsCards.map((stat, index) => (
                <div 
                  key={index}
                  className="bg-[#11152e] hover:bg-[#1a1d3a] p-6 rounded-2xl shadow-lg border border-gray-800 transition-all duration-300 hover:scale-105"
                >
                  <div className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="bg-[#11152e] rounded-2xl p-8 border border-gray-800">
              <h3 className="text-2xl font-semibold mb-4">Recent Credentials</h3>
              
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🏆</div>
                <p className="text-gray-400 text-lg mb-6">No Credentials Yet</p>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  Start building your professional reputation by adding your first credential to showcase your expertise.
                </p>
                
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  Add Your First Credential
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0f2c] to-[#1c1f40] text-white">
      <Navbar setShowModal={setShowModal} currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {renderCurrentPage()}

      {showModal && <CredentialModal setShowModal={setShowModal} />}
    </div>
  );
}