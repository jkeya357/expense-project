import { SetCredentials } from "./authSlice";
import { useLoginMutation } from "./authApiSlice";
import { useDispatch } from "react-redux";
import { useState } from "react";
import {useNavigate} from 'react-router-dom'

const Login = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [userEmail, setUserEmail] = useState('')
    const [password, setPassword] = useState('')
    const [err, setErr] = useState()

    const [login, {isLoading}] = useLoginMutation()

    const handleSubmit = async (e) =>{
      try {
        e.preventDefault()

        const {accessToken, email, user} = await login({email: userEmail, password}).unwrap()
        dispatch(SetCredentials({accessToken, email, user}))
        console.log("accessToken and user",{accessToken, email, user})
        setUserEmail('')
        setPassword('')
        navigate("/dash")
      } catch (error) {
        if (!error?.status) {
          return setErr("No server response");
        } else if (error.status === 400) {
          return setErr("All fields are required");
        } else if (error.status === 401) {
          return setErr(error.data?.message || "Unauthorized user");
        } else {
        return setErr(error.data?.message || "Login failed");
        }
      }
    }

    const handleEmail = (e) => setUserEmail(e.target.value)
    const handlePassword = (e) => setPassword(e.target.value)
    

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-400 px-4">
      <div className="w-full max-w-md bg-gray-300 shadow-md rounded-xl p-6">
        <h2 className="text-2xl font-semibold text-center text-blue-600 mb-6">
          Sign In to ExpenseTracker
        </h2>

        {err && (
          <div className="mb-4 p-2 text-red-700 bg-red-100 border border-red-300 rounded">
            {err}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="userEmail"
              value={userEmail}
              onChange={handleEmail}
              required
              className="mt-1 w-full border border-gray-50 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePassword}
              required
              className="mt-1 w-full border border-gray-50 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition disabled:opacity-50"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login
