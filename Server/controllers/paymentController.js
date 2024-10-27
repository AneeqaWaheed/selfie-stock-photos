import paypal from "paypal-rest-sdk";
import Stripe from "stripe";
import bucket from "../firebase.js";
import Image from "../models/imageModel.js";
import userModel from "../models/userModel.js";
import Sharp from "sharp";
import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";
import Order from "../models/orderModel.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const stripe = new Stripe(
  "sk_test_51PEJfu01DpWcWRP02CRkF0fD0GjRmOuzQplm8I2k6CEV2pUIb5E1BR06m27Qel2qaCYnII1F7E2afFUBn6N1fTIy00C1rMlpou"
); // Replace with your actual Stripe secret key

// Create Payment
export const createPayment = (req, res) => {
  const create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: "http://localhost:3000/payment/success",
      cancel_url: "http://localhost:3000/payment/cancel",
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: "Item Name",
              sku: "001",
              price: "25.00",
              currency: "USD",
              quantity: 1,
            },
          ],
        },
        amount: {
          currency: "USD",
          total: "25.00",
        },
        description: "Payment for items",
      },
    ],
  };

  paypal.payment.create(create_payment_json, (error, payment) => {
    if (error) {
      console.log(error);
      res.status(500).json({ error: "Payment creation failed" });
    } else {
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === "approval_url") {
          res.json({ forwardLink: payment.links[i].href });
        }
      }
    }
  });
};

// Payment Success Handler
export const paymentSuccess = (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const execute_payment_json = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: "USD",
          total: "25.00",
        },
      },
    ],
  };

  paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
    if (error) {
      console.log(error.response);
      res.status(500).json({ error: "Payment execution failed" });
    } else {
      res.json({ message: "Payment successful", payment });
    }
  });
};

// Payment Cancel Handler
export const paymentCancel = (req, res) => {
  res.json({ message: "Payment was cancelled" });
};

export const purchaseImage = async (req, res) => {
  try {
    const { filename, width, height } = req.query;
    const userId = req.user.id; // Assuming user ID is available in req.user

    if (!filename) {
      return res.status(400).json({ message: "Filename is required" });
    }

    // Create a Payment Intent for the image download
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 2500, // Amount in cents, adjust according to your price
      currency: "usd", // Change to your desired currency
      metadata: { filename },
    });

    // Send the client secret to the client for payment confirmation
    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      message: "Payment initiated, please confirm the payment.",
      paymentIntentId: paymentIntent.id, // You can use this ID later for order creation
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return res
      .status(500)
      .json({ message: "Error creating payment intent", error: error.message });
  }
};

export const confirmDownloadAndProcessImage = async (req, res) => {
  try {
    const { paymentIntentId, filename, width, height } = req.body;

    // Confirm the payment using the Stripe API
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);

    // Check if payment was successful
    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({ message: "Payment was not successful." });
    }

    // Create a new order in the database
    const order = new Order({
      image: req.user.imageId, // Assume you have image ID from the request
      user: req.user._id, // Get user ID from the token
      dimensions: { width, height },
      price: 25, // Or use a dynamic value if needed
      paymentMethod: "card", // Assuming you are using card payment
      paymentStatus: "completed",
      paymentId: paymentIntent.id, // Store Stripe Payment Intent ID
    });

    await order.save();

    // If payment succeeded, proceed to download the image
    const localFilePath = path.join(
      __dirname,
      "..",
      "uploads",
      "userPosts",
      filename
    );

    console.log(`Looking for image at: ${localFilePath}`);

    // Check if the file exists in the local folder
    if (!fs.existsSync(localFilePath)) {
      console.error(`File does not exist at: ${localFilePath}`);
      return res
        .status(404)
        .json({ message: "Image not found in local storage" });
    }

    // Read the image from the local filesystem
    const readStream = fs.createReadStream(localFilePath);
    const chunks = [];

    readStream.on("data", (chunk) => {
      chunks.push(chunk);
      console.log(`Received chunk of size: ${chunk.length}`);
    });

    readStream.on("error", (error) => {
      console.error("Error reading stream:", error);
      return res
        .status(500)
        .json({ message: "Error reading image stream", error: error.message });
    });

    readStream.on("end", async () => {
      if (chunks.length === 0) {
        console.error("No data received from the stream");
        return res.status(500).json({ message: "Input Buffer is empty" });
      }

      const buffer = Buffer.concat(chunks);
      console.log(`Total buffer size: ${buffer.length}`);

      try {
        // Upload the image to Firebase Storage
        const firebaseFileName = `${filename}`;
        const file = bucket.file(`uploads/userPosts/${firebaseFileName}`);
        const stream = file.createWriteStream({
          metadata: { contentType: "image/jpeg" },
        });

        stream.on("error", (error) => {
          console.error("Upload error:", error);
          return res
            .status(500)
            .json({ message: "Image upload failed", error });
        });

        stream.on("finish", async () => {
          // Make the image publicly accessible
          await file.makePublic();
          const firebaseURL = `https://storage.googleapis.com/${bucket.name}/${file.name}`;

          // Optional: Use sharp to transform the image
          let transformer = Sharp(buffer).toFormat("jpeg");
          if (width && height) {
            const parsedWidth = parseInt(width, 10);
            const parsedHeight = parseInt(height, 10);
            if (isNaN(parsedWidth) || isNaN(parsedHeight)) {
              return res
                .status(400)
                .json({ message: "Width and height must be valid numbers" });
            }
            transformer = transformer.resize(parsedWidth, parsedHeight);
          }

          // Transform the image and send the response
          const transformedImage = await transformer.toBuffer();
          res.setHeader("Content-Type", "image/jpeg");
          res.send(transformedImage);
        });

        // End the stream with the image buffer
        stream.end(buffer);
      } catch (error) {
        console.error("Error processing image:", error);
        return res
          .status(500)
          .json({ message: "Error processing image", error: error.message });
      }
    });
  } catch (error) {
    console.error("Error processing payment and downloading image:", error);
    return res.status(500).json({
      message: "Error processing payment and downloading image",
      error: error.message,
    });
  }
};
