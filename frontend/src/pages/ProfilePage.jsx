import { useSelector } from "react-redux";
import { selectAllUsers, useUpdateUserMutation, useGetUserQuery } from "../features/users/userApiSlice";
import { selectCurrentUserId } from "../features/auth/authSlice";
import { useState, useEffect } from "react";

const ProfilePage = () => {
  useGetUserQuery();
  const currentUserId = useSelector(selectCurrentUserId);
  const users = useSelector(selectAllUsers)
  const user = users?.find((u) => u.id === currentUserId);
  const [updateUser] = useUpdateUserMutation();

  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [icon, setIcon] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setFullname(user.fullname || "");
      setIconPreview(user.icon || null);
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIcon(file);
      setIconPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password && password !== confirmPassword) {
      setMessage("Password does not match");
      return;
    }

    const formData = new FormData();
    formData.append("id", currentUserId);
    formData.append("fullname", fullname);
    if (password) formData.append("password", password);
    if (icon) formData.append("icon", icon);

    try {
      await updateUser(formData).unwrap();
      setMessage("Profile updated successfully!");
    } catch (err) {
      setMessage(err?.data?.message || "Failed to update profile.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg space-y-4">
        {/* Profile Image Upload */}
        <div className="flex justify-center mb-6">
          <label className="cursor-pointer">
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden border-2 border-gray-600 hover:border-blue-500">
              {iconPreview ? (
                <img src={iconPreview} alt="Profile Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400 text-center">Click to add image</span>
              )}
            </div>
          </label>
        </div>

        {/* Name */}
        <div>
          <label className="block mb-1 font-semibold">Name</label>
          <input
            type="text"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 font-semibold">Email</label>
          <input
            type="email"
            value={user?.email || ""}
            readOnly
            className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 cursor-not-allowed"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block mb-1 font-semibold">New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Leave blank to keep current password"
            className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block mb-1 font-semibold">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat new password"
            className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
        >
          Update Profile
        </button>

        {message && <p className="text-yellow-400 mt-2">{message}</p>}
      </form>
    </div>
  );
};

export default ProfilePage;
