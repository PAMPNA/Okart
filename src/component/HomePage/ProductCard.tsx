
import { useCart } from "../../context/CartContext";

interface ProductProps {
  id: string;
  name: string;
  image: string;
  price: number;
  origin: string;
  category: string;
}

const ProductCard = ({
  id,
  name,
  image,
  price,
  origin,
}: ProductProps) => {
  const {
    cart,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const cartItem = cart.find((item) => item.id === id);

  const handleAddToCart = () => {
    addToCart({
      id,
      name,
      image,
      price,
      quantity: 1,
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden h-full flex flex-col">
      <img
        src={image}
        alt={name}
        className="w-full h-60 object-cover"
      />

      <div className="p-5 flex-1 flex flex-col">
        <h2 className="text-2xl font-bold">
          {name}
        </h2>

        <p className="text-gray-500 mt-2">
          📍 {origin}
        </p>

        <div className="flex justify-between items-center mt-auto pt-5">
          <span className="text-2xl font-bold text-orange-600">
            ₹{price}
          </span>
        </div>

        {!cartItem ? (
          <button
            onClick={handleAddToCart}
           className="w-full mt-5 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-full font-semibold transition"
          >
            Add to Cart
          </button>
        ) : (
          <div className="flex items-center justify-center gap-5 mt-auto">
            <button
              onClick={() => decreaseQuantity(id)}
              className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 text-xl font-semibold"
            >
              −
            </button>

            <span className="text-xl font-semibold min-w-6 text-center">
              {cartItem.quantity}
            </span>

            <button
              onClick={() => increaseQuantity(id)}
              className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 text-xl font-semibold"
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;