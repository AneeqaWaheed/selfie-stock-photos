import express from "express";
import { handlePurchase } from "../controllers/notificationController";
import {
  confirmDownloadAndProcessImage,
  purchaseImage,
} from "../controllers/paymentController";
import { requireSignIn } from "../middlewares/authMiddleware";
const router = express.Router();

// Define the purchase route
router.post("/purchase", handlePurchase);

export default router;
