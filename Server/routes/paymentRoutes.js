import express from "express";
import {
  createCheckoutSession,
  createPayment,
  // downloadImage,
  downloadImageAfterPayment,
  executePayment,
  paymentCancel,
  paymentSuccess,
} from "../controllers/paymentController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import { verifyToken } from "../controllers/ImageController.js";

const router = express.Router();

// Route to create a payment
router.post("/pay", createPayment);

// Route for payment success
router.get("/success", verifyToken, paymentSuccess);
// router.get("/success", executePayment);

// Route for payment cancel
router.get("/cancel", paymentCancel);

// router.post("/downloadImage", verifyToken, downloadImage);
router.get("/create-session", verifyToken, createCheckoutSession);
router.get("/checkout-success", downloadImageAfterPayment);

// Route to confirm the payment and download the image
// router.post("/confirmDownload", requireSignIn, confirmDownloadAndProcessImage);

export default router;
