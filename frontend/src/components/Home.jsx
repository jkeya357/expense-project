import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleLogin = () => navigate('/login');
  const handleRegister = () => navigate('/register');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-400 to-gray-400 px-4">
      <div className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-700">
          Welcome to ExpenseTracker
        </h1>
        <p className="text-gray-600 text-lg max-w-xl mx-auto">
          Track your spending, manage your budget, and stay in control of your finances.
        </p>

        <div className="flex justify-center space-x-6 pt-4">
          <button
            onClick={handleRegister}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            Create Account
          </button>
          <button
            onClick={handleLogin}
            className="border border-blue-600 text-blue-600 px-6 py-2 rounded-xl hover:bg-blue-50 transition"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
