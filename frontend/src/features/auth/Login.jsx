import { SetCredentials } from "./authSlice";
import { useLoginMutation } from "./authApiSlice";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState();

  const [login, { isLoading, isSuccess }] = useLoginMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { accessToken, email, user } = await login({
        email: userEmail,
        password,
      }).unwrap();

      dispatch(SetCredentials({ accessToken, email, user }));

      setUserEmail("");
      setPassword("");
      navigate("/dash")
    } catch (error) {
      if (!error?.status) {
        setErr("No server response");
      } else if (error.status === 400) {
        setErr("All fields are required");
      } else if (error.status === 401) {
        setErr(error.data?.message || "Unauthorized user");
      } else {
        setErr(error.data?.message || "Login failed");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="w-full max-w-sm bg-white border border-gray-200 p-5">

        <h2 className="text-lg font-semibold mb-4">
          Sign In
        </h2>

        {err && (
          <div className="mb-3 p-2 text-xs text-red-700 bg-red-100 border border-red-300">
            {err}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-sm">

          {/* Email */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              required
              className="w-full border border-gray-300 px-2 py-2 focus:outline-none focus:border-gray-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 px-2 py-2 focus:outline-none focus:border-gray-500"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-2 text-sm hover:bg-gray-800 transition disabled:opacity-50"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>

        </form>

      </div>

    </div>
  );
};

export default Login;