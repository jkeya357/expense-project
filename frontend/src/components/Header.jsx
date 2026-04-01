import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";

const Header = () => {
  const token = useSelector(selectCurrentToken);

  //if (!token) return null;

  const linkClass = ({ isActive }) =>
    `text-sm font-medium px-3 py-2 rounded-lg transition ${
      isActive
        ? "bg-gray-200 text-gray-900"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`;

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* Logo */}
        <Link
          to={token ? "/dash" : "/"}
          className="text-lg font-bold text-gray-900 tracking-tight"
        >
          ExpenseTracker
        </Link>

        {/* Navigation */}
        {token && <nav className="hidden md:flex items-center gap-2">
          <NavLink to="/dash" className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/dash/expense" className={linkClass}>
            Expenses
          </NavLink>
          <NavLink to="/dash/income" className={linkClass}>
            Income
          </NavLink>
          <NavLink to="/dash/profile" className={linkClass}>
            Profile
          </NavLink>
        </nav>}

      </div>
    </header>
  );
};

export default Header;