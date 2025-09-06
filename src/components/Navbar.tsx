import type { NavbarProps } from "../types";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Navbar({ setShowModal, currentPage, setCurrentPage }: NavbarProps) {
  const navigate = useNavigate();

  const navItems = [
    { label: "Home", key: "dashboard" },
    { label: "Profile", key: "profile" },
    { label: "Connections", key: "connections" },
    { label: "Settings", key: "settings" }
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("visited");
    navigate("/");
  };
  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-[#11152e] border-b border-gray-800">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        SkillPassport
      </h1>
      
      <div className="hidden md:flex space-x-6">
        {navItems.map((item, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(item.key)}
            className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
              currentPage === item.key
                ? 'text-blue-400 bg-blue-400/10' 
                : 'text-gray-300 hover:text-white hover:bg-gray-800'
            }`}
          >
            {item.label}
          </button>
        ))}
        
        <button 
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
        >
          Add Credential
        </button>
      </div>

        <button 
          onClick={handleLogout}
          className="text-gray-300 hover:text-red-400 px-3 py-2 rounded-lg font-medium transition-all duration-200"
        >
          Logout
        </button>
      {/* Mobile menu button */}
      <button className="md:hidden text-gray-300 hover:text-white">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </nav>
  );
}