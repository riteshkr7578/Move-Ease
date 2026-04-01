import { useState, useEffect } from "react";
import api from "../api";
import { Trash2, Users, Truck, Calendar } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [movers, setMovers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, usersRes, moversRes] = await Promise.all([
          api.get("/api/admin/stats"),
          api.get("/api/admin/users"),
          api.get("/api/admin/movers"),
        ]);
        console.log("Admin Data:", { stats: statsRes.data, users: usersRes.data, movers: moversRes.data });
        setStats(statsRes.data);
        setUsers(usersRes.data);
        setMovers(moversRes.data);
      } catch (err) {
        console.error("Failed to fetch admin data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id, type) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/api/admin/user/${id}`);
        if (type === 'user') setUsers(users.filter(u => u._id !== id));
        else setMovers(movers.filter(m => m._id !== id));
      } catch (err) {
        alert("Deletion failed");
      }
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Admin Panel...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 pt-24 text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700 flex items-center gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Total Customers</h3>
              <p className="text-3xl font-bold text-blue-600">{stats?.totalUsers || 0}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700 flex items-center gap-4">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Truck className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Total Movers</h3>
              <p className="text-3xl font-bold text-green-600">{stats?.totalMovers || 0}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700 flex items-center gap-4">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Total Bookings</h3>
              <p className="text-3xl font-bold text-purple-600">{stats?.totalBookings || 0}</p>
            </div>
          </div>
        </div>

        {/* Lists Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Users Section */}
          <div className="flex flex-col h-[500px]">
            <h2 className="text-xl font-semibold mb-4 flex items-center justify-between">
              Manage Customers
              <span className="text-sm font-normal text-gray-500">Total: {users.length}</span>
            </h2>
            <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
                  <tr>
                    <th className="p-4 border-b dark:border-gray-600">Name</th>
                    <th className="p-4 border-b dark:border-gray-600">Email</th>
                    <th className="p-4 border-b dark:border-gray-600 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map(user => (
                      <tr key={user._id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="p-3 truncate max-w-[120px] text-sm text-gray-800 dark:text-gray-200">{user.name}</td>
                        <td className="p-3 truncate max-w-[180px] text-sm text-gray-600 dark:text-gray-400">{user.email}</td>
                        <td className="p-3 text-center">
                          <button 
                            onClick={() => handleDelete(user._id, 'user')}
                            className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-1.5 rounded-md hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white transition-all shadow-sm"
                            title="Delete user"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="p-10 text-center text-gray-500">No customers found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Movers Section */}
          <div className="flex flex-col h-[500px]">
            <h2 className="text-xl font-semibold mb-4 flex items-center justify-between">
              Manage Movers
              <span className="text-sm font-normal text-gray-500">Total: {movers.length}</span>
            </h2>
            <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
                  <tr>
                    <th className="p-4 border-b dark:border-gray-600">Name</th>
                    <th className="p-4 border-b dark:border-gray-600">Email</th>
                    <th className="p-4 border-b dark:border-gray-600 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {movers.length > 0 ? (
                    movers.map(mover => (
                      <tr key={mover._id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="p-3 truncate max-w-[120px] text-sm text-gray-800 dark:text-gray-200">{mover.name}</td>
                        <td className="p-3 truncate max-w-[180px] text-sm text-gray-600 dark:text-gray-400">{mover.email}</td>
                        <td className="p-3 text-center">
                          <button 
                            onClick={() => handleDelete(mover._id, 'mover')}
                            className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-1.5 rounded-md hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white transition-all shadow-sm"
                            title="Delete mover"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="p-10 text-center text-gray-500">No movers found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}