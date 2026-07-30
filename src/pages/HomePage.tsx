import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { products } from '../data/products';
import { auth } from '../lib/firebase';

interface HomePageProps {
  user: User;
}

const HomePage = ({ user }: HomePageProps) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const filteredProducts = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return products;
    return products.filter((product) => {
      const haystack = `${product.name} ${product.origin} ${product.description}`.toLowerCase();
      return haystack.includes(search);
    });
  }, [query]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800">
      <header className="border-b border-stone-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 font-semibold text-amber-700">O</div>
            <div>
              <p className="font-semibold">O-Kart</p>
              <p className="text-xs text-stone-500">Authentic Products From Their Origin</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {user.photoURL ? <img src={user.photoURL} alt="Profile" className="h-10 w-10 rounded-full" /> : null}
            <button onClick={handleLogout} className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[32px] border border-stone-200 bg-gradient-to-r from-stone-900 to-stone-700 text-white shadow-sm">
          <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:p-10">
            <div>
              <p className="mb-3 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm">Fresh from Dharwad</p>
              <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">Original Dharwad Peda Delivered Directly From Dharwad</h1>
              <p className="mt-4 max-w-xl text-sm text-stone-200 sm:text-base">A premium regional sweet with authentic origin and direct sourcing.</p>
            </div>
            <img
              src="https://images.unsplash.com/photo-1598089842302-5a0d7d2c2c14?auto=format&fit=crop&w=900&q=80"
              alt="Dharwad peda"
              className="h-72 w-full rounded-2xl object-cover"
            />
          </div>
        </section>

        <section className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-sm">
          <label className="mb-3 block text-sm font-medium text-stone-700" htmlFor="search">Search sweets</label>
          <input
            id="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search sweets..."
            className="w-full rounded-full border border-stone-300 px-4 py-3 outline-none ring-0"
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          {filteredProducts.map((product) => (
            <article key={product.id} className="overflow-hidden rounded-[28px] border border-stone-200 bg-white shadow-sm">
              <img src={product.image} alt={product.name} className="h-60 w-full object-cover" />
              <div className="p-6">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-xl font-semibold">{product.name}</h2>
                  {product.verifiedOrigin ? <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Authenticity Verified</span> : null}
                </div>
                <p className="mt-2 text-sm text-stone-600">Origin: {product.origin}</p>
                <p className="mt-4 text-lg font-semibold text-stone-900">₹{product.price} per {product.unit}</p>
                <div className="mt-5 flex gap-3">
                  <button onClick={() => navigate(`/product/${product.id}`)} className="flex-1 rounded-full border border-stone-300 px-4 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50">
                    View Details
                  </button>
                  <button onClick={() => navigate(`/product/${product.id}`)} className="flex-1 rounded-full bg-stone-900 px-4 py-3 text-sm font-medium text-white hover:bg-stone-700">
                    Buy Now
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
};

export default HomePage;
