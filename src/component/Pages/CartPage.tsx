import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
const CartPage = () => {
const { cart, increaseQuantity, decreaseQuantity, removeFromCart } = useCart();
const navigate = useNavigate();
const subtotal = cart.reduce(
  (total, item) => total + item.price * item.quantity,
  0
);

const delivery = subtotal > 0 ? 50 : 0;

const total = subtotal + delivery;
  
  return (
    
    <div className="min-h-screen bg-gray-100 p-10">
     <h1 className="text-5xl font-bold mb-10">
  Shopping Cart
</h1>

{cart.length === 0 ? (
  <p>Your cart is empty.</p>
) : (
  <div className="grid lg:grid-cols-3 gap-8">

    {/* Left Side - Cart Items */}
    <div className="lg:col-span-2 space-y-6">

      {cart.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between bg-white rounded-xl shadow p-5"
        >
          <div className="flex items-center gap-5">

            <img
              src={item.image}
              alt={item.name}
              className="w-24 h-24 object-cover rounded-lg"
            />

            <div>

              <h2 className="text-xl font-semibold">
                {item.name}
              </h2>

              <div className="flex items-center gap-3 mt-3">

                <button
                  onClick={() => decreaseQuantity(item.id)}
                className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-orange-500 hover:text-white transition"
                >
                  -
                </button>

                <span className="font-semibold">
                  {item.quantity}
                </span>

                <button
                  onClick={() => increaseQuantity(item.id)}
                  className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-orange-500 hover:text-white transition"
                >
                  +
                </button>

              </div>

            </div>

          </div>

          <div className="text-right">

            <h2 className="text-2xl font-bold text-orange-600">
              ₹{item.price * item.quantity}
            </h2>

            <button
              onClick={() => removeFromCart(item.id)}
              className="mt-3 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
>
  🗑 Remove
            </button>

          </div>

        </div>
      ))}

    </div>

    {/* Right Side - Order Summary */}
    <div className="bg-white rounded-2xl shadow p-6 h-fit">

      <h2 className="text-2xl font-bold mb-6">
        Order Summary
      </h2>

      <div className="flex justify-between mb-4">
        <span>Subtotal</span>
        <span>₹{subtotal}</span>
      </div>

      <div className="flex justify-between mb-4">
        <span>Delivery</span>
        <span>₹{delivery}</span>
      </div>

      <hr className="my-5" />

      <div className="flex justify-between text-xl font-bold">
        <span>Total</span>
        <span className="text-orange-600">
          ₹{total}
        </span>
      </div>

      <button onClick={() => navigate("/checkout")} className="w-full mt-8 bg-orange-500 text-white py-4 rounded-xl hover:bg-orange-600">
        Proceed to Checkout
      </button>

    </div>

  </div>
)}
    </div>
  );
};

export default CartPage;