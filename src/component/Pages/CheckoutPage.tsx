import { useCart } from "../../context/CartContext";

const CheckoutPage = () => {
  const { cart } = useCart();

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const delivery = subtotal > 0 ? 50 : 0;

  const total = subtotal + delivery;

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-5xl font-bold mb-10">
        Checkout
      </h1>

      <div className="grid lg:grid-cols-2 gap-10">

        {/* Customer Details */}

        <div className="bg-white rounded-2xl shadow p-8">

          <h2 className="text-2xl font-bold mb-6">
            Delivery Details
          </h2>

          {/* Inputs will come here */}

        </div>

        {/* Order Summary */}

        <div className="bg-white rounded-2xl shadow p-8 h-fit">

          <h2 className="text-2xl font-bold mb-6">
            Order Summary
          </h2>

          {cart.map((item) => (

            <div
              key={item.id}
              className="flex justify-between mb-3"
            >

              <span>
                {item.name} × {item.quantity}
              </span>

              <span>
                ₹{item.price * item.quantity}
              </span>

            </div>

          ))}

          <hr className="my-5" />

          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div className="flex justify-between mb-2">
            <span>Delivery</span>
            <span>₹{delivery}</span>
          </div>

          <div className="flex justify-between text-2xl font-bold mt-6">
            <span>Total</span>
            <span className="text-orange-600">
              ₹{total}
            </span>
          </div>

        </div>

      </div>

    </div>
  );
};

export default CheckoutPage;