// components/Header.jsx
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";

const Header = () => {

  const token = useSelector(selectCurrentToken)

  if(!token) return null
  

  return (
    <header className="bg-blue-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-wide">
          ExpenseTracker
        </Link>
        <nav className="space-x-6">
          <Link to="/dash" className="hover:underline">
            Dashboard
          </Link>
          <Link to="/dash/expense" className="hover:underline">
            Expenses
          </Link>
          <Link to="/dash/income" className="hover:underline">
            Income
          </Link>
          <Link to="/dash/profile" className="hover:underline">
            Profile
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
