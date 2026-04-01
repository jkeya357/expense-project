import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center px-6">

      <div className="max-w-3xl text-center space-y-8">

        {/* Badge */}
        <p className="text-sm text-indigo-400 uppercase tracking-wider">
          Expense Tracker
        </p>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Take control of your{" "}
          <span className="text-indigo-500">finances</span>
        </h1>

        {/* Subtitle */}
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          Track your expenses, visualize your spending, and stay in control of
          your money with a simple and powerful dashboard.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">

          <button
            onClick={() => navigate("/register")}
            className="bg-indigo-600 hover:bg-indigo-500 transition px-6 py-3 rounded-lg font-semibold shadow"
          >
            Create Account
          </button>

          <button
            onClick={() => navigate("/login")}
            className="border border-gray-700 hover:border-indigo-500 transition px-6 py-3 rounded-lg font-semibold text-gray-300 hover:text-white"
          >
            Sign In
          </button>

        </div>

      </div>

    </div>
  );
};

export default Home;