
import { useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 20.5937,
  lng: 78.9629,
};

const GoogleMapLocation = () => {
  const [selectedLocation, setSelectedLocation] =
    useState(defaultCenter);

  const [selectedAddress, setSelectedAddress] =
    useState("Select a location on the map");

  const [isConfirmed, setIsConfirmed] = useState(false);

 const handleMapClick = (
  event: google.maps.MapMouseEvent
) => {
  if (!event.latLng) return;

  const newLocation = {
    lat: event.latLng.lat(),
    lng: event.latLng.lng(),
  };

  setSelectedLocation(newLocation);
  setSelectedAddress("Finding address...");
  setIsConfirmed(false);

  const geocoder = new google.maps.Geocoder();

  geocoder.geocode(
    { location: newLocation },
    (results, status) => {
      console.log("Geocoding status:", status);
      console.log("Geocoding results:", results);

      if (
        status === "OK" &&
        results &&
        results.length > 0
      ) {
        setSelectedAddress(results[0].formatted_address);
      } else {
        setSelectedAddress(
          `Unable to find address. Status: ${status}`
        );
      }
    }
  );
};

  const handleConfirmLocation = () => {
    setIsConfirmed(true);

    console.log("Confirmed location:", {
      address: selectedAddress,
      latitude: selectedLocation.lat,
      longitude: selectedLocation.lng,
    });
  };

  return (
    <div className="w-full rounded-2xl overflow-hidden space-y-4">
      <LoadScript
        googleMapsApiKey={
          import.meta.env.VITE_GOOGLE_MAPS_API_KEY
        }
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={defaultCenter}
          zoom={5}
          onClick={handleMapClick}
        >
          <Marker position={selectedLocation} />
        </GoogleMap>
      </LoadScript>

      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Confirm Location for Delivery
        </h3>

        <p className="text-gray-700 mt-3">
          📍 {selectedAddress}
        </p>

        {!isConfirmed ? (
          <button
            type="button"
            onClick={handleConfirmLocation}
            disabled={
              selectedAddress === "Finding address..." ||
              selectedAddress === "Select a location on the map"
            }
            className="w-full mt-4 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white py-3 rounded-xl font-semibold transition"
          >
            Confirm Location
          </button>
        ) : (
          <div className="mt-4 bg-green-100 text-green-700 rounded-xl p-3 text-center font-medium">
            ✓ Location Confirmed
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleMapLocation;