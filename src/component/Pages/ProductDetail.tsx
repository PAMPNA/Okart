import { useParams, useNavigate } from "react-router-dom";
import { products } from "../../data/products";
import { useState } from "react";
import RelatedProductCard from "./RelatedProductCard";
import { useCart } from "../../context/CartContext";
const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = products.find((p) => p.id === id);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">Product Not Found</h1>
      </div>
    );
  }
const handleAddToCart = () => {
  addToCart({
    id: product.id,
    name: product.name,
    image: product.image,
    price: product.price,
    quantity: quantity,
  });

  alert("Product added to cart!");
};
  return (
    <div className="min-h-screen bg-gray-100 p-10">

      <button
        onClick={() => navigate("/home")}
        className="mb-8 text-orange-600 font-semibold hover:underline"
      >
        ← Back to Home
      </button>

      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-lg p-10 grid md:grid-cols-2 gap-10">

        {/* Product Image */}
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-2xl"
          />
        </div>

        {/* Product Details */}
        <div>

          <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm">
            Authentic Origin Verified
          </span>

          <h1 className="text-5xl font-bold mt-6">
            {product.name}
          </h1>
          <div className="flex items-center gap-3 mt-4">

  <span className="text-yellow-500 text-xl">
    ⭐⭐⭐⭐⭐
  </span>

  <span className="text-gray-600">
    4.8 (326 Reviews)
  </span>

</div>

          <p className="text-gray-500 mt-3 text-lg">
            📍 {product.origin}
          </p>

          <h2 className="text-4xl font-bold text-orange-600 mt-8">
            ₹{product.price}
          </h2>

          <p className="text-lg text-gray-500">
            per {product.unit}
          </p>

          <div className="mt-8">
            <h3 className="font-bold text-xl">
              Description
            </h3>

            <p className="text-gray-600 mt-3 leading-8">
              {product.description}
            </p>
            <div className="mt-10">

  <h3 className="text-2xl font-semibold mb-5">
    Product Information
  </h3>

  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">

    <div className="grid grid-cols-2 gap-y-4">


      <span className="font-semibold text-gray-600">
        Origin
      </span>

      <span>
        {product.origin}
      </span>

      <span className="font-semibold text-gray-600">
        Weight
      </span>

      <span>
        {product.unit}
      </span>

      <span className="font-semibold text-gray-600">
        Shelf Life
      </span>

      <span>
        20 Days
      </span>

      <span className="font-semibold text-gray-600">
        Delivery
      </span>

      <span>
        2–4 Days
      </span>

      <span className="font-semibold text-gray-600">
        Availability
      </span>

      <span className="text-green-600 font-semibold">
        In Stock
      </span>

    </div>

  </div>

</div>
          </div>

          <div className="mt-10">

  <h3 className="text-xl font-semibold mb-3">
    Quantity
  </h3>

  <div className="flex items-center gap-4 mb-8">

    <button
      onClick={() => quantity > 1 && setQuantity(quantity - 1)}
      className="w-12 h-12 rounded-lg bg-gray-200 text-2xl hover:bg-orange-500 hover:text-white"
    >
      -
    </button>

    <span className="text-2xl font-bold">
      {quantity}
    </span>

    <button
      onClick={() => setQuantity(quantity + 1)}
      className="w-12 h-12 rounded-lg bg-gray-200 text-2xl hover:bg-orange-500 hover:text-white"
    >
      +
    </button>

  </div>
   <div className="flex gap-6">

    <button onClick={handleAddToCart} className="flex-1 bg-orange-500 text-white py-4 rounded-xl text-xl hover:bg-orange-600">

      Add To Cart

    </button>

    <button className="flex-1 border-2 border-orange-500 text-orange-500 py-4 rounded-xl text-xl hover:bg-orange-500 hover:text-white">

      Buy Now

    </button>

  </div>
  
  

</div>

        </div>

      </div>
      <div className="mt-12">

  <h2 className="text-2xl font-bold mb-6">
    Customer Reviews
  </h2>

  <div className="space-y-6">

    <div className="border-b pb-5">

      <div className="flex justify-between">

        <h3 className="font-semibold">
          Ravi Kumar
        </h3>

        <span className="text-yellow-500">
          ⭐⭐⭐⭐⭐
        </span>

      </div>

      <p className="text-gray-600 mt-2">
        Authentic taste exactly like Dharwad. Freshly packed and delivered on time.
      </p>

    </div>

    <div className="border-b pb-5">

      <div className="flex justify-between">

        <h3 className="font-semibold">
          Priya Sharma
        </h3>

        <span className="text-yellow-500">
          ⭐⭐⭐⭐☆
        </span>

      </div>

      <p className="text-gray-600 mt-2">
        Excellent quality and beautiful packaging.
      </p>

    </div>

    <div>

      <div className="flex justify-between">

        <h3 className="font-semibold">
          Rahul Reddy
        </h3>

        <span className="text-yellow-500">
          ⭐⭐⭐⭐⭐
        </span>

      </div>

      <p className="text-gray-600 mt-2">
        Worth every rupee. Will definitely order again.
      </p>

    </div>

  </div>

</div>
<div className="mt-12">

  <h2 className="text-2xl font-bold mb-6">
    Why Buy From O-Kart
  </h2>

  <div className="grid md:grid-cols-2 gap-5">

    <div className="rounded-xl bg-orange-50 p-5">
      ✅ Authentic Regional Products
    </div>

    <div className="rounded-xl bg-orange-50 p-5">
      🚚 Fast Delivery Across India
    </div>

    <div className="rounded-xl bg-orange-50 p-5">
      🛡️ Verified Sellers Only
    </div>

    <div className="rounded-xl bg-orange-50 p-5">
      💳 Secure Payments
    </div>

  </div>

</div>
<div className="max-w-6xl mx-auto mt-16">

  <h2 className="text-3xl font-bold mb-8">
    Related Products
  </h2>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

    {products
      .filter((p) => p.id !== product.id)
      .slice(0, 4)
      .map((item) => (

        <RelatedProductCard
  key={item.id}
  id={item.id}
  name={item.name}
  image={item.image}
  price={item.price}
  origin={item.origin}
/>

      ))}

  </div>

</div>

 

    </div>
    
  );
};

export default ProductDetail;