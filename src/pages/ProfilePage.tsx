import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import Navbar from "../component/HomePage/Navbar";
const ProfilePage = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };


  return (
    <div className="min-h-screen bg-stone-50 text-stone-800">
        <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-12">

  <div className="bg-white rounded-3xl shadow-lg p-8">

    {/* Profile */}
    <div className="text-center">

      {user?.photoURL ? (
        <img
          src={user.photoURL}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-orange-100"
        />
      ) : (
        <div className="w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center text-4xl mx-auto">
          👤
        </div>
      )}

      <h2 className="text-2xl font-bold mt-5">
        {user?.displayName || "User"}
      </h2>

      <p className="text-gray-500 mt-1">
        {user?.email || "No email available"}
      </p>

    </div>

    {/* Divider */}
    <div className="border-t border-gray-200 my-8" />

    {/* Account Actions */}
    <div className="space-y-3">

      {/* My Orders */}
      <button
        onClick={() => navigate("/orders")}
        className="w-full flex items-center justify-between px-5 py-4 rounded-xl hover:bg-orange-50 transition"
      >
        <span className="flex items-center gap-4">
          <span className="text-2xl">📦</span>
          <span className="font-medium text-lg">
            My Orders
          </span>
        </span>

        <span className="text-gray-400 text-xl">
          →
        </span>
      </button>

      {/* My Cart */}
      <button
        onClick={() => navigate("/cart")}
        className="w-full flex items-center justify-between px-5 py-4 rounded-xl hover:bg-orange-50 transition"
      >
        <span className="flex items-center gap-4">
          <span className="text-2xl">🛒</span>
          <span className="font-medium text-lg">
            My Cart
          </span>
        </span>

        <span className="text-gray-400 text-xl">
          →
        </span>
      </button>

      
     {/* Saved Addresses */}
<button
  onClick={() => navigate("/saved-addresses")}
  className="w-full flex items-center justify-between px-5 py-4 rounded-xl hover:bg-orange-50 transition"
>
        <span className="flex items-center gap-4">
          <span className="text-2xl">📍</span>
          <span className="font-medium text-lg">
            Saved Addresses
          </span>
        </span>

        <span className="text-gray-400 text-xl">
          →
        </span>
      </button>

      {/* Edit Profile */}
      <button
        onClick={() => navigate("/edit-profile")}
        className="w-full flex items-center justify-between px-5 py-4 rounded-xl hover:bg-orange-50 transition"
      >
        <span className="flex items-center gap-4">
          <span className="text-2xl">✏️</span>
          <span className="font-medium text-lg">
            Edit Profile
          </span>
        </span>

        <span className="text-gray-400 text-xl">
          →
        </span>
      </button>

    </div>

    {/* Divider */}
    <div className="border-t border-gray-200 my-8" />

    {/* Logout */}
    <button
      onClick={handleLogout}
      className="w-full flex items-center justify-center gap-3 bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-semibold transition"
    >
      <span className="text-xl">🚪</span>
      Logout
    </button>

  </div>

</div>

        </div>

      
  );
};

export default ProfilePage;