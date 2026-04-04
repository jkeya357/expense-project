import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, selectCurrentToken, selectCurrentEmail } from "../features/auth/authSlice";
import { useFindUserByEmailQuery} from "../features/users/userApiSlice";
// import apiSlice from "../api/apiSlice";
import Header from "./Header";
import Footer from "./Footer";
import LogoutModal from "./LogoutModal";
import image from "/user.png"
import { useState, useEffect } from "react";

const Layout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const token = useSelector(selectCurrentToken);

  useEffect(() => {
    if (!token && location.pathname.startsWith("/dash")) {
      navigate("/", { replace: true });
    }
  }, [token, location.pathname, navigate]);

  const currentUserEmail = useSelector(selectCurrentEmail)

  const {data: user, isSuccess, isLoading} = useFindUserByEmailQuery(currentUserEmail, {
    skip: !currentUserEmail || !token
  });

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(apiSlice.util.resetApiState())
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
                onClick={() => setShowLogoutModal(true)}
                className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg transition hover:pointer"
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

      {/* Logout Confirmation Modal */}
      <LogoutModal
        showLogoutModal={showLogoutModal}
        setShowLogoutModal={setShowLogoutModal}
        handleLogout={handleLogout}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;