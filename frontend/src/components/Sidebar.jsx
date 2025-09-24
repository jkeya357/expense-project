import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useGetUserQuery } from "../features/users/userApiSlice";
import Expense from "./Expense";
import Income from "./Income";

const Sidebar = () => {
  const { data: userData } = useGetUserQuery();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="w-64 bg-blue-800 shadow-lg flex flex-col items-center py-6">
      {/* Profile Section */}
      <div className="mb-6 flex flex-col items-center">
        {userData?.profileImage ? (
          <img
            src={userData.profileImage}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
            No Image
          </div>
        )}
        <p className="mt-2 font-semibold">{userData?.name || "User"}</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col space-y-3 w-full px-4">
        <NavLink
            to={<Expense/>}
          className={({ isActive }) =>
            `block px-3 py-2 rounded hover:bg-gray-100 ${isActive ? "bg-gray-200 font-semibold" : ""}`
          }
        >
            Expense
        </NavLink>
        <NavLink
          to={<Income/>}
          className={({ isActive }) =>
            `block px-3 py-2 rounded hover:bg-gray-100 ${isActive ? "bg-gray-200 font-semibold" : ""}`
          }
        >
          Incomes
        </NavLink>
        <NavLink
          to="/dash"
          className={({ isActive }) =>
            `block px-3 py-2 rounded hover:bg-gray-100 ${isActive ? "bg-gray-200 font-semibold" : ""}`
          }
        >
          DashBoard
        </NavLink>
      </nav>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="mt-auto mb-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default Sidebar
