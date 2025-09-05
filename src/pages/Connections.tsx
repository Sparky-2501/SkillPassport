import { useState } from "react";
import { Users, Plus, UserPlus, Search } from "lucide-react";

export default function ConnectionsPage() {
  const [connections, setConnections] = useState([
    { name: "Alice Johnson", role: "Software Engineer", company: "Google" },
    { name: "Bob Smith", role: "Product Manager", company: "Microsoft" }
  ]);
  const [newName, setNewName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleAdd = () => {
    if (newName.trim()) {
      setConnections([...connections, { 
        name: newName, 
        role: "Professional", 
        company: "Various" 
      }]);
      setNewName("");
    }
  };

  const filteredConnections = connections.filter(connection =>
    connection.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 flex items-center">
          <Users className="w-8 h-8 mr-3 text-blue-400" />
          Professional Connections
        </h2>
        <p className="text-gray-300">Build and manage your professional network</p>
      </div>

      {/* Add Connection */}
      <div className="bg-[#11152e] rounded-2xl p-6 border border-gray-800 mb-8">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <UserPlus className="w-5 h-5 mr-2 text-green-400" />
          Add New Connection
        </h3>
        <div className="flex gap-4">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Enter connection name"
            className="flex-grow p-4 bg-[#1a1d3a] border border-gray-600 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-colors"
          />
          <button 
            onClick={handleAdd} 
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search connections..."
            className="w-full pl-12 pr-4 py-4 bg-[#11152e] border border-gray-600 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Connections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredConnections.map((connection, index) => (
          <div 
            key={index} 
            className="bg-[#11152e] hover:bg-[#1a1d3a] p-6 rounded-2xl border border-gray-800 transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-lg">{connection.name}</h4>
                <p className="text-gray-400 text-sm">{connection.role}</p>
              </div>
            </div>
            <div className="text-gray-300 text-sm">
              <span className="text-blue-400">Company:</span> {connection.company}
            </div>
            <div className="mt-4 flex space-x-2">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                View Profile
              </button>
              <button className="flex-1 bg-gray-600 hover:bg-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                Message
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredConnections.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No connections found</p>
          <p className="text-gray-500">Start building your professional network</p>
        </div>
      )}
    </div>
  );
}