import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { User } from 'firebase/auth';
import type { DeliveryFormValues, Product } from '../types';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface CheckoutPageProps {
  user: User;
}

const initialFormValues: DeliveryFormValues = {
  fullName: '',
  mobileNumber: '',
  houseNumber: '',
  street: '',
  city: '',
  state: '',
  pinCode: '',
};

const CheckoutPage = ({ user }: CheckoutPageProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { product?: Product; quantity?: number } | undefined;
  const product = state?.product;
  const quantity = state?.quantity ?? 1;

  const [formValues, setFormValues] = useState<DeliveryFormValues>(initialFormValues);
  const [errors, setErrors] = useState<Partial<Record<keyof DeliveryFormValues, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const productPrice = product ? product.price * quantity : 0;
  const deliveryCharge = 50;
  const grandTotal = productPrice + deliveryCharge;

  const validate = () => {
    const nextErrors: Partial<Record<keyof DeliveryFormValues, string>> = {};
    if (!formValues.fullName.trim()) nextErrors.fullName = 'Full name is required.';
    if (!/^\d{10}$/.test(formValues.mobileNumber)) nextErrors.mobileNumber = 'Enter a valid 10-digit mobile number.';
    if (!formValues.houseNumber.trim()) nextErrors.houseNumber = 'House/Flat number is required.';
    if (!formValues.street.trim()) nextErrors.street = 'Street is required.';
    if (!formValues.city.trim()) nextErrors.city = 'City is required.';
    if (!formValues.state.trim()) nextErrors.state = 'State is required.';
    if (!/^\d{6}$/.test(formValues.pinCode)) nextErrors.pinCode = 'Enter a valid 6-digit PIN code.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!product || !validate()) return;

    setSubmitting(true);
    try {
      const orderId = `OK-${Math.floor(100000 + Math.random() * 900000)}`;
      const payload = {
        userId: user.uid,
        productId: product.id,
        productName: product.name,
        quantity,
        price: product.price,
        deliveryCharge,
        total: grandTotal,
        deliveryAddress: `${formValues.houseNumber}, ${formValues.street}, ${formValues.city}, ${formValues.state} - ${formValues.pinCode}`,
        paymentMethod: 'Cash on Delivery' as const,
        createdAt: new Date().toISOString(),
        orderId,
      };

      await addDoc(collection(db, 'orders'), payload);
      navigate('/success', { state: { orderId, product, formValues, quantity, paymentMethod: 'Cash on Delivery' } });
    } catch (error) {
      alert('Unable to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!product) {
    return <div className="p-6 text-stone-700">No product selected.</div>;
  }

  const handleChange = (field: keyof DeliveryFormValues) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  return (
    <div className="min-h-screen bg-stone-50 px-4 py-8 text-stone-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-[32px] border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-semibold">Checkout</h1>
        <p className="mt-2 text-sm text-stone-600">Cash on Delivery only. Please fill out the delivery details carefully.</p>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">Full Name</label>
                <input value={formValues.fullName} onChange={handleChange('fullName')} className="w-full rounded-full border border-stone-300 px-4 py-3" />
                {errors.fullName ? <p className="mt-1 text-sm text-red-600">{errors.fullName}</p> : null}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Mobile Number</label>
                <input value={formValues.mobileNumber} onChange={handleChange('mobileNumber')} className="w-full rounded-full border border-stone-300 px-4 py-3" />
                {errors.mobileNumber ? <p className="mt-1 text-sm text-red-600">{errors.mobileNumber}</p> : null}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">House / Flat Number</label>
                <input value={formValues.houseNumber} onChange={handleChange('houseNumber')} className="w-full rounded-full border border-stone-300 px-4 py-3" />
                {errors.houseNumber ? <p className="mt-1 text-sm text-red-600">{errors.houseNumber}</p> : null}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Street</label>
                <input value={formValues.street} onChange={handleChange('street')} className="w-full rounded-full border border-stone-300 px-4 py-3" />
                {errors.street ? <p className="mt-1 text-sm text-red-600">{errors.street}</p> : null}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">City</label>
                <input value={formValues.city} onChange={handleChange('city')} className="w-full rounded-full border border-stone-300 px-4 py-3" />
                {errors.city ? <p className="mt-1 text-sm text-red-600">{errors.city}</p> : null}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">State</label>
                <input value={formValues.state} onChange={handleChange('state')} className="w-full rounded-full border border-stone-300 px-4 py-3" />
                {errors.state ? <p className="mt-1 text-sm text-red-600">{errors.state}</p> : null}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">PIN Code</label>
              <input value={formValues.pinCode} onChange={handleChange('pinCode')} className="w-full rounded-full border border-stone-300 px-4 py-3" />
              {errors.pinCode ? <p className="mt-1 text-sm text-red-600">{errors.pinCode}</p> : null}
            </div>
          </div>

          <div className="rounded-[24px] border border-stone-200 bg-stone-50 p-5">
            <h2 className="text-lg font-semibold">Order Summary</h2>
            <div className="mt-4 space-y-3 text-sm text-stone-600">
              <div className="flex justify-between"><span>Product</span><span>{product.name}</span></div>
              <div className="flex justify-between"><span>Quantity</span><span>{quantity}</span></div>
              <div className="flex justify-between"><span>Product Price</span><span>₹{product.price * quantity}</span></div>
              <div className="flex justify-between"><span>Delivery Charge</span><span>₹50</span></div>
              <div className="flex justify-between border-t border-stone-200 pt-3 text-base font-semibold text-stone-900"><span>Grand Total</span><span>₹{grandTotal}</span></div>
            </div>
            <div className="mt-5 rounded-2xl border border-stone-200 bg-white p-4">
              <p className="font-medium">Payment</p>
              <p className="mt-1 text-sm text-stone-600">Cash on Delivery (CoD)</p>
            </div>
            <button type="submit" disabled={submitting} className="mt-6 w-full rounded-full bg-stone-900 px-4 py-3 font-medium text-white hover:bg-stone-700 disabled:opacity-70">
              {submitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
