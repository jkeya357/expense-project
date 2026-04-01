import { useSelector } from "react-redux";
import { selectAllUsers, useUpdateUserMutation, useGetUserQuery } from "../features/users/userApiSlice";
import { selectCurrentUserId } from "../features/auth/authSlice";
import { useState, useEffect } from "react";
import defaultProfile from "/user.png"

const ProfilePage = () => {
  useGetUserQuery();
  const currentUserId = useSelector(selectCurrentUserId);
  const users = useSelector(selectAllUsers)
  const user = users?.find((u) => u.id === currentUserId);
  console.log("user update id: ", currentUserId)
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
      setIconPreview(user.icon || defaultProfile);
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
    formData.append("_id", currentUserId);
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
    <div className="min-h-screen bg-gray-950 text-gray-100 px-6 py-10">

      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-8 tracking-tight">
        My Profile
      </h1>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-6 shadow-sm"
      >

        {/* Profile Image */}
        <div className="flex justify-center">
          <label className="cursor-pointer group">

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="w-28 h-28 rounded-full overflow-hidden border border-gray-700 flex items-center justify-center bg-gray-800 group-hover:border-indigo-500 transition">

              {iconPreview ? (
                <img
                  src={iconPreview}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs text-gray-400 text-center px-2">
                  Click to upload
                </span>
              )}

            </div>

          </label>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Name
          </label>
          <input
            type="text"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Email
          </label>
          <input
            type="email"
            value={user?.email || ""}
            readOnly
            className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 opacity-70 cursor-not-allowed"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            New Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Leave blank to keep current password"
            className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat new password"
            className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition font-semibold shadow"
        >
          Update Profile
        </button>

        {/* Message */}
        {message && (
          <p className="text-sm text-yellow-400 text-center">
            {message}
          </p>
        )}

      </form>
    </div>
  );
};

export default ProfilePage;
