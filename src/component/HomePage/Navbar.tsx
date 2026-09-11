import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";
import logo from "../../assets/images/okart-logo.png";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/home")}
        >
          <img
            src={logo}
            alt="O-Kart"
            className="w-12 h-12 rounded-full"
          />

          <div>
            <h1 className="text-xl font-bold text-orange-600">
              O-Kart
            </h1>

            <p className="text-xs text-gray-500">
              Authentic Indian Foods
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 justify-center px-10">
          <input
            type="text"
            placeholder="Search authentic foods..."
            className="w-full max-w-lg border border-gray-300 rounded-full px-5 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Right Menu */}
        <div className="flex items-center gap-6">

          <button
            onClick={() => navigate("/orders")}
            className="hover:text-orange-600 font-medium"
          >
            Orders
          </button>

          <button
            onClick={() => navigate("/cart")}
            className="hover:text-orange-600 font-medium"
          >
            🛒 Cart
          </button>

          <button
            className="hover:text-orange-600 font-medium"
          >
            👤 Profile
          </button>

          <button
            onClick={handleLogout}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full transition"
          >
            Logout
          </button>

        </div>

      </div>
    </header>
  );
};

export default Navbar;