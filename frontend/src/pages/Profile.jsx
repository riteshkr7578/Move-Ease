import { useState, useEffect } from "react";
import api, { BASE_URL } from "../api";

export default function Profile() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    profilePicture: "",
  });
  
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "" });
  const [passwordStatus, setPasswordStatus] = useState({ error: "", success: "" });

  // Automatically configure Axios with Bearer token globally via api.js if you are using it (assuming yes). 
  // Let's use direct headers if not.
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/api/user/me");
      setUser(res.data.user);
      
      // Keep localStorage in sync with database so Navbar updates properly
      const currentUserData = JSON.parse(localStorage.getItem("user")) || {};
      const updatedUser = { ...currentUserData, ...res.data.user };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("userUpdated"));
      
      setPreview(null);
      setLoading(false);
    } catch (err) {
      console.error("Failed to load profile", err);
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("email", user.email);
    formData.append("phone", user.phone || "");
    if (file) {
      formData.append("profilePicture", file);
    }

    try {
      const res = await api.put("/api/user/me", formData);
      
      // Update local storage with new details (if needed by Navbar)
      const currentUserData = JSON.parse(localStorage.getItem("user")) || {};
      const updatedUser = { ...currentUserData, ...res.data.user };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      // Dispatch custom event to notify Navbar without reload
      window.dispatchEvent(new Event("userUpdated"));
      
      setUser(res.data.user);
      setMessage("Profile updated successfully!");
      setFile(null); // Clear selected file state
      setPreview(null); // Clear preview

    } catch (err) {
      console.error(err);
      setMessage("Error updating profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordStatus({ error: "", success: "" });
    try {
      await api.put("/api/user/change-password", passwordData);
      setPasswordStatus({ error: "", success: "Password updated successfully!" });
      setPasswordData({ currentPassword: "", newPassword: "" });
    } catch (err) {
      setPasswordStatus({ error: err.response?.data?.message || "Failed to update password", success: "" });
    }
  };

  if (loading) {
    return <div className="min-h-screen pt-20 flex justify-center bg-gray-50 dark:bg-gray-900"><p className="dark:text-white">Loading profile...</p></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 transition-colors duration-300">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mt-10">
        
        {/* Header Block */}
        <div className="bg-blue-600 dark:bg-blue-800 h-32 w-full relative">
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
            <div className="relative group">
              <img 
                src={
                  preview 
                    ? preview 
                    : user?.profilePicture 
                      ? (user.profilePicture.startsWith('http') ? user.profilePicture : `${BASE_URL}${user.profilePicture}`) 
                      : `https://ui-avatars.com/api/?name=${user?.name}&background=ffffff&color=2563EB`
                } 
                alt="Profile" 
                className="w-28 h-28 rounded-full border-4 border-white dark:border-gray-800 object-cover bg-white"
              />
              <label htmlFor="fileUpload" className="absolute bottom-0 right-0 bg-gray-900 text-white p-2 rounded-full cursor-pointer hover:bg-gray-700 shadow-md">
                ✏️
              </label>
              <input 
                id="fileUpload" 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                className="hidden" 
              />
            </div>
          </div>
        </div>

        {/* Content Block */}
        <div className="pt-16 pb-8 px-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
            <p className="text-gray-500 dark:text-gray-400 capitalize">{user.role}</p>
          </div>

          {message && (
             <div className={`p-4 rounded-lg mb-6 text-center text-sm font-medium ${message.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
               {message}
             </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={user.name} 
                  onChange={(e) => setUser({...user, name: e.target.value})} 
                  className="p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={user.email} 
                  onChange={(e) => setUser({...user, email: e.target.value})} 
                  className="p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  value={user.phone || ""} 
                  onChange={(e) => setUser({...user, phone: e.target.value})}
                  placeholder="+91 1234567890" 
                  className="p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Role</label>
                <input 
                  type="text" 
                  value={user.role} 
                  disabled
                  className="p-3 bg-gray-200 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-gray-500 dark:text-gray-400 cursor-not-allowed capitalize"
                />
              </div>

            </div>

            <div className="flex justify-end mt-8 border-t border-gray-100 dark:border-gray-700 pt-6">
              <button 
                type="submit" 
                disabled={saving}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {saving ? "Saving Changes..." : "Save Profile"}
              </button>
            </div>
          </form>

          {/* Change Password Section */}
          <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Change Password</h3>
            
            {passwordStatus.error && <p className="text-red-500 mb-4">{passwordStatus.error}</p>}
            {passwordStatus.success && <p className="text-green-500 mb-4">{passwordStatus.success}</p>}

            <form onSubmit={handleChangePassword} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                  <input 
                    type="password" 
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    className="p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                  <input 
                    type="password" 
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    className="p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button 
                  type="submit" 
                  className="px-8 py-3 bg-gray-800 dark:bg-gray-700 hover:bg-black dark:hover:bg-gray-600 text-white font-medium rounded-lg shadow-sm transition-all"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}