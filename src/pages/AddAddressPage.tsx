
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../lib/firebase";
import Navbar from "../component/HomePage/Navbar";
import GoogleMapLocation from "../component/GoogleMapLocation";
const AddAddressPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    label: "Home",
    fullName: "",
    phone: "",
    houseNumber: "",
    street: "",
    city: "",
    state: "",
    pinCode: "",
    isDefault: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const user = auth.currentUser;

    if (!user) {
      setError("Please log in to add an address.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${user.uid}/addresses`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to save address");
      }

      navigate("/saved-addresses");
    } catch (error) {
      console.error("Error saving address:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Unable to save address."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800">
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-10">
        <button
          onClick={() => navigate("/saved-addresses")}
          className="text-orange-600 hover:text-orange-700 mb-6"
        >
          ← Back to Saved Addresses
        </button>

        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6">
            Add New Address
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* ================= GOOGLE MAP LOCATION ================= */}

<div className="space-y-3">
  <h2 className="text-lg font-semibold">
    Select Delivery Location
  </h2>

  <GoogleMapLocation />
</div>
            {/* Address Label */}
            <div>
              <label className="block font-medium mb-2">
                Address Type
              </label>

              <select
                name="label"
                value={formData.label}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3"
                required
              >
                <option value="Home">Home</option>
                <option value="Work">Work</option>
                <option value="Family">Family</option>
                <option value="Friend">Friend</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Full Name */}
            <div>
              <label className="block font-medium mb-2">
                Full Name
              </label>

              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter full name"
                className="w-full border border-gray-300 rounded-xl px-4 py-3"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block font-medium mb-2">
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full border border-gray-300 rounded-xl px-4 py-3"
                required
              />
            </div>

            {/* House Number */}
            <div>
              <label className="block font-medium mb-2">
                House Number
              </label>

              <input
                type="text"
                name="houseNumber"
                value={formData.houseNumber}
                onChange={handleChange}
                placeholder="Enter house number"
                className="w-full border border-gray-300 rounded-xl px-4 py-3"
                required
              />
            </div>

            {/* Street */}
            <div>
              <label className="block font-medium mb-2">
                Street
              </label>

              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="Enter street"
                className="w-full border border-gray-300 rounded-xl px-4 py-3"
                required
              />
            </div>

            {/* City */}
            <div>
              <label className="block font-medium mb-2">
                City
              </label>

              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
                className="w-full border border-gray-300 rounded-xl px-4 py-3"
                required
              />
            </div>

            {/* State */}
            <div>
              <label className="block font-medium mb-2">
                State
              </label>

              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter state"
                className="w-full border border-gray-300 rounded-xl px-4 py-3"
                required
              />
            </div>

            {/* PIN Code */}
            <div>
              <label className="block font-medium mb-2">
                PIN Code
              </label>

              <input
                type="text"
                name="pinCode"
                value={formData.pinCode}
                onChange={handleChange}
                placeholder="Enter PIN code"
                maxLength={6}
                className="w-full border border-gray-300 rounded-xl px-4 py-3"
                required
              />
            </div>

            {/* Default Address */}
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleChange}
                className="w-5 h-5 accent-orange-500"
              />

              <span className="font-medium">
                Set as default address
              </span>
            </label>

            {/* Error */}
            {error && (
              <p className="text-red-500 text-sm">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white py-4 rounded-xl font-semibold transition"
            >
              {loading ? "Saving Address..." : "Save Address"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddAddressPage;