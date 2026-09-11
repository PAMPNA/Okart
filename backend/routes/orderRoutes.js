const express = require("express");
const crypto = require("crypto");
const Order = require("../models/Order");
const razorpay = require("../config/razorpay");

const router = express.Router();

// =====================================================
// CREATE A NEW ORDER
// =====================================================

router.post("/", async (req, res) => {
  try {
    const order = new Order(req.body);

    const savedOrder = await order.save();

    res.status(201).json({
      message: "Order created successfully",
      order: savedOrder,
    });
  } catch (error) {
    console.error("Order creation error:", error);

    res.status(500).json({
      message: "Failed to create order",
      error: error.message,
    });
  }
});

// =====================================================
// GET ORDER HISTORY BY CUSTOMER EMAIL
// =====================================================

router.get("/", async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const orders = await Order.find({
      "customer.email": email,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Orders fetched successfully",
      orders,
    });
  } catch (error) {
    console.error("Order fetching error:", error);

    res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
});

// =====================================================
// CREATE RAZORPAY PAYMENT ORDER
// =====================================================

router.post("/create-payment-order", async (req, res) => {
  try {
    const { amount } = req.body;

    // Validate amount
    if (
      amount === undefined ||
      amount === null ||
      Number.isNaN(Number(amount)) ||
      Number(amount) <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid amount is required",
      });
    }

    const amountInPaise = Math.round(Number(amount) * 100);

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    // Create order in Razorpay
    const razorpayOrder = await razorpay.orders.create(options);

    console.log(
      "Razorpay order created:",
      razorpayOrder.id
    );

    res.status(200).json({
      success: true,
      message: "Razorpay order created successfully",
      order: razorpayOrder,
    });
  } catch (error) {
    console.error(
      "Razorpay order creation error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to create Razorpay order",
      error: error.message,
    });
  }
});

// =====================================================
// VERIFY RAZORPAY PAYMENT
// =====================================================

router.post("/verify-payment", async (req, res) => {
  try {
    const {
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    // -------------------------------------------------
    // 1. Validate required fields
    // -------------------------------------------------

    if (
      !orderId ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Order ID and payment verification details are required",
      });
    }

    // -------------------------------------------------
    // 2. Check Razorpay secret
    // -------------------------------------------------

    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error(
        "RAZORPAY_KEY_SECRET is missing"
      );

      return res.status(500).json({
        success: false,
        message: "Payment configuration error",
      });
    }

    // -------------------------------------------------
    // 3. Find the existing O-Kart MongoDB order
    // -------------------------------------------------

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "O-Kart order not found",
      });
    }

    console.log(
      "O-Kart order found:",
      order._id.toString()
    );

    // -------------------------------------------------
    // 4. Duplicate payment protection
    // -------------------------------------------------

    if (
      order.paymentStatus === "Paid" &&
      order.razorpayPaymentId
    ) {
      return res.status(200).json({
        success: true,
        message: "Payment already verified",
        order,
      });
    }

    // -------------------------------------------------
    // 5. Verify Razorpay order exists
    // -------------------------------------------------

    let razorpayOrder;

    try {
      razorpayOrder =
        await razorpay.orders.fetch(
          razorpay_order_id
        );
    } catch (error) {
      console.error(
        "Unable to fetch Razorpay order:",
        error
      );

      return res.status(400).json({
        success: false,
        message: "Invalid Razorpay order",
      });
    }

    // -------------------------------------------------
    // 6. Make sure Razorpay order IDs match
    // -------------------------------------------------

    if (
      razorpayOrder.id !== razorpay_order_id
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Razorpay order ID mismatch",
      });
    }

    // -------------------------------------------------
    // 7. Generate Razorpay signature
    // -------------------------------------------------

    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");

    // -------------------------------------------------
    // 8. Compare signatures safely
    // -------------------------------------------------

    const generatedBuffer = Buffer.from(
      generatedSignature,
      "utf8"
    );

    const receivedBuffer = Buffer.from(
      razorpay_signature,
      "utf8"
    );

    if (
      generatedBuffer.length !==
        receivedBuffer.length ||
      !crypto.timingSafeEqual(
        generatedBuffer,
        receivedBuffer
      )
    ) {
      console.error(
        "Invalid Razorpay payment signature"
      );

      // Payment verification failed
      order.paymentStatus = "Failed";

      await order.save();

      return res.status(400).json({
        success: false,
        message:
          "Payment verification failed",
      });
    }

    // -------------------------------------------------
    // 9. PAYMENT VERIFIED SUCCESSFULLY
    // -------------------------------------------------

    console.log(
      "✅ Razorpay payment signature verified:",
      razorpay_payment_id
    );

    // -------------------------------------------------
    // 10. UPDATE MONGODB ORDER
    // -------------------------------------------------

    order.paymentStatus = "Paid";

    order.razorpayOrderId =
      razorpay_order_id;

    order.razorpayPaymentId =
      razorpay_payment_id;

    order.razorpaySignature =
      razorpay_signature;

    // Change order status from payment pending
    // to placed
    order.status = "Placed";

    const updatedOrder =
      await order.save();

    console.log(
      "✅ MongoDB payment status updated to Paid"
    );

    console.log(
      "Order ID:",
      updatedOrder._id.toString()
    );

    console.log(
      "Payment ID:",
      updatedOrder.razorpayPaymentId
    );

    // -------------------------------------------------
    // 11. SEND SUCCESS RESPONSE
    // -------------------------------------------------

    res.status(200).json({
      success: true,
      message:
        "Payment verified and order updated successfully",

      order: updatedOrder,

      payment: {
        razorpay_order_id:
          razorpay_order_id,

        razorpay_payment_id:
          razorpay_payment_id,
      },
    });
  } catch (error) {
    console.error(
      "Payment verification error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Payment verification failed",
      error: error.message,
    });
  }
});
// =====================================================
// MARK PAYMENT AS FAILED
// =====================================================

router.patch("/:orderId/payment-failed", async (req, res) => {
  try {
    const { orderId } = req.params;

    // -------------------------------------------------
    // 1. Find the O-Kart order
    // -------------------------------------------------

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "O-Kart order not found",
      });
    }

    // -------------------------------------------------
    // 2. Prevent changing an already-paid order
    // -------------------------------------------------

    if (order.paymentStatus === "Paid") {
      return res.status(400).json({
        success: false,
        message: "Paid order cannot be marked as failed",
      });
    }

    // -------------------------------------------------
    // 3. Mark payment as failed
    // -------------------------------------------------

    order.paymentStatus = "Failed";

    // Keep the order in a payment-related state
    // because payment was not completed.
    order.status = "Payment Failed";

    const updatedOrder = await order.save();

    console.log(
      "❌ MongoDB payment status updated to Failed"
    );

    console.log(
      "Order ID:",
      updatedOrder._id.toString()
    );

    // -------------------------------------------------
    // 4. Send response
    // -------------------------------------------------

    return res.status(200).json({
      success: true,
      message: "Payment marked as failed",
      order: updatedOrder,
    });
  } catch (error) {
    console.error(
      "Mark payment failed error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update payment status",
      error: error.message,
    });
  }
});



module.exports = router;