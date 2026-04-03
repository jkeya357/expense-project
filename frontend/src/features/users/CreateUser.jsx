import { useCreateUserMutation } from "./userApiSlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateUser = () => {
  const navigate = useNavigate();

  const [create, { isLoading }] = useCreateUserMutation();

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result  = await create({ fullname, email, password }).unwrap();

      setFullname("");
      setEmail("");
      setPassword("");

      if(result){
        navigate("/dash");
      }
    } catch (error) {
      setErr(error?.data?.message || "Failed to create user");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="w-full max-w-sm bg-white border border-gray-200 p-5">

        <h2 className="text-lg font-semibold mb-4">
          Create Account
        </h2>

        {err && (
          <div className="mb-3 p-2 text-xs text-red-700 bg-red-100 border border-red-300">
            {err}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-sm">

          {/* Full Name */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              required
              className="w-full border border-gray-300 px-2 py-2 focus:outline-none focus:border-gray-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            {isLoading ? "Creating..." : "Create Account"}
          </button>

        </form>

      </div>

    </div>
  );
};

export default CreateUser;