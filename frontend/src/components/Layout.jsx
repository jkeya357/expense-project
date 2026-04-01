import { Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, selectCurrentToken, selectCurrentUserId } from "../features/auth/authSlice";
import { useGetUserQuery, selectUserById } from "../features/users/userApiSlice";
import Header from "./Header";
import Footer from "./Footer";
import image from "/user.png"

const Layout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector(selectCurrentToken);
  useGetUserQuery();

  const currentUser = useSelector(selectCurrentUserId)

  const user = useSelector((state) => selectUserById(state, currentUser))

  console.log("LOGGED IN USER", user)

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 md:px-10">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* User Info Card */}
          {token ? (
            <div className="bg-white rounded-2xl shadow p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={user?.icon || image}
                  alt="Profile"
                  className="w-12 h-12 rounded-full border"
                />

                <div>
                  <h2 className="font-semibold text-sm">
                    {user?.fullname || "User"}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {user?.email}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg transition"
              >
                Logout
              </button>
            </div>
          ) : null}

          {/* Content Area */}
          <div className="bg-white rounded-2xl shadow p-6">
            <Outlet />
          </div>

        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;