
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../lib/firebase";
import Navbar from "../component/HomePage/Navbar";

interface SavedAddress {
  _id: string;
  label: string;
  fullName: string;
  phone: string;
  houseNumber: string;
  street: string;
  city: string;
  state: string;
  pinCode: string;
  isDefault: boolean;
}

const SavedAddressesPage = () => {
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const user = auth.currentUser;

        if (!user) {
          setError("Please log in to view your saved addresses.");

          return;
        }
        

        const response = await fetch(
          `http://localhost:5000/api/users/${user.uid}/addresses`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch addresses");
        }

        setAddresses(data.data);
      } catch (error) {
        console.error("Error fetching addresses:", error);
        setError("Unable to load saved addresses.");
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);
const handleDelete = async (addressId: string) => {
  const user = auth.currentUser;

  if (!user) {
    setError("Please log in to delete an address.");
    return;
  }

  const confirmed = window.confirm(
    "Are you sure you want to delete this address?"
  );

  if (!confirmed) return;

  try {
    const response = await fetch(
      `http://localhost:5000/api/users/${user.uid}/addresses/${addressId}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to delete address");
    }

    setAddresses((prev) =>
      prev.filter((address) => address._id !== addressId)
    );
  } catch (error) {
    console.error("Error deleting address:", error);
    setError("Unable to delete address.");
  }
};
  return (
    <div className="min-h-screen bg-stone-50 text-stone-800">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-10">
        <button
          onClick={() => navigate("/profile")}
          className="text-orange-600 hover:text-orange-700 mb-6"
        >
          ← Back to Profile
        </button>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Saved Addresses</h1>

          <button
            onClick={() => navigate("/add-address")}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl"
          >
            + Add Address
          </button>
        </div>

        {loading && (
          <p className="text-gray-500">Loading saved addresses...</p>
        )}

        {error && (
          <p className="text-red-500">{error}</p>
        )}

        {!loading && !error && addresses.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center shadow">
            <p className="text-gray-500">
              You have no saved addresses yet.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {addresses.map((address) => (
            <div
              key={address._id}
              className="bg-white rounded-2xl p-6 shadow-md"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold">
                  📍 {address.label}
                </h2>

                {address.isDefault && (
                  <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
                    Default
                  </span>
                )}
              </div>

              <p className="font-medium">{address.fullName}</p>
              <p className="text-gray-600">{address.phone}</p>

              <p className="text-gray-600 mt-2">
                {address.houseNumber}, {address.street}
              </p>

              <p className="text-gray-600">
                {address.city}, {address.state}
              </p>

              <p className="text-gray-600">
                PIN: {address.pinCode}
              </p>
              <div className="mt-5 flex justify-end">
  <button
    onClick={() => handleDelete(address._id)}
    className="text-red-500 hover:text-red-700 font-medium"
  >
    🗑️ Delete
  </button>
</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SavedAddressesPage;