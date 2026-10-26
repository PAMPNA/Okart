import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import ProductDetail from "./component/Pages/ProductDetail";
import CartPage from "./component/Pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import ProductsPage from "./component/Pages/ProductsPage";
import AboutPage from "./pages/AboutPage";
import ProfilePage from "./pages/ProfilePage";
import SavedAddressesPage from "./pages/SavedAddressesPage";
import AddAddressPage from "./pages/AddAddressPage";
import EditProfilePage from "./pages/EditProfilePage";
function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      <Route path="/register" element={<RegisterPage />} />

      {/* Home Page */}
      <Route path="/home" element={<HomePage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/about" element={<AboutPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route
  path="/order-success"
  element={<OrderSuccessPage />}
/>
      <Route
  path="/cart"
  element={<CartPage />}
/>
      <Route
  path="/orders"
  element={<OrderHistoryPage />}
/>
<Route
  path="/saved-addresses"
  element={<SavedAddressesPage />}
/>
<Route
  path="/add-address"
  element={<AddAddressPage />}
/>
<Route
  path="/edit-profile"
  element={<EditProfilePage />}
/>
    </Routes>
    
    
  );
}

export default App;