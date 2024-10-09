import express from "express";
import {
  createPayment,
  paymentCancel,
  paymentSuccess,
} from "../controllers/paymentController.js";

const router = express.Router();

// Route to create a payment
router.post("/pay", createPayment);

// Route for payment success
router.get("/success", paymentSuccess);

// Route for payment cancel
router.get("/cancel", paymentCancel);

export default router;
