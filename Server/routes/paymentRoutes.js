import express from "express";
import {
  confirmDownloadAndProcessImage,
  createPayment,
  paymentCancel,
  paymentSuccess,
  purchaseImage,
} from "../controllers/paymentController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route to create a payment
router.post("/pay", createPayment);

// Route for payment success
router.get("/success", paymentSuccess);

// Route for payment cancel
router.get("/cancel", paymentCancel);

router.get("/downloadImage", requireSignIn, purchaseImage);

// Route to confirm the payment and download the image
router.post("/confirmDownload", requireSignIn, confirmDownloadAndProcessImage);

export default router;
