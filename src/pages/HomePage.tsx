
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Navbar from '../component/HomePage/Navbar';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';

import heroImage from '../assets/products/Pootharekulu- exotic assorted .jpg';
import logoBadge from '../assets/images/Godavari Special Pootharekulu Badge.jpg';

const HomePage = () => {
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();

  const [query, setQuery] = useState('');
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const filteredVarieties = useMemo(() => {
    const search = query.trim().toLowerCase();

    if (!search) {
      return products;
    }

    return products.filter((product) => {
      const searchableText =
        `${product.name} ${product.description} ${product.category} ${product.origin}`.toLowerCase();

      return searchableText.includes(search);
    });
  }, [query]);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const handleAddToCart = (product: (typeof products)[number]) => {
    addToCart({
      id: String(product.id),
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: 1,
    });

    setAddedProductId(String(product.id));

    window.setTimeout(() => {
      setAddedProductId((currentId) =>
        currentId === String(product.id) ? null : currentId
      );
    }, 1500);
  };

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-stone-50 text-slate-800">
      <Navbar />

      {/* Hero Banner */}
      <section className="mx-auto mt-4 max-w-[1600px] px-4 sm:px-6">
        <div className="relative isolate overflow-hidden rounded-3xl bg-[#082D50]">
          <img
            src={heroImage}
            alt="O-Kart Atreyapuram Pootharekulu assorted gift box"
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />

          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#082D50]/95 via-[#082D50]/80 to-[#082D50]/30" />

          <div className="flex min-h-[410px] items-center px-6 py-12 sm:min-h-[450px] sm:px-12 lg:px-16">
            <div className="max-w-2xl text-white">
              <span className="inline-block rounded-full border border-orange-300/70 bg-orange-500/15 px-4 py-2 text-sm font-semibold text-orange-200">
                A Taste of Andhra Tradition
              </span>

              <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
                Authentic
                <span className="block">Atreyapuram</span>
                <span className="block text-orange-400">
                  Pootharekulu
                </span>
              </h1>

              <p className="mt-4 max-w-xl text-base leading-7 text-white/90 sm:text-lg">
                Discover the delicate, paper-thin traditional sweet
                from Atreyapuram. Explore classic favourites,
                delicious dry-fruit varieties and premium assorted
                gift boxes from O-Kart.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => scrollToSection('varieties')}
                  className="rounded-xl bg-orange-500 px-6 py-3 font-bold text-white shadow-md transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 focus:ring-offset-[#082D50]"
                >
                  Shop Now <span className="ml-2">→</span>
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection('our-story')}
                  className="rounded-xl border border-white/70 px-6 py-3 font-bold text-white transition hover:bg-white hover:text-[#082D50]"
                >
                  Learn More
                </button>
              </div>

              <p className="mt-4 text-sm text-white/80">
                Traditional favourites · Nut-filled treats · Gift boxes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Badge */}
      <section className="mx-auto flex max-w-7xl flex-col items-center px-6 pt-8">
        <img
          src={logoBadge}
          alt="O-Kart Atreyapuram Pootharekulu — Godavari Special Sweet"
          className="h-28 w-28 object-contain sm:h-32 sm:w-32"
        />

        <p className="mt-2 text-center text-sm font-semibold tracking-wide text-[#082D50] sm:text-base">
          Atreyapuram Pootharekulu — Godavari Special Sweet
        </p>
      </section>

      {/* Explore Varieties */}
      <section
        id="varieties"
        className="mx-auto max-w-[1600px] scroll-mt-24 px-4 py-10 sm:px-6 sm:py-12"
      >
        <div className="mb-7 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 sm:text-sm">
            Made for Sweet Moments
          </span>

          <h2 className="mt-2 text-3xl font-extrabold text-[#082D50] sm:text-4xl">
            Explore Our Varieties
          </h2>

          <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Discover traditional, nut-filled and speciality
            Pootharekulu from Atreyapuram.
          </p>
        </div>

        {/* Search */}
        <div className="mx-auto mb-6 max-w-xl">
          <label
            htmlFor="variety-search"
            className="mb-2 block text-sm font-semibold text-[#082D50]"
          >
            Find your favourite variety
          </label>

          <input
            id="variety-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search plain, bellam, dry fruits, kaju..."
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          />
        </div>

        <p className="mb-4 text-sm text-slate-500">
          Showing {filteredVarieties.length} of {products.length} varieties
        </p>

        {filteredVarieties.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredVarieties.map((product) => (
              <article
                key={product.id}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg"
              >
                {/* Product Image */}
                <button
                  type="button"
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="block w-full overflow-hidden bg-orange-50 text-left"
                  aria-label={`View ${product.name}`}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="h-40 w-full object-cover transition duration-300 group-hover:scale-105 sm:h-44"
                  />
                </button>

                {/* Product Details */}
                <div className="flex flex-1 flex-col p-4">
                  <span className="mb-2 w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#075985]">
                    {product.category}
                  </span>

                  <button
                    type="button"
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="text-left text-base font-bold leading-snug text-[#082D50] transition hover:text-orange-600"
                  >
                    {product.name}
                  </button>

                  <p className="mt-2 line-clamp-2 flex-1 text-sm leading-5 text-slate-600">
                    {product.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between gap-2">
                    <span className="text-lg font-extrabold text-[#082D50]">
                      ₹{product.price}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      className="rounded-lg bg-orange-500 px-3 py-2.5 text-sm font-bold text-white transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2"
                      aria-label={`Add ${product.name} to cart`}
                    >
                      {addedProductId === String(product.id)
                        ? 'Added ✓'
                        : '+ Add to Cart'}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50 px-6 py-10 text-center">
            <h3 className="text-lg font-bold text-[#082D50]">
              No varieties found
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              Try searching for plain, bellam, kaju or dry fruits.
            </p>

            <button
              type="button"
              onClick={() => setQuery('')}
              className="mt-4 rounded-lg bg-[#082D50] px-4 py-2 font-semibold text-white transition hover:bg-[#10456F]"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Cart Summary */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-blue-100 bg-blue-50 p-4 sm:p-5">
          <div>
            <h3 className="font-bold text-[#082D50]">
              Your sweet selection
            </h3>

            <p className="mt-1 text-sm text-slate-600">
              {cartCount === 0
                ? 'Choose your favourite Pootharekulu varieties.'
                : `${cartCount} item${cartCount === 1 ? '' : 's'} in your cart.`}
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/cart')}
            className="rounded-lg bg-[#082D50] px-5 py-2.5 font-semibold text-white transition hover:bg-[#10456F]"
          >
            View Cart →
          </button>
        </div>
      </section>

      {/* Story of Pootharekulu */}
      <section
        id="our-story"
        className="scroll-mt-24 border-y border-blue-100 bg-[#EAF3FA] py-10 sm:py-14"
      >
        <div className="mx-auto grid max-w-6xl items-center gap-6 px-5 sm:px-8 md:grid-cols-2">
          <div className="flex justify-center">
            <img
              src={logoBadge}
              alt="O-Kart Godavari Special Pootharekulu"
              loading="lazy"
              className="w-40 object-contain sm:w-52"
            />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 sm:text-sm">
              A Tradition from Andhra Pradesh
            </p>

            <h2 className="mt-2 text-2xl font-extrabold text-[#082D50] sm:text-3xl">
              The Story of Atreyapuram Pootharekulu
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-700 sm:text-base sm:leading-7">
              Atreyapuram, in Andhra Pradesh's Godavari region, is
              renowned for Pootharekulu, a delicate traditional sweet
              made with paper-thin rice starch sheets, ghee and a
              sweet filling. Its distinctive texture comes from the
              careful preparation of these fragile layers.
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-700 sm:text-base sm:leading-7">
              At O-Kart, discover traditional plain and jaggery
              varieties alongside sugar, dry-fruit and assorted
              gift-box options for celebrations and sharing with
              family and friends.
            </p>

            <button
              type="button"
              onClick={() => scrollToSection('varieties')}
              className="mt-5 rounded-lg bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
            >
              Shop Pootharekulu →
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#082D50] px-6 py-6 text-white/80">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="text-center sm:text-left">
            <p className="text-xl font-extrabold text-orange-400">
              O-Kart
            </p>

            <p className="mt-1 text-sm">
              Atreyapuram Pootharekulu — Godavari Special Sweet
            </p>
          </div>

          <p className="text-center text-xs sm:text-sm">
            © {new Date().getFullYear()} O-Kart. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
