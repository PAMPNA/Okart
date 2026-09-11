import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

interface OrderItem {
  id: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
  _id?: string;
}

interface Order {
  _id: string;

  customer: {
    fullName: string;
    email: string;
    phone: string;
  };

  deliveryAddress: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };

  items: OrderItem[];

  paymentMethod: string;
  subtotal: number;
  delivery: number;
  total: number;
  status: string;
  createdAt: string;
}

type StatusFilter =
  | "All"
  | "Placed"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

type IssueType =
  | "Damaged Item"
  | "Wrong Item"
  | "Missing Item"
  | "Quality Issue";

const OrderHistoryPage = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");

  // Stores which orders are expanded
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(
    new Set()
  );

  // Report issue modal
  const [issueModal, setIssueModal] = useState<{
    order: Order;
    item: OrderItem;
  } | null>(null);

  const [selectedIssue, setSelectedIssue] = useState<IssueType | "">("");

  // Temporary email until authentication is connected
  const email = "test@gmail.com";

  // --------------------------------------------------
  // FETCH ORDERS
  // --------------------------------------------------

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `http://localhost:5000/api/orders?email=${encodeURIComponent(
            email
          )}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch orders");
        }

        setOrders(data.orders || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Unable to load your orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // --------------------------------------------------
  // HELPERS
  // --------------------------------------------------

  const normalizeStatus = (status: string) => {
    const value = status?.toLowerCase().trim();

    if (value === "completed") return "delivered";
    if (value === "cancel") return "cancelled";

    return value;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getDeliveryDate = (date: string) => {
    const orderDate = new Date(date);

    const minDate = new Date(orderDate);
    minDate.setDate(minDate.getDate() + 2);

    const maxDate = new Date(orderDate);
    maxDate.setDate(maxDate.getDate() + 4);

    const format = (deliveryDate: Date) =>
      deliveryDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      });

    return `${format(minDate)} – ${format(maxDate)}`;
  };

  const getStatusStyle = (status: string) => {
    switch (normalizeStatus(status)) {
      case "delivered":
        return "bg-green-100 text-green-700";

      case "shipped":
        return "bg-blue-100 text-blue-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      case "placed":
      default:
        return "bg-orange-100 text-orange-700";
    }
  };

  const getStatusDotStyle = (status: string) => {
    switch (normalizeStatus(status)) {
      case "delivered":
        return "bg-green-500";

      case "shipped":
        return "bg-blue-500";

      case "cancelled":
        return "bg-red-500";

      default:
        return "bg-orange-500";
    }
  };

  // --------------------------------------------------
  // SEARCH + FILTER
  // --------------------------------------------------

  const filteredOrders = useMemo(() => {
    const query = search.toLowerCase().trim();

    return orders.filter((order) => {
      const normalizedStatus = normalizeStatus(order.status);

      const matchesStatus =
        statusFilter === "All" ||
        normalizedStatus === statusFilter.toLowerCase();

      const matchesSearch =
        !query ||
        order._id.toLowerCase().includes(query) ||
        order.items.some((item) =>
          item.name.toLowerCase().includes(query)
        );

      return matchesStatus && matchesSearch;
    });
  }, [orders, search, statusFilter]);

  // --------------------------------------------------
  // COUNTS
  // --------------------------------------------------

  const getStatusCount = (status: StatusFilter) => {
    if (status === "All") return orders.length;

    return orders.filter(
      (order) =>
        normalizeStatus(order.status) === status.toLowerCase()
    ).length;
  };

  // --------------------------------------------------
  // COLLAPSE / EXPAND
  // --------------------------------------------------

  const toggleOrder = (orderId: string) => {
    setExpandedOrders((previous) => {
      const next = new Set(previous);

      if (next.has(orderId)) {
        next.delete(orderId);
      } else {
        next.add(orderId);
      }

      return next;
    });
  };

  // --------------------------------------------------
  // ACTIONS
  // --------------------------------------------------

  const handleCancelOrder = (order: Order) => {
    const confirmed = window.confirm(
      `Are you sure you want to cancel order #${order._id}?`
    );

    if (!confirmed) return;

    /*
      IMPORTANT:
      Your current API only specifies:
        GET /api/orders?email=...

      So we do NOT invent a cancel endpoint here.

      When your backend has one, replace this alert with:
        await fetch(`/api/orders/${order._id}/cancel`, {
          method: "PATCH"
        });

      Then refresh the orders.
    */

    alert(
      `Cancel request selected for order #${order._id}.\n\nConnect your cancel-order API here.`
    );
  };

  const handleTrackOrder = (order: Order) => {
    /*
      If you later create a dedicated tracking page,
      change this to:

      navigate(`/orders/${order._id}/track`);
    */

    toggleOrder(order._id);
  };

  const handleBuyAgain = (order: Order) => {
    /*
      We keep this safe because the current project information
      only confirms the orders API and does not define your cart API.

      Connect this to your existing cart/context implementation.
    */

    alert(
      `Buy Again selected.\n\n${order.items
        .map((item) => `${item.name} × ${item.quantity}`)
        .join("\n")}`
    );
  };

  const handleSubmitIssue = () => {
    if (!issueModal || !selectedIssue) return;

    /*
      Current backend API only confirms GET /api/orders.
      This is therefore UI-ready but backend submission
      should be connected when the issue API is created.
    */

    alert(
      `Issue reported successfully.\n\n` +
        `Order: #${issueModal.order._id}\n` +
        `Item: ${issueModal.item.name}\n` +
        `Issue: ${selectedIssue}`
    );

    setIssueModal(null);
    setSelectedIssue("");
  };

  // --------------------------------------------------
  // TRACKING TIMELINE
  // --------------------------------------------------

  const trackingSteps = [
    {
      key: "placed",
      label: "Placed",
      icon: "🧾",
    },
    {
      key: "shipped",
      label: "Shipped",
      icon: "📦",
    },
    {
      key: "outfordelivery",
      label: "Out for Delivery",
      icon: "🛵",
    },
    {
      key: "delivered",
      label: "Delivered",
      icon: "✓",
    },
  ];

  const getTrackingIndex = (status: string) => {
    switch (normalizeStatus(status)) {
      case "delivered":
        return 3;

      case "shipped":
        return 1;

      case "outfordelivery":
        return 2;

      case "placed":
      default:
        return 0;
    }
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">📦</div>

          <p className="text-xl font-semibold text-gray-600">
            Loading your orders...
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // ERROR
  // --------------------------------------------------

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 text-center max-w-md w-full">
          <div className="text-5xl mb-4">⚠️</div>

          <h2 className="text-2xl font-bold text-gray-900">
            Something went wrong
          </h2>

          <p className="text-gray-500 mt-3">{error}</p>

          <button
            onClick={() => window.location.reload()}
            className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-7 py-3 rounded-xl font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // MAIN PAGE
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">

        {/* BACK */}
        <button
          onClick={() => navigate("/home")}
          className="text-orange-600 hover:text-orange-700 font-semibold mb-8"
        >
          ← Back to Home
        </button>

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              My Orders
            </h1>

            <p className="text-gray-500 mt-2 text-lg">
              Track and manage all your orders
            </p>
          </div>

          <div className="bg-orange-100 text-orange-700 px-6 py-4 rounded-2xl font-bold text-lg">
            📦 {orders.length}{" "}
            {orders.length === 1 ? "Order" : "Orders"}
          </div>
        </div>

        {/* SEARCH + FILTERS */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-5 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">

            {/* SEARCH */}
            <div className="relative flex-1">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl">
                🔎
              </span>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by order ID or product name..."
                className="w-full h-14 rounded-xl border border-gray-200 pl-14 pr-5 text-gray-800 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            {/* FILTERS */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {(
                [
                  "All",
                  "Placed",
                  "Shipped",
                  "Delivered",
                  "Cancelled",
                ] as StatusFilter[]
              ).map((status) => {
                const active = statusFilter === status;

                return (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`whitespace-nowrap px-5 h-14 rounded-xl font-semibold transition ${
                      active
                        ? "bg-orange-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {status}

                    <span
                      className={`ml-2 text-sm ${
                        active ? "text-white/80" : "text-gray-400"
                      }`}
                    >
                      {getStatusCount(status)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* NO RESULTS */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="text-6xl mb-5">
              {search ? "🔎" : "🛍️"}
            </div>

            <h2 className="text-2xl font-bold text-gray-900">
              {search || statusFilter !== "All"
                ? "No matching orders"
                : "No Orders Yet"}
            </h2>

            <p className="text-gray-500 mt-2">
              {search || statusFilter !== "All"
                ? "Try changing your search or status filter."
                : "You haven't placed any orders yet."}
            </p>

            {(search || statusFilter !== "All") && (
              <button
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
                }}
                className="mt-6 text-orange-600 font-semibold"
              >
                Clear Filters
              </button>
            )}

            {!search && statusFilter === "All" && (
              <button
                onClick={() => navigate("/home")}
                className="mt-7 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold"
              >
                Start Shopping
              </button>
            )}
          </div>
        ) : (
          /* ORDER LIST */
          <div className="space-y-5">
            {filteredOrders.map((order) => {
              const status = normalizeStatus(order.status);
              const isExpanded = expandedOrders.has(order._id);
              const trackingIndex = getTrackingIndex(order.status);

              const firstItems = order.items.slice(0, 2);
              const remainingItems = Math.max(
                order.items.length - 2,
                0
              );

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden transition hover:shadow-md"
                >
                  {/* ======================================
                      COMPACT ORDER CARD
                  ====================================== */}

                  <div className="p-5 md:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-5">

                      {/* PRODUCT PREVIEW */}
                      <div className="flex items-center min-w-0 flex-1">
                        <div className="flex items-center mr-4 shrink-0">
                          {firstItems.map((item, index) => (
                            <div
                              key={item._id || item.id}
                              className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border-2 border-white shadow-sm bg-gray-100 ${
                                index > 0 ? "-ml-4" : ""
                              }`}
                            >
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-2xl">
                                  🍬
                                </div>
                              )}
                            </div>
                          ))}

                          {remainingItems > 0 && (
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gray-100 border-2 border-white -ml-4 flex items-center justify-center text-sm font-bold text-gray-600">
                              +{remainingItems}
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <h2 className="text-lg md:text-xl font-bold text-gray-900 truncate">
                            {order.items[0]?.name || "Order"}
                            {order.items.length > 1 &&
                              ` + ${order.items.length - 1} more`}
                          </h2>

                          <p className="text-gray-500 mt-1 text-sm md:text-base truncate">
                            Order #{order._id}
                          </p>
                        </div>
                      </div>

                      {/* ORDERED */}
                      <div className="lg:w-40">
                        <p className="text-xs uppercase tracking-wide text-gray-400">
                          Ordered
                        </p>

                        <p className="font-semibold text-gray-900 mt-1">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>

                      {/* TOTAL */}
                      <div className="lg:w-28">
                        <p className="text-xs uppercase tracking-wide text-gray-400">
                          Total
                        </p>

                        <p className="font-bold text-orange-600 text-lg mt-1">
                          ₹{order.total.toLocaleString("en-IN")}
                        </p>
                      </div>

                      {/* STATUS */}
                      <div>
                        <span
                          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold ${getStatusStyle(
                            order.status
                          )}`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${getStatusDotStyle(
                              order.status
                            )}`}
                          />

                          {order.status}
                        </span>
                      </div>

                      {/* VIEW DETAILS */}
                      <button
                        onClick={() => toggleOrder(order._id)}
                        className="shrink-0 border border-gray-200 hover:border-orange-400 hover:text-orange-600 px-5 py-3 rounded-xl font-semibold transition"
                      >
                        {isExpanded
                          ? "Hide Details ↑"
                          : "View Details ↓"}
                      </button>
                    </div>
                  </div>

                  {/* ======================================
                      EXPANDED DETAILS
                  ====================================== */}

                  {isExpanded && (
                    <div className="border-t border-gray-100">

                      {/* DELIVERY */}
                      <div className="p-5 md:p-7 bg-gray-50/70">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              Expected Delivery
                            </p>

                            <p className="text-lg font-bold text-green-600 mt-1">
                              🚚 {getDeliveryDate(order.createdAt)}
                            </p>
                          </div>

                          <div className="text-left md:text-right">
                            <p className="text-sm text-gray-500">
                              Payment
                            </p>

                            <p className="font-bold text-gray-900 mt-1">
                              {order.paymentMethod}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* TRACKING */}
                      {status !== "cancelled" && (
                        <div className="px-5 md:px-7 py-7 border-b border-gray-100">
                          <div className="flex items-center justify-between mb-7">
                            <div>
                              <h3 className="text-lg font-bold text-gray-900">
                                Order Tracking
                              </h3>

                              <p className="text-sm text-gray-500 mt-1">
                                Current status:{" "}
                                <span className="font-semibold text-gray-900">
                                  {order.status}
                                </span>
                              </p>
                            </div>

                            <button
                              onClick={() => handleTrackOrder(order)}
                              className="text-orange-600 hover:text-orange-700 font-semibold"
                            >
                              Track Order →
                            </button>
                          </div>

                          {/* DESKTOP TIMELINE */}
                          <div className="hidden md:flex items-start relative">

                            {/* LINE */}
                            <div className="absolute top-5 left-[7%] right-[7%] h-1 bg-gray-200 rounded-full" />

                            <div
                              className="absolute top-5 left-[7%] h-1 bg-orange-500 rounded-full transition-all"
                              style={{
                                width: `${Math.min(
                                  trackingIndex / 3,
                                  1
                                ) * 86}%`,
                              }}
                            />

                            {trackingSteps.map((step, index) => {
                              const completed =
                                index <= trackingIndex;

                              return (
                                <div
                                  key={step.key}
                                  className="relative z-10 flex-1 text-center"
                                >
                                  <div
                                    className={`mx-auto w-11 h-11 rounded-full border-4 flex items-center justify-center text-sm ${
                                      completed
                                        ? "bg-orange-500 border-orange-500 text-white"
                                        : "bg-white border-gray-200 text-gray-400"
                                    }`}
                                  >
                                    {step.icon}
                                  </div>

                                  <p
                                    className={`mt-3 text-sm font-semibold ${
                                      completed
                                        ? "text-gray-900"
                                        : "text-gray-400"
                                    }`}
                                  >
                                    {step.label}
                                  </p>
                                </div>
                              );
                            })}
                          </div>

                          {/* MOBILE TIMELINE */}
                          <div className="md:hidden space-y-4">
                            {trackingSteps.map((step, index) => {
                              const completed =
                                index <= trackingIndex;

                              return (
                                <div
                                  key={step.key}
                                  className="flex items-center gap-4"
                                >
                                  <div
                                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                      completed
                                        ? "bg-orange-500 border-orange-500 text-white"
                                        : "bg-white border-gray-200 text-gray-400"
                                    }`}
                                  >
                                    {step.icon}
                                  </div>

                                  <div>
                                    <p
                                      className={`font-semibold ${
                                        completed
                                          ? "text-gray-900"
                                          : "text-gray-400"
                                      }`}
                                    >
                                      {step.label}
                                    </p>

                                    {index === trackingIndex && (
                                      <p className="text-xs text-orange-600 mt-1">
                                        Current status
                                      </p>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* CANCELLED MESSAGE */}
                      {status === "cancelled" && (
                        <div className="px-5 md:px-7 py-5 bg-red-50 border-b border-red-100">
                          <p className="text-red-700 font-semibold">
                            ✕ This order has been cancelled.
                          </p>
                        </div>
                      )}

                      {/* ORDERED ITEMS */}
                      <div className="p-5 md:p-7">
                        <div className="flex items-center justify-between mb-5">
                          <h3 className="text-xl font-bold text-gray-900">
                            Ordered Items
                          </h3>

                          <span className="text-sm text-gray-500">
                            {order.items.length}{" "}
                            {order.items.length === 1
                              ? "item"
                              : "items"}
                          </span>
                        </div>

                        <div className="space-y-4">
                          {order.items.map((item) => (
                            <div
                              key={item._id || item.id}
                              className="bg-gray-50 rounded-2xl p-4 md:p-5"
                            >
                              <div className="flex flex-col sm:flex-row gap-4">

                                {/* IMAGE */}
                                <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-xl overflow-hidden border border-gray-100 shrink-0">
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

                                {/* DETAILS */}
                                <div className="flex-1">
                                  <h4 className="font-bold text-gray-900 text-lg">
                                    {item.name}
                                  </h4>

                                  <p className="text-gray-500 mt-1">
                                    ₹
                                    {item.price.toLocaleString(
                                      "en-IN"
                                    )}{" "}
                                    × {item.quantity}
                                  </p>

                                  <p className="text-orange-600 font-bold mt-2">
                                    Item Total: ₹
                                    {(
                                      item.price * item.quantity
                                    ).toLocaleString("en-IN")}
                                  </p>
                                </div>

                                {/* DELIVERED ITEM ACTION */}
                                {status === "delivered" && (
                                  <div className="flex items-center">
                                    <button
                                      onClick={() =>
                                        setIssueModal({
                                          order,
                                          item,
                                        })
                                      }
                                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-semibold transition"
                                    >
                                      Report an Issue
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* ADDRESS + PAYMENT */}
                      <div className="px-5 md:px-7 pb-7">
                        <div className="grid md:grid-cols-2 gap-5">

                          {/* ADDRESS */}
                          <div className="bg-gray-50 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                              <span className="text-2xl">📍</span>

                              <h3 className="font-bold text-gray-900">
                                Delivery Address
                              </h3>
                            </div>

                            <p className="text-gray-600">
                              {order.deliveryAddress.address}
                            </p>

                            <p className="text-gray-600">
                              {order.deliveryAddress.city},{" "}
                              {order.deliveryAddress.state}
                            </p>

                            <p className="text-gray-600">
                              Pincode:{" "}
                              {order.deliveryAddress.pincode}
                            </p>
                          </div>

                          {/* PAYMENT */}
                          <div className="bg-gray-50 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                              <span className="text-2xl">💳</span>

                              <h3 className="font-bold text-gray-900">
                                Payment
                              </h3>
                            </div>

                            <p className="text-sm text-gray-500">
                              Payment Method
                            </p>

                            <p className="font-bold text-gray-900 mt-1">
                              {order.paymentMethod}
                            </p>
                          </div>
                        </div>

                        {/* PRICE */}
                        <div className="mt-5 bg-orange-50 rounded-2xl p-6">
                          <div className="flex justify-between text-gray-600 mb-3">
                            <span>Subtotal</span>

                            <span>
                              ₹
                              {order.subtotal.toLocaleString(
                                "en-IN"
                              )}
                            </span>
                          </div>

                          <div className="flex justify-between text-gray-600 mb-4">
                            <span>Delivery</span>

                            <span>
                              ₹
                              {order.delivery.toLocaleString(
                                "en-IN"
                              )}
                            </span>
                          </div>

                          <div className="border-t border-orange-200 pt-5 flex justify-between items-center">
                            <span className="text-xl font-bold text-gray-900">
                              Total Amount
                            </span>

                            <span className="text-2xl font-bold text-orange-600">
                              ₹
                              {order.total.toLocaleString(
                                "en-IN"
                              )}
                            </span>
                          </div>
                        </div>

                        {/* ACTION BUTTONS */}
                        <div className="mt-6 flex flex-col sm:flex-row sm:justify-end gap-3">

                          {/* PLACED */}
                          {status === "placed" && (
                            <>
                              <button
                                onClick={() =>
                                  handleCancelOrder(order)
                                }
                                className="px-6 py-3 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-semibold transition"
                              >
                                ✕ Cancel Order
                              </button>

                              <button
                                onClick={() =>
                                  handleTrackOrder(order)
                                }
                                className="px-6 py-3 rounded-xl border border-orange-500 text-orange-600 hover:bg-orange-50 font-semibold transition"
                              >
                                🚚 Track Order
                              </button>
                            </>
                          )}

                          {/* SHIPPED */}
                          {status === "shipped" && (
                            <button
                              onClick={() =>
                                handleTrackOrder(order)
                              }
                              className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold transition"
                            >
                              🚚 Track Order
                            </button>
                          )}

                          {/* DELIVERED */}
                          {status === "delivered" && (
                            <>
                              <button
                                onClick={() =>
                                  handleBuyAgain(order)
                                }
                                className="px-6 py-3 rounded-xl border border-orange-500 text-orange-600 hover:bg-orange-50 font-semibold transition"
                              >
                                🛒 Buy Again
                              </button>

                              <button
                                onClick={() => {
                                  const firstItem =
                                    order.items[0];

                                  if (firstItem) {
                                    setIssueModal({
                                      order,
                                      item: firstItem,
                                    });
                                  }
                                }}
                                className="px-6 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition"
                              >
                                ⚠ Report an Issue
                              </button>
                            </>
                          )}

                          {/* CANCELLED */}
                          {status === "cancelled" && (
                            <button
                              onClick={() =>
                                toggleOrder(order._id)
                              }
                              className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold transition"
                            >
                              View Details ↑
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ================================================
          REPORT ISSUE MODAL
      ================================================= */}

      {issueModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl">

            {/* MODAL HEADER */}
            <div className="p-6 md:p-7 border-b border-gray-100">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Report an Issue
                  </h2>

                  <p className="text-gray-500 mt-1">
                    What went wrong with your item?
                  </p>
                </div>

                <button
                  onClick={() => {
                    setIssueModal(null);
                    setSelectedIssue("");
                  }}
                  className="text-gray-400 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            {/* ITEM */}
            <div className="p-6 md:p-7">

              <div className="flex items-center gap-4 bg-gray-50 rounded-2xl p-4 mb-6">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shrink-0">
                  {issueModal.item.image ? (
                    <img
                      src={issueModal.item.image}
                      alt={issueModal.item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">
                      🍬
                    </div>
                  )}
                </div>

                <div>
                  <p className="font-bold text-gray-900">
                    {issueModal.item.name}
                  </p>

                  <p className="text-sm text-gray-500">
                    Order #{issueModal.order._id}
                  </p>
                </div>
              </div>

              {/* ISSUE OPTIONS */}
              <div className="space-y-3">
                {(
                  [
                    "Damaged Item",
                    "Wrong Item",
                    "Missing Item",
                    "Quality Issue",
                  ] as IssueType[]
                ).map((issue) => {
                  const selected = selectedIssue === issue;

                  return (
                    <button
                      key={issue}
                      onClick={() => setSelectedIssue(issue)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition ${
                        selected
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 hover:border-orange-300"
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selected
                            ? "border-orange-500"
                            : "border-gray-300"
                        }`}
                      >
                        {selected && (
                          <span className="w-2.5 h-2.5 bg-orange-500 rounded-full" />
                        )}
                      </span>

                      <span
                        className={`font-semibold ${
                          selected
                            ? "text-orange-700"
                            : "text-gray-700"
                        }`}
                      >
                        {issue}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* MODAL ACTIONS */}
              <div className="flex flex-col sm:flex-row gap-3 mt-7">
                <button
                  onClick={() => {
                    setIssueModal(null);
                    setSelectedIssue("");
                  }}
                  className="flex-1 px-5 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  disabled={!selectedIssue}
                  onClick={handleSubmitIssue}
                  className={`flex-1 px-5 py-3 rounded-xl font-semibold transition ${
                    selectedIssue
                      ? "bg-orange-500 hover:bg-orange-600 text-white"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Submit Issue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;