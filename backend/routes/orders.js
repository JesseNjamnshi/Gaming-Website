const express = require("express");
const router = express.Router();

const orderController = require("../controllers/orderController");

// 🛒 CREATE ORDER
router.post("/", orderController.createOrder);

// 📄 RECEIPT (single order details)
router.get("/receipt/:id", orderController.getReceipt);

// 📜 PURCHASE HISTORY (NEW)
router.get("/history/:userId", orderController.getUserOrders);

// 💸 REQUEST REFUND (NEW - user action)
router.put("/request-refund/:id", orderController.requestRefund);

// 💰 APPROVE REFUND (admin / system)
router.put("/refund/:id", orderController.refundOrder);

// 🎮 USER LIBRARY
router.get("/library/:userId", orderController.getUserLibrary);

module.exports = router;