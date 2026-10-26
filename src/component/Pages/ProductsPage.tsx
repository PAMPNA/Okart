import { useSearchParams, useNavigate } from "react-router-dom";
import { products } from "../../data/products";
import ProductCard from "../HomePage/ProductCard";

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const selectedCategory = searchParams.get("category");

  const filteredProducts = selectedCategory
    ? products.filter(
        (product) =>
          product.category.toLowerCase() ===
          selectedCategory.toLowerCase()
      )
    : products;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800">

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 pt-10">
       <button
    onClick={() => navigate(-1)}
    className="mb-6 flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
  >
    <span className="text-2xl">←</span>
    Back
  </button>
        <h1 className="text-4xl font-bold">
          {selectedCategory || "All Products"}
        </h1>

        <p className="text-gray-500 mt-2">
          {selectedCategory
            ? `Explore authentic ${selectedCategory.toLowerCase()} from across India.`
            : "Discover authentic sweets, snacks and regional foods from India."}
        </p>

      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-6 py-10">

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold">
              No products found
            </h2>

            <p className="text-gray-500 mt-2">
              There are no products in this category yet.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                image={product.image}
                price={product.price}
                origin={product.origin}
                category={product.category}
              />
            ))}

          </div>
        )}

      </div>

    </div>
  );
};

export default ProductsPage;