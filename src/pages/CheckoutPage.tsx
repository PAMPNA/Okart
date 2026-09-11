import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  // ================= DELIVERY DETAILS =================

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  // ================= PAYMENT =================

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [isProcessing, setIsProcessing] = useState(false);

  // ================= TOTAL =================

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const delivery = subtotal > 0 ? 50 : 0;
  const total = subtotal + delivery;

  // ================= EXPECTED DELIVERY =================

  const getExpectedDelivery = () => {
    const today = new Date();

    const minDate = new Date(today);
    minDate.setDate(minDate.getDate() + 2);

    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 4);

    const format = (date: Date) =>
      date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      });

    return `${format(minDate)} – ${format(maxDate)}`;
  };

  // ================= LOAD RAZORPAY SCRIPT =================

  const loadRazorpayScript = () => {
    return new Promise<boolean>((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");

      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => {
        resolve(true);
      };

      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };

  // ================= VALIDATION =================

  const validateDeliveryDetails = () => {
    if (
      !fullName.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !address.trim() ||
      !city.trim() ||
      !state.trim() ||
      !pincode.trim()
    ) {
      alert("Please fill in all delivery details.");
      return false;
    }

    if (!email.includes("@")) {
      alert("Please enter a valid email address.");
      return false;
    }

    if (phone.replace(/\D/g, "").length !== 10) {
      alert("Please enter a valid 10-digit phone number.");
      return false;
    }

    if (pincode.replace(/\D/g, "").length !== 6) {
      alert("Please enter a valid 6-digit pincode.");
      return false;
    }

    return true;
  };

  // =====================================================
  // CREATE ORDER IN MONGODB
  // =====================================================

  const saveOrder = async ({
    paymentStatus = "Pending",
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    orderStatus = "Placed",
  }: {
    paymentStatus?: string;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
    orderStatus?: string;
  } = {}) => {
    const orderData = {
      customer: {
        fullName,
        email,
        phone,
      },

      deliveryAddress: {
        address,
        city,
        state,
        pincode,
      },

      paymentMethod,

      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        image: item.image,
        quantity: item.quantity,
        price: item.price,
      })),

      subtotal,
      delivery,
      total,

      status: orderStatus,

      paymentStatus,

      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    };

    const response = await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
          data.message ||
          "Failed to create order"
      );
    }

    return data;
  };

  // =====================================================
  // NAVIGATE TO SUCCESS PAGE
  // =====================================================

  const goToSuccessPage = (
    orderData: any,
    razorpayPaymentId?: string,
    razorpayOrderId?: string
  ) => {
    navigate("/order-success", {
      state: {
        orderId: orderData.order._id,

        customer: {
          fullName,
          email,
          phone,
        },

        deliveryAddress: {
          address,
          city,
          state,
          pincode,
        },

        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          image: item.image,
          quantity: item.quantity,
          price: item.price,
        })),

        subtotal,
        delivery,
        total,

        paymentMethod,

        paymentStatus:
          paymentMethod === "COD" ? "Pending" : "Paid",

        razorpayPaymentId,
        razorpayOrderId,
      },
    });
  };

  // =====================================================
  // COD ORDER
  // =====================================================

  const handleCODOrder = async () => {
    try {
      setIsProcessing(true);

      const data = await saveOrder({
        paymentStatus: "Pending",
        orderStatus: "Placed",
      });

      clearCart();

      goToSuccessPage(data);
    } catch (error) {
      console.error("COD order error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Unable to place order. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // =====================================================
  // RAZORPAY PAYMENT
  // =====================================================

  const handleRazorpayPayment = async () => {
    try {
      setIsProcessing(true);

      // -------------------------------------------------
      // STEP 1: LOAD RAZORPAY
      // -------------------------------------------------

      const loaded = await loadRazorpayScript();

      if (!loaded) {
        alert(
          "Razorpay failed to load. Please check your internet connection."
        );

        setIsProcessing(false);
        return;
      }

      // -------------------------------------------------
      // STEP 2: GET FRONTEND RAZORPAY TEST KEY
      // -------------------------------------------------

      const razorpayKey =
        import.meta.env.VITE_RAZORPAY_KEY_ID;

      if (!razorpayKey) {
        alert(
          "Razorpay Key ID is missing. Please add VITE_RAZORPAY_KEY_ID to your frontend .env file."
        );

        setIsProcessing(false);
        return;
      }

      // -------------------------------------------------
      // STEP 3: CREATE O-KART ORDER FIRST
      // -------------------------------------------------
      //
      // This is the important change.
      //
      // We create the MongoDB order BEFORE opening Razorpay.
      // That gives us the MongoDB order ID which we need
      // when verifying the payment.
      //

      const mongoOrderData = await saveOrder({
        paymentStatus: "Pending",
        orderStatus: "Payment Pending",
      });

      const mongoOrderId = mongoOrderData.order._id;

      console.log(
        "O-Kart MongoDB Order ID:",
        mongoOrderId
      );

      // -------------------------------------------------
      // STEP 4: CREATE RAZORPAY ORDER
      // -------------------------------------------------

      const paymentOrderResponse = await fetch(
        "http://localhost:5000/api/orders/create-payment-order",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            amount: total,
          }),
        }
      );

      const paymentOrderData =
        await paymentOrderResponse.json();

      console.log(
        "Razorpay Order Response:",
        paymentOrderData
      );

      if (!paymentOrderResponse.ok) {
        throw new Error(
          paymentOrderData.error ||
            paymentOrderData.message ||
            "Unable to create Razorpay payment order"
        );
      }

      const razorpayOrder =
        paymentOrderData.order;

      if (!razorpayOrder?.id) {
        throw new Error(
          "Invalid Razorpay order received from server."
        );
      }

      console.log(
        "Razorpay Order ID:",
        razorpayOrder.id
      );

      // -------------------------------------------------
      // STEP 5: SAVE RAZORPAY ORDER ID TO MONGODB
      // -------------------------------------------------
      //
      // The current POST /api/orders endpoint creates a
      // new order, so we do NOT create another one here.
      //
      // The verify-payment endpoint will associate the
      // Razorpay order with the existing MongoDB order.
      //

      // -------------------------------------------------
      // STEP 6: OPEN RAZORPAY CHECKOUT
      // -------------------------------------------------

      const options = {
        key: razorpayKey,

        amount: razorpayOrder.amount,

        currency:
          razorpayOrder.currency || "INR",

        name: "O-Kart",

        description: "O-Kart Order Payment",

        order_id: razorpayOrder.id,

        prefill: {
          name: fullName,
          email: email,
          contact: phone,
        },

        notes: {
          address: `${address}, ${city}, ${state} - ${pincode}`,
          order_id: mongoOrderId,
        },

        theme: {
          color: "#f97316",
        },

        // =================================================
        // PAYMENT SUCCESS
        // =================================================

        handler: async function (response: any) {
          try {
            console.log(
              "Razorpay Payment Response:",
              response
            );

            // -------------------------------------------------
            // STEP 7: VERIFY PAYMENT ON BACKEND
            // -------------------------------------------------

            const verifyResponse = await fetch(
              "http://localhost:5000/api/orders/verify-payment",
              {
                method: "POST",

                headers: {
                  "Content-Type": "application/json",
                },

                body: JSON.stringify({
                  orderId: mongoOrderId,

                  razorpay_order_id:
                    response.razorpay_order_id,

                  razorpay_payment_id:
                    response.razorpay_payment_id,

                  razorpay_signature:
                    response.razorpay_signature,
                }),
              }
            );

            const verifyData =
              await verifyResponse.json();

            console.log(
              "Payment Verification Response:",
              verifyData
            );

            // -------------------------------------------------
            // PAYMENT VERIFICATION FAILED
            // -------------------------------------------------

            if (
              !verifyResponse.ok ||
              !verifyData.success
            ) {
              throw new Error(
                verifyData.message ||
                  "Payment verification failed."
              );
            }

            // -------------------------------------------------
            // PAYMENT VERIFIED
            // -------------------------------------------------

            console.log(
              "✅ Payment verified successfully."
            );

            console.log(
              "MongoDB Order:",
              verifyData.order
            );

            // -------------------------------------------------
            // CLEAR CART
            // -------------------------------------------------

            clearCart();

            // -------------------------------------------------
            // SUCCESS PAGE
            // -------------------------------------------------

            navigate("/order-success", {
              state: {
                orderId: mongoOrderId,

                customer: {
                  fullName,
                  email,
                  phone,
                },

                deliveryAddress: {
                  address,
                  city,
                  state,
                  pincode,
                },

                items: cart.map((item) => ({
                  id: item.id,
                  name: item.name,
                  image: item.image,
                  quantity: item.quantity,
                  price: item.price,
                })),

                subtotal,
                delivery,
                total,

                paymentMethod,

                paymentStatus: "Paid",

                razorpayPaymentId:
                  response.razorpay_payment_id,

                razorpayOrderId:
                  response.razorpay_order_id,
              },
            });
          } catch (error) {
            console.error(
              "Payment verification/order error:",
              error
            );

            alert(
              error instanceof Error
                ? error.message
                : "Payment was successful, but verification failed. Please contact support."
            );

            setIsProcessing(false);
          }
        },

        // =================================================
        // PAYMENT WINDOW CLOSED
        // =================================================

        modal: {
          ondismiss: function () {
            console.log(
              "Razorpay payment window closed."
            );

            setIsProcessing(false);
          },
        },
      };

      // -------------------------------------------------
      // STEP 7: CREATE RAZORPAY INSTANCE
      // -------------------------------------------------

      const razorpay =
        new window.Razorpay(options);

      // -------------------------------------------------
      // PAYMENT FAILED
      // -------------------------------------------------

      razorpay.on(
        "payment.failed",
        function (response: any) {
          console.error(
            "Razorpay payment failed:",
            response
          );

          alert(
            response?.error?.description ||
              "Payment failed. Please try again."
          );

          setIsProcessing(false);
        }
      );

      // -------------------------------------------------
      // OPEN CHECKOUT
      // -------------------------------------------------

      razorpay.open();
    } catch (error) {
      console.error(
        "Razorpay payment error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to start payment. Please try again."
      );

      setIsProcessing(false);
    }
  };

  // =====================================================
  // PLACE ORDER
  // =====================================================

  const handlePlaceOrder = async () => {
    if (!validateDeliveryDetails()) {
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    if (paymentMethod === "COD") {
      await handleCODOrder();
    } else {
      await handleRazorpayPayment();
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">

        {/* ================= HEADER ================= */}

        <div className="mb-10">
          <button
            onClick={() => navigate("/home")}
            className="text-orange-600 hover:text-orange-700 font-semibold mb-5"
          >
            ← Back to Shopping
          </button>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Checkout
          </h1>

          <p className="text-gray-500 mt-2 text-lg">
            Complete your order securely
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">

          {/* ================= DELIVERY DETAILS ================= */}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">

            <div className="flex items-center gap-3 mb-7">
              <span className="text-3xl">📍</span>

              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Delivery Details
                </h2>

                <p className="text-gray-500">
                  Where should we deliver your order?
                </p>
              </div>
            </div>

            <div className="space-y-5">

              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) =>
                  setFullName(e.target.value)
                }
                className="w-full border border-gray-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-orange-400"
              />

              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full border border-gray-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-orange-400"
              />

              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) =>
                  setPhone(
                    e.target.value.replace(/\D/g, "")
                  )
                }
                maxLength={10}
                className="w-full border border-gray-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-orange-400"
              />

              <textarea
                placeholder="Delivery Address"
                value={address}
                onChange={(e) =>
                  setAddress(e.target.value)
                }
                rows={4}
                className="w-full border border-gray-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-orange-400"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) =>
                    setCity(e.target.value)
                  }
                  className="w-full border border-gray-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-orange-400"
                />

                <input
                  type="text"
                  placeholder="State"
                  value={state}
                  onChange={(e) =>
                    setState(e.target.value)
                  }
                  className="w-full border border-gray-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-orange-400"
                />

              </div>

              <input
                type="text"
                placeholder="Pincode"
                value={pincode}
                onChange={(e) =>
                  setPincode(
                    e.target.value.replace(/\D/g, "")
                  )
                }
                maxLength={6}
                className="w-full border border-gray-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-orange-400"
              />

            </div>

            {/* ================= PAYMENT ================= */}

            <div className="mt-10 border-t pt-8">

              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">💳</span>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Payment Method
                  </h2>

                  <p className="text-gray-500">
                    Choose your preferred payment option
                  </p>
                </div>
              </div>

              <div className="space-y-3">

                {/* COD */}

                <label
                  className={`flex items-center gap-3 border rounded-xl p-4 cursor-pointer transition ${
                    paymentMethod === "COD"
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:bg-orange-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={
                      paymentMethod === "COD"
                    }
                    onChange={(e) =>
                      setPaymentMethod(
                        e.target.value
                      )
                    }
                  />

                  <div>
                    <p className="font-semibold">
                      Cash on Delivery
                    </p>

                    <p className="text-sm text-gray-500">
                      Pay when your order arrives
                    </p>
                  </div>
                </label>

                {/* UPI */}

                <label
                  className={`flex items-center gap-3 border rounded-xl p-4 cursor-pointer transition ${
                    paymentMethod === "UPI"
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:bg-orange-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="UPI"
                    checked={
                      paymentMethod === "UPI"
                    }
                    onChange={(e) =>
                      setPaymentMethod(
                        e.target.value
                      )
                    }
                  />

                  <div>
                    <p className="font-semibold">
                      UPI
                    </p>

                    <p className="text-sm text-gray-500">
                      Pay securely using UPI
                    </p>
                  </div>
                </label>

                {/* CARD */}

                <label
                  className={`flex items-center gap-3 border rounded-xl p-4 cursor-pointer transition ${
                    paymentMethod === "CARD"
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:bg-orange-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="CARD"
                    checked={
                      paymentMethod === "CARD"
                    }
                    onChange={(e) =>
                      setPaymentMethod(
                        e.target.value
                      )
                    }
                  />

                  <div>
                    <p className="font-semibold">
                      Credit / Debit Card
                    </p>

                    <p className="text-sm text-gray-500">
                      Visa, Mastercard and more
                    </p>
                  </div>
                </label>

              </div>

              {/* Razorpay information */}

              {paymentMethod !== "COD" && (
                <div className="mt-5 bg-orange-50 border border-orange-100 rounded-xl p-5">

                  <div className="flex items-start gap-3">

                    <span className="text-2xl">
                      🔐
                    </span>

                    <div>

                      <h3 className="font-bold text-gray-900">
                        Secure Payment
                      </h3>

                      <p className="text-sm text-gray-600 mt-1">
                        You will be redirected to
                        Razorpay's secure payment
                        window to complete your
                        payment.
                      </p>

                    </div>

                  </div>

                </div>
              )}

            </div>

          </div>

          {/* ================= ORDER SUMMARY ================= */}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 h-fit">

            <div className="flex items-center gap-3 mb-7">

              <span className="text-3xl">
                🛒
              </span>

              <div>

                <h2 className="text-2xl font-bold text-gray-900">
                  Order Summary
                </h2>

                <p className="text-gray-500">
                  {cart.length}{" "}
                  {cart.length === 1
                    ? "product"
                    : "products"}
                </p>

              </div>

            </div>

            {/* PRODUCTS */}

            <div className="space-y-4">

              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 bg-gray-50 rounded-xl p-4"
                >

                  <div className="w-20 h-20 bg-white rounded-xl overflow-hidden border border-gray-100 shrink-0">

                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">
                        🍬
                      </div>
                    )}

                  </div>

                  <div className="flex-1 min-w-0">

                    <h3 className="font-bold text-gray-900">
                      {item.name}
                    </h3>

                    <p className="text-gray-500 mt-1">
                      ₹
                      {item.price.toLocaleString(
                        "en-IN"
                      )}{" "}
                      × {item.quantity}
                    </p>

                  </div>

                  <p className="font-bold text-orange-600">
                    ₹
                    {(
                      item.price *
                      item.quantity
                    ).toLocaleString("en-IN")}
                  </p>

                </div>
              ))}

            </div>

            {/* EXPECTED DELIVERY */}

            <div className="mt-6 bg-green-50 rounded-xl p-4">

              <p className="text-sm text-gray-500">
                🚚 Expected Delivery
              </p>

              <p className="font-bold text-green-600 mt-1">
                {getExpectedDelivery()}
              </p>

            </div>

            {/* PRICE */}

            <div className="border-t mt-6 pt-6 space-y-4">

              <div className="flex justify-between">

                <span className="text-gray-600">
                  Subtotal
                </span>

                <span>
                  ₹
                  {subtotal.toLocaleString(
                    "en-IN"
                  )}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-gray-600">
                  Delivery
                </span>

                <span>
                  ₹
                  {delivery.toLocaleString(
                    "en-IN"
                  )}
                </span>

              </div>

              <div className="border-t pt-5 flex justify-between items-center">

                <span className="text-2xl font-bold">
                  Total
                </span>

                <span className="text-3xl font-bold text-orange-600">
                  ₹
                  {total.toLocaleString(
                    "en-IN"
                  )}
                </span>

              </div>

            </div>

            {/* PLACE ORDER */}

            <button
              onClick={handlePlaceOrder}
              disabled={
                isProcessing ||
                cart.length === 0
              }
              className={`w-full text-white py-4 rounded-xl text-lg font-bold mt-8 transition ${
                isProcessing ||
                cart.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600"
              }`}
            >
              {isProcessing
                ? paymentMethod === "COD"
                  ? "Placing Order..."
                  : "Processing Secure Payment..."
                : paymentMethod === "COD"
                ? `Place Order • ₹${total.toLocaleString(
                    "en-IN"
                  )}`
                : `Pay ₹${total.toLocaleString(
                    "en-IN"
                  )}`}
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
              🔒 Your payment and order
              information are securely processed
            </p>

          </div>

        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;