import { useRef,useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "firebase/auth";
import { auth } from "../lib/firebase";
import Navbar from "../component/HomePage/Navbar";

const EditProfilePage = () => {
    const [showPhotoOptions, setShowPhotoOptions] = useState(false);
const [profileImage, setProfileImage] = useState<string | null>(null);

const fileInputRef = useRef<HTMLInputElement>(null);
const [photoRemoved, setPhotoRemoved] = useState(false);

const handleImageSelect = (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  const file = event.target.files?.[0];

  if (!file) return;

  // Allow only image files
  if (!file.type.startsWith("image/")) {
    setError("Please select a valid image.");
    return;
  }

  // Limit image size to 5 MB
  if (file.size > 5 * 1024 * 1024) {
    setError("Image size should be less than 5 MB.");
    return;
  }

  const imageUrl = URL.createObjectURL(file);

  setProfileImage(imageUrl);
  setPhotoRemoved(false);
  setShowPhotoOptions(false);
  setError("");

  // Allow selecting the same image again
  event.target.value = "";
};
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [fullName, setFullName] = useState(
    user?.displayName || ""
  );

  const [phone, setPhone] = useState("");

  const [orderUpdates, setOrderUpdates] = useState(true);
  const [deliveryUpdates, setDeliveryUpdates] = useState(true);
  const [promotionalOffers, setPromotionalOffers] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSave = async () => {
    if (!user) {
      setError("Please log in first.");
      return;
    }

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (phone && !/^[0-9]{10}$/.test(phone)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await updateProfile(user, {
        displayName: fullName.trim(),
      });

      setSuccess("Profile updated successfully.");

      setTimeout(() => {
        navigate("/profile");
      }, 1200);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Unable to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800">
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-10">

        {/* Back */}
        <button
          onClick={() => navigate("/profile")}
          className="flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-6 font-medium"
        >
          <span className="text-2xl">←</span>
          Back to Profile
        </button>

        <div className="bg-white rounded-3xl shadow-lg p-8">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">
              Edit Profile
            </h1>

            <p className="text-gray-500 mt-2">
              Manage your personal information
            </p>
          </div>

          
{/* Profile Photo */}
<div className="flex flex-col items-center mb-10">

  {/* Profile Image Preview */}
  <div className="w-36 h-36 rounded-full overflow-hidden bg-orange-100 flex items-center justify-center border-4 border-orange-100 shadow-sm">
    {profileImage ? (
      <img
        src={profileImage}
        alt="Profile"
        className="w-full h-full object-cover"
      />
    ) : user?.photoURL && !photoRemoved ? (
      <img
        src={user.photoURL}
        alt="Profile"
        className="w-full h-full object-cover"
      />
    ) : (
      <span className="text-6xl">👤</span>
    )}
  </div>

  {/* Change Photo Button */}
  <button
    type="button"
    onClick={() => setShowPhotoOptions(true)}
    className="mt-4 text-orange-600 hover:text-orange-700 font-semibold transition"
  >
    📷 Change Photo
  </button>

  {/* Hidden Image Input */}
  <input
    ref={fileInputRef}
    type="file"
    accept="image/*"
    capture="user"
    onChange={handleImageSelect}
    className="hidden"
  />

</div>

{/* Change Photo Popup */}
{showPhotoOptions && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">

      {/* Popup Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">
          Change Profile Photo
        </h2>

        <button
          type="button"
          onClick={() => setShowPhotoOptions(false)}
          className="text-gray-500 hover:text-gray-800 text-2xl"
        >
          ×
        </button>
      </div>

      {/* Choose Image */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-orange-50 transition"
      >
        <span className="text-2xl">🖼️</span>
        <span className="font-medium">
          Choose Photo / Take Photo
        </span>
      </button>

      {/* Remove Photo */}
      {(profileImage || (user?.photoURL && !photoRemoved)) && (
        <button
          type="button"
          onClick={() => {
            setProfileImage(null);
            setPhotoRemoved(true);
            setShowPhotoOptions(false);
          }}
          className="w-full flex items-center gap-4 p-4 rounded-xl text-red-600 hover:bg-red-50 transition"
        >
          <span className="text-2xl">🗑️</span>
          <span className="font-medium">
            Remove Photo
          </span>
        </button>
      )}

      {/* Cancel */}
      <button
        type="button"
        onClick={() => setShowPhotoOptions(false)}
        className="w-full mt-4 rounded-xl bg-gray-100 py-3 font-medium hover:bg-gray-200 transition"
      >
        Cancel
      </button>

    </div>
  </div>
)}
          {/* Personal Information */}
          <div>

            <h2 className="text-xl font-semibold mb-5">
              Personal Information
            </h2>

            <div className="space-y-5">

              {/* Full Name */}
              <div>
                <label className="block font-medium mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  value={fullName}
                  onChange={(e) =>
                    setFullName(e.target.value)
                  }
                  placeholder="Enter your full name"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block font-medium mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full border border-gray-300 bg-gray-100 rounded-xl px-4 py-3 text-gray-500"
                />

                <p className="text-sm text-gray-500 mt-2">
                  Email is managed by your account.
                </p>
              </div>

              {/* Phone */}
              <div>
                <label className="block font-medium mb-2">
                  Phone Number
                </label>

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) =>
                    setPhone(
                      e.target.value.replace(/\D/g, "").slice(0, 10)
                    )
                  }
                  placeholder="Enter 10-digit phone number"
                  maxLength={10}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-8" />

          {/* Account Preferences */}
          <div>

            <h2 className="text-xl font-semibold mb-5">
              Account Preferences
            </h2>

            <div className="space-y-4">

              {/* Order Updates */}
              <label className="flex items-center justify-between p-4 rounded-xl bg-stone-50 cursor-pointer">
                <div>
                  <p className="font-medium">
                    Order updates
                  </p>

                  <p className="text-sm text-gray-500">
                    Get updates about your orders
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={orderUpdates}
                  onChange={(e) =>
                    setOrderUpdates(e.target.checked)
                  }
                  className="w-5 h-5 accent-orange-500"
                />
              </label>

              {/* Delivery Updates */}
              <label className="flex items-center justify-between p-4 rounded-xl bg-stone-50 cursor-pointer">
                <div>
                  <p className="font-medium">
                    Delivery updates
                  </p>

                  <p className="text-sm text-gray-500">
                    Get updates about your delivery
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={deliveryUpdates}
                  onChange={(e) =>
                    setDeliveryUpdates(e.target.checked)
                  }
                  className="w-5 h-5 accent-orange-500"
                />
              </label>

              {/* Promotional Offers */}
              <label className="flex items-center justify-between p-4 rounded-xl bg-stone-50 cursor-pointer">
                <div>
                  <p className="font-medium">
                    Promotional offers
                  </p>

                  <p className="text-sm text-gray-500">
                    Receive offers and discounts from O-Kart
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={promotionalOffers}
                  onChange={(e) =>
                    setPromotionalOffers(e.target.checked)
                  }
                  className="w-5 h-5 accent-orange-500"
                />
              </label>

            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm mt-6">
              {error}
            </p>
          )}

          {/* Success */}
          {success && (
            <div className="mt-6 bg-green-100 text-green-700 rounded-xl p-4 text-center font-medium">
              ✓ {success}
            </div>
          )}

          {/* Save */}
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="w-full mt-8 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white py-4 rounded-xl font-semibold transition"
          >
            {loading ? "Saving Changes..." : "Save Changes"}
          </button>

        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;