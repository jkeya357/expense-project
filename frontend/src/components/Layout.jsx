import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useGetUserQuery } from "../features/users/userApiSlice";
import { useSelector, useDispatch } from "react-redux";
import { logout, selectCurrentToken } from "../features/auth/authSlice";
import Header from "./Header";
import Footer from "./Footer";

const Layout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const { data: userData, isSuccess } = useGetUserQuery();
  const token = useSelector(selectCurrentToken)

  const handleLogout = () => {
    dispatch(logout())
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      {token && (
        <aside className="w-64 bg-gray-600 text-white flex flex-col p-4">
          {/* Profile image from API */}
          <div className="flex justify-center mb-6">
            <img
              src="https://via.placeholder.com/80" // replace with API image
              alt="Profile"
              className="rounded-full w-20 h-20 border-2 border-white"
            />
          </div>

          {/* Nav links */}
          <nav className="flex flex-col gap-4 flex-grow">
            <NavLink
              to="/dash/expense"
              className={({ isActive }) =>
                `p-2 rounded ${isActive ? "bg-gray-700" : "hover:bg-gray-700"}`
              }
            >
              Expenses
            </NavLink>
            <NavLink
              to="/dash/income"
              className={({ isActive }) =>
                `p-2 rounded ${isActive ? "bg-gray-700" : "hover:bg-gray-700"}`
              }
            >
              Income
            </NavLink>
          </nav>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="mt-auto bg-red-500 hover:bg-red-600 p-2 rounded"
          >
            Logout
          </button>
        </aside>
      )}

      {/* Main content area */}
      <div className="flex flex-col flex-1 bg-gray-400">
        {token && <Header />}
        <main className="flex-grow p-4">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
