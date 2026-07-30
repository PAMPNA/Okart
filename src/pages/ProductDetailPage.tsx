import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { User } from 'firebase/auth';
import { products } from '../data/products';

interface ProductDetailPageProps {
  user: User;
}

const ProductDetailPage = ({ user }: ProductDetailPageProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const product = useMemo(() => products.find((item) => item.id === id), [id]);

  if (!product) {
    return <div className="p-6 text-stone-700">Product not found.</div>;
  }

  const totalPrice = product.price * quantity;

  return (
    <div className="min-h-screen bg-stone-50 px-4 py-8 text-stone-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-[32px] border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Product Details</h1>
          <p className="text-sm text-stone-500">Signed in as {user.displayName || 'customer'}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <img src={product.image} alt={product.name} className="h-[360px] w-full rounded-[24px] object-cover" />

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-3xl font-semibold">{product.name}</h2>
              {product.verifiedOrigin ? <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Authenticity Verified</span> : null}
            </div>
            <p className="mt-2 text-stone-600">Origin: {product.origin}</p>
            <p className="mt-6 text-sm leading-7 text-stone-600">{product.description}</p>

            <div className="mt-6 flex items-center gap-4">
              <label htmlFor="quantity" className="text-sm font-medium text-stone-700">Quantity</label>
              <select id="quantity" value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} className="rounded-full border border-stone-300 px-3 py-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </div>

            <div className="mt-6 rounded-2xl border border-stone-200 bg-stone-50 p-4">
              <p className="text-sm text-stone-500">Price</p>
              <p className="text-2xl font-semibold">₹{totalPrice}</p>
              <p className="text-sm text-stone-500">for {quantity} pack{quantity > 1 ? 's' : ''}</p>
            </div>

            <button onClick={() => navigate('/checkout', { state: { product, quantity } })} className="mt-6 w-full rounded-full bg-stone-900 px-4 py-3 font-medium text-white hover:bg-stone-700">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
