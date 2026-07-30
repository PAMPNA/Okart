import { useLocation, useNavigate } from 'react-router-dom';
import type { Product } from '../types';

interface OrderSuccessPageProps {
  user: { displayName?: string | null };
}

const OrderSuccessPage = ({ user }: OrderSuccessPageProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { orderId?: string; product?: Product; formValues?: { fullName?: string; houseNumber?: string; street?: string; city?: string; state?: string; pinCode?: string }; quantity?: number; paymentMethod?: string } | undefined;

  return (
    <div className="min-h-screen bg-stone-50 px-4 py-10 text-stone-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-[32px] border border-stone-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-700">✓</div>
        <h1 className="mt-5 text-2xl font-semibold">Order placed successfully</h1>
        <p className="mt-2 text-sm text-stone-600">Thank you, {user.displayName || 'customer'}! Your order is confirmed.</p>

        <div className="mt-8 rounded-[24px] border border-stone-200 bg-stone-50 p-5 text-left">
          <p className="text-sm text-stone-500">Order ID</p>
          <p className="mt-1 font-semibold">{state?.orderId || 'OK-123456'}</p>
          <p className="mt-4 text-sm text-stone-500">Product</p>
          <p className="mt-1 font-semibold">{state?.product?.name || 'Original Dharwad Peda'}</p>
          <p className="mt-4 text-sm text-stone-500">Delivery Address</p>
          <p className="mt-1 font-semibold">{state?.formValues ? `${state.formValues.houseNumber || ''} ${state.formValues.street || ''}, ${state.formValues.city || ''}, ${state.formValues.state || ''} - ${state.formValues.pinCode || ''}`.trim() : 'Delivery address provided'}</p>
          <p className="mt-4 text-sm text-stone-500">Payment Method</p>
          <p className="mt-1 font-semibold">{state?.paymentMethod || 'Cash on Delivery'}</p>
        </div>

        <button onClick={() => navigate('/home')} className="mt-8 rounded-full bg-stone-900 px-6 py-3 font-medium text-white hover:bg-stone-700">
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
