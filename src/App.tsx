import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import ProductDetail from "./component/Pages/ProductDetail";
import CartPage from "./component/Pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      <Route path="/register" element={<RegisterPage />} />

      {/* Home Page */}
      <Route path="/home" element={<HomePage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
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
    </Routes>
    
  );
}

export default App;