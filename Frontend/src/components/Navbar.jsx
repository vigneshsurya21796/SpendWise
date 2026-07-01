import { MdMenu } from "react-icons/md";
import { useAuth } from "../context/AuthContext";

const CURRENCY_SYMBOLS = { INR: "₹", USD: "$", EUR: "€" };

const Navbar = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center">
        <button onClick={onMenuClick} className="lg:hidden mr-3 text-gray-600 hover:text-gray-900">
          <MdMenu className="text-2xl" />
        </button>
        <p className="text-sm text-gray-500">
          Welcome back, <span className="font-semibold text-gray-800">{user?.name}</span>
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">
          {CURRENCY_SYMBOLS[user?.currency] || "₹"} {user?.currency || "INR"}
        </span>
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
