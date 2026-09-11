import { useLocation, useNavigate } from "react-router-dom";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface OrderData {
  orderId?: string;

  customer?: {
    fullName?: string;
    email?: string;
    phone?: string;
  };

  deliveryAddress?: {
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };

  items?: OrderItem[];

  subtotal?: number;
  delivery?: number;
  total?: number;

  paymentMethod?: string;
}

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const order = location.state as OrderData | undefined;

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10">

      <div className="max-w-4xl mx-auto">

        {/* Success Header */}

        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">

          <div className="text-6xl mb-4">
            🎉
          </div>

          <h1 className="text-4xl font-bold text-green-600">
            Order Placed Successfully!
          </h1>

          <p className="text-gray-600 mt-4">
            Thank you for shopping with O-Kart.
          </p>

          <p className="text-gray-600">
            Your order has been confirmed and will be delivered soon.
          </p>

        </div>


        {/* Order Information */}

        <div className="grid md:grid-cols-2 gap-6 mt-6">

          {/* Customer & Delivery */}

          <div className="bg-white rounded-2xl shadow-lg p-6">

            <h2 className="text-2xl font-bold mb-5">
              Delivery Details
            </h2>

            <div className="space-y-4">

              <div>
                <p className="text-sm text-gray-500">
                  Customer
                </p>

                <p className="font-semibold">
                  {order?.customer?.fullName || "Customer"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Email
                </p>

                <p className="font-semibold">
                  {order?.customer?.email || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Phone
                </p>

                <p className="font-semibold">
                  {order?.customer?.phone || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Delivery Address
                </p>

                <p className="font-semibold">
                  {order?.deliveryAddress?.address || "-"}
                </p>

                <p className="text-gray-600">
                  {order?.deliveryAddress?.city || ""},{" "}
                  {order?.deliveryAddress?.state || ""}
                </p>

                <p className="text-gray-600">
                  {order?.deliveryAddress?.pincode || ""}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Payment Method
                </p>

                <p className="font-semibold">
                  {order?.paymentMethod || "Cash on Delivery"}
                </p>
              </div>

            </div>

          </div>


          {/* Order Summary */}

          <div className="bg-white rounded-2xl shadow-lg p-6">

            <h2 className="text-2xl font-bold mb-5">
              Order Summary
            </h2>

            <div className="space-y-4">

              {order?.items?.map((item) => (

                <div
                  key={item.id}
                  className="flex justify-between items-center"
                >

                  <div>
                    <p className="font-semibold">
                      {item.name}
                    </p>

                    <p className="text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  <p className="font-semibold">
                    ₹{item.price * item.quantity}
                  </p>

                </div>

              ))}

            </div>

            <hr className="my-5" />

            <div className="flex justify-between mb-2">
              <span>Subtotal</span>

              <span>
                ₹{order?.subtotal ?? 0}
              </span>
            </div>

            <div className="flex justify-between mb-2">
              <span>Delivery</span>

              <span>
                ₹{order?.delivery ?? 0}
              </span>
            </div>

            <div className="flex justify-between text-2xl font-bold mt-5">

              <span>
                Total
              </span>

              <span className="text-orange-600">
                ₹{order?.total ?? 0}
              </span>

            </div>

          </div>

        </div>


        {/* Order ID */}

        <div className="bg-white rounded-2xl shadow-lg p-6 mt-6 text-center">

          <p className="text-gray-500">
            Order ID
          </p>

          <p className="font-bold text-lg mt-1">
            {order?.orderId || "Order confirmed"}
          </p>

          <div className="mt-6 bg-gray-100 rounded-xl p-5">

            <p className="text-lg">
              Estimated Delivery
            </p>

            <p className="font-bold text-orange-600 text-2xl">
              2 – 4 Days
            </p>

          </div>

        </div>


        {/* Continue Shopping */}

        <button
          onClick={() => navigate("/home")}
          className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl text-xl"
        >
          Continue Shopping
        </button>

      </div>

    </div>
  );
};

export default OrderSuccessPage;