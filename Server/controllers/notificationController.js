import axios from "axios";
import sendPushNotification from "../helpers/sendPushNotifiation.js";
// Controller function for purchase route
export const handlePurchase = async (req, res) => {
  const { sellerToken, imageId } = req.body;

  try {
    // Notify the seller about the purchase
    await sendPushNotification(
      sellerToken,
      `Your image with ID ${imageId} has been purchased!`
    );

    // Send response back to the client
    res.status(200).json({ message: "Purchase successful!" });
  } catch (error) {
    console.error("Error handling purchase:", error);
    res.status(500).json({ message: "An error occurred during the purchase." });
  }
};
