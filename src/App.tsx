import { Navigate, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from './lib/firebase';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-stone-50 text-lg font-medium text-stone-700">Loading O-Kart...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/home" replace /> : <AuthPage />} />
      <Route path="/home" element={user ? <HomePage user={user} /> : <Navigate to="/" replace />} />
      <Route path="/product/:id" element={user ? <ProductDetailPage user={user} /> : <Navigate to="/" replace />} />
      <Route path="/checkout" element={user ? <CheckoutPage user={user} /> : <Navigate to="/" replace />} />
      <Route path="/success" element={user ? <OrderSuccessPage user={user} /> : <Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
