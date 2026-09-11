import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';

import { products } from '../data/products';
import { auth } from '../lib/firebase';
import Navbar from "../component/HomePage/Navbar";
import Hero from "../component/HomePage/Hero";
//import { auth } from "../lib/firebase";
import categories from "../component/data/categories";
import CategoryCard from "../component/HomePage/CategoryCard";
import ProductCard from "../component/HomePage/ProductCard";
const HomePage = () => {
  const user = auth.currentUser;
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
      <Navbar />
     <div className="max-w-7xl mx-auto mt-8 px-6">
  <Hero />
</div>
<div className="max-w-7xl mx-auto px-6 mt-14">

  <h2 className="text-4xl font-bold mb-8">
    Shop by Category
  </h2>

  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">

    {categories.map((category) => (
      <CategoryCard
        key={category.id}
        name={category.name}
        emoji={category.emoji}
        color={category.color}
      />
    ))}

  </div>

</div>
<div className="max-w-7xl mx-auto px-6 mt-16">

  <h2 className="text-4xl font-bold mb-8">
    🔥 Featured Products
  </h2>

  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

    {products.map((product) => (

      <ProductCard
        key={product.id}
        id={product.id}
        name={product.name}
        image={product.image}
        price={product.price}
        origin={product.origin}
      />

    ))}

  </div>

</div>

      
    </div>
  );
};

export default HomePage;
