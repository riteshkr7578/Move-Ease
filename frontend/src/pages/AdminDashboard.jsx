import { useState, useEffect } from "react";
import api from "../api";
import { Trash2, Users, Truck, Calendar, TrendingUp, ShieldCheck, IndianRupee, Loader2, RefreshCcw, Plus, X, UserPlus, ShieldAlert } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [movers, setMovers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState("user"); // 'user' or 'mover'
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [modalLoading, setModalLoading] = useState(false);

  // Pagination State
  const [userPage, setUserPage] = useState(1);
  const [moverPage, setMoverPage] = useState(1);
  const itemsPerPage = 8;

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, moversRes] = await Promise.all([
        api.get("/api/admin/stats"),
        api.get("/api/admin/users"),
        api.get("/api/admin/movers"),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setMovers(moversRes.data);
    } catch (err) {
      console.error("Failed to fetch admin data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    try {
      await api.post("/api/auth/signup", {
        ...formData,
        role: modalType === 'customer' ? 'customer' : 'mover'
      });
      alert(`${modalType} added successfully!`);
      setShowAddModal(false);
      setFormData({ name: "", email: "", password: "" });
      fetchData();
    } catch (err) {
        console.error("Add failed:", err);
        alert(err.response?.data?.msg || "Failed to add account");
    } finally {
      setModalLoading(false);
    }
  };

  // Pagination Logic
  const indexOfLastUser = userPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalUserPages = Math.ceil(users.length / itemsPerPage);

  const indexOfLastMover = moverPage * itemsPerPage;
  const indexOfFirstMover = indexOfLastMover - itemsPerPage;
  const currentMovers = movers.slice(indexOfFirstMover, indexOfLastMover);
  const totalMoverPages = Math.ceil(movers.length / itemsPerPage);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-950">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 pt-4 text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Command Center</h1>
            <p className="text-gray-500 dark:text-gray-400">System overview and management</p>
          </div>
          <button 
            onClick={fetchData}
            className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm hover:shadow-md transition-shadow"
          >
            <RefreshCcw size={20} className="text-blue-600" />
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard icon={<Users className="text-blue-600" />} label="Total Customers" value={stats?.totalUsers || 0} color="bg-blue-50 dark:bg-blue-900/20" />
          <StatCard icon={<Truck className="text-green-600" />} label="Active Movers" value={stats?.totalMovers || 0} color="bg-green-50 dark:bg-green-900/20" />
          <StatCard icon={<Calendar className="text-purple-600" />} label="Total Bookings" value={stats?.totalBookings || 0} color="bg-purple-50 dark:bg-purple-900/20" />
          <StatCard icon={<IndianRupee className="text-orange-600" />} label="Total GMV" value={`₹${(stats?.totalRevenue || 0).toLocaleString()}`} color="bg-orange-50 dark:bg-orange-900/20" />
        </div>

        {/* Lists Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Users Section */}
          <div className="flex flex-col h-[500px]">
            <h2 className="text-xl font-semibold mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                 <Users className="text-blue-600" size={20}/>
                 Manage Customers
              </div>
              <div className="flex items-center gap-3">
                 <span className="text-sm font-normal text-gray-400">Total: {users.length}</span>
                 <button 
                  onClick={() => { setModalType("customer"); setShowAddModal(true); }}
                  className="p-1 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md transition-all"
                 >
                    <Plus size={12}/> ADD
                 </button>
              </div>
            </h2>
            <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 overflow-y-auto custom-scrollbar transition-all">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 dark:bg-gray-900 sticky top-0 z-10">
                  <tr>
                    <th className="p-4 border-b dark:border-gray-700">Name</th>
                    <th className="p-4 border-b dark:border-gray-700">Email</th>
                    <th className="p-4 border-b dark:border-gray-700 text-center text-xs uppercase font-black text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.length > 0 ? (
                    currentUsers.map(user => (
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
            {/* User Pagination */}
            <div className="flex items-center justify-between mt-4 px-2">
                <p className="text-[10px] text-gray-400 font-bold uppercase">Page {userPage} / {totalUserPages || 1}</p>
                <div className="flex gap-2">
                    <button 
                        disabled={userPage === 1}
                        onClick={() => setUserPage(userPage - 1)}
                        className="p-1.5 px-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-[10px] font-black disabled:opacity-30"
                    >PREV</button>
                    <button 
                        disabled={userPage >= totalUserPages}
                        onClick={() => setUserPage(userPage + 1)}
                        className="p-1.5 px-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-[10px] font-black disabled:opacity-30"
                    >NEXT</button>
                </div>
            </div>
          </div>

          {/* Movers Section */}
          <div className="flex flex-col h-[500px]">
            <h2 className="text-xl font-semibold mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                 <Truck className="text-blue-600" size={20}/>
                 Manage Movers
              </div>
              <div className="flex items-center gap-3">
                 <span className="text-sm font-normal text-gray-400">Total: {movers.length}</span>
                 <button 
                  onClick={() => { setModalType("mover"); setShowAddModal(true); }}
                  className="p-1 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md transition-all"
                 >
                    <Plus size={12}/> ADD
                 </button>
              </div>
            </h2>
            <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 overflow-y-auto custom-scrollbar transition-all">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 dark:bg-gray-900 sticky top-0 z-10">
                  <tr>
                    <th className="p-4 border-b dark:border-gray-700">Name</th>
                    <th className="p-4 border-b dark:border-gray-600">Email</th>
                    <th className="p-4 border-b dark:border-gray-600 text-center text-xs uppercase font-black text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentMovers.length > 0 ? (
                    currentMovers.map(mover => (
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
            {/* Mover Pagination */}
            <div className="flex items-center justify-between mt-4 px-2">
                <p className="text-[10px] text-gray-400 font-bold uppercase">Page {moverPage} / {totalMoverPages || 1}</p>
                <div className="flex gap-2">
                    <button 
                        disabled={moverPage === 1}
                        onClick={() => setMoverPage(moverPage - 1)}
                        className="p-1.5 px-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-[10px] font-black disabled:opacity-30"
                    >PREV</button>
                    <button 
                        disabled={moverPage >= totalMoverPages}
                        onClick={() => setMoverPage(moverPage + 1)}
                        className="p-1.5 px-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-[10px] font-black disabled:opacity-30"
                    >NEXT</button>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add User/Mover Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="p-6 border-b dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
               <h3 className="text-xl font-black uppercase italic tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                 <UserPlus className="text-blue-600" /> Add New {modalType}
               </h3>
               <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                 <X size={20} className="text-gray-500" />
               </button>
            </div>
            
            <form onSubmit={handleAddSubmit} className="p-8 space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl p-4 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
                  placeholder="e.g. John Doe"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl p-4 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Secure Password</label>
                <input 
                  type="password" 
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl p-4 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
                  placeholder="••••••••"
                />
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-start gap-3 border border-blue-100 dark:border-blue-800/30 mt-4">
                 <ShieldAlert className="text-blue-600 shrink-0" size={18} />
                 <p className="text-[10px] text-blue-700 dark:text-blue-300 font-bold leading-relaxed">
                   ADMIN OVERRIDE: This will bypass standard email verification and create a pre-verified {modalType} account.
                 </p>
              </div>

              <button 
                type="submit" 
                disabled={modalLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center uppercase tracking-widest text-xs"
              >
                {modalLoading ? <Loader2 className="animate-spin" size={20}/> : `CONFIRM & ADD ${modalType}`}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700 flex items-center gap-4 transition-transform hover:scale-[1.02]">
      <div className={`p-4 ${color} rounded-xl`}>
        {icon}
      </div>
      <div>
        <h3 className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">{label}</h3>
        <p className="text-2xl font-black text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}