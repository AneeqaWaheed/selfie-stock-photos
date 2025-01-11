import paypal from "../config/paypal.js";
import Stripe from "stripe";
import bucket from "../firebase.js";
import Image from "../models/imageModel.js";
import userModel from "../models/userModel.js";
import Sharp from "sharp";
import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";
import Order from "../models/orderModel.js";
import orderModel from "../models/orderModel.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Create Payment
export const createPayment = (req, res) => {
  const create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: "http://localhost:5000/api/payment/success",
      cancel_url: "http://localhost:5000/api/payment/cancel",
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
// Your executePayment function
export const executePayment = (req, res) => {
  // Log for debugging
  console.log("Received PayerID:", payerId);
  console.log("Received PaymentID:", paymentId);
};

// Payment Success Handler
export const paymentSuccess = async (req, res) => {
  try {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    const filename = req.query.filename; // Image filename
    const width = req.query.width;
    const height = req.query.height;

    const execute_payment_json = {
      payer_id: payerId,
      transactions: [
        {
          amount: { currency: "USD", total: "25.00" },
        },
      ],
    };

    // Execute the PayPal payment
    paypal.payment.execute(
      paymentId,
      execute_payment_json,
      async (error, payment) => {
        if (error) {
          console.error("Payment execution failed:", error.response);
          return res.status(500).json({ error: "Payment execution failed" });
        }

        console.log("Payment successful:", payment);

        // Create order details
        const orderData = {
          user: req.userId, // Assuming user ID is available in request
          dimensions: { width, height },
          price: 25,
          paymentMethod: "paypal",
          paymentId: paymentId,
          image: filename,
        };

        // Save order to the database
        const newOrder = new orderModel(orderData);
        await newOrder.save();
        console.log("Order created successfully!");

        // Construct the path to the local image
        const localFilePath = path.join(
          __dirname,
          "..",
          "uploads",
          "userPosts",
          filename
        );
        console.log(`Looking for image at: ${localFilePath}`);

        // Check if the image exists
        if (!fs.existsSync(localFilePath)) {
          console.error(`File not found at: ${localFilePath}`);
          return res
            .status(404)
            .json({ message: "Image not found in local storage" });
        }

        // Read the image file
        const readStream = fs.createReadStream(localFilePath);
        const chunks = [];

        readStream.on("data", (chunk) => chunks.push(chunk));

        readStream.on("error", (error) => {
          console.error("Error reading image:", error);
          return res.status(500).json({
            message: "Error reading image stream",
            error: error.message,
          });
        });

        readStream.on("end", async () => {
          if (chunks.length === 0) {
            console.error("No data received from stream");
            return res.status(500).json({ message: "Input buffer is empty" });
          }

          const buffer = Buffer.concat(chunks);

          try {
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
              await file.makePublic();
              const firebaseURL = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
              console.log(`Image uploaded to Firebase: ${firebaseURL}`);

              // Process the image with Sharp (resize if needed)
              let transformer = Sharp(buffer).toFormat("jpeg");
              if (width && height) {
                const parsedWidth = parseInt(width, 10);
                const parsedHeight = parseInt(height, 10);

                if (isNaN(parsedWidth) || isNaN(parsedHeight)) {
                  return res.status(400).json({
                    message: "Width and height must be valid numbers",
                  });
                }
                transformer = transformer.resize(parsedWidth, parsedHeight);
              }

              const transformedImage = await transformer.toBuffer();
              res.setHeader("Content-Type", "image/jpeg");
              res.send(transformedImage);
              console.log("Image downloaded successfully!");
              await userModel.findByIdAndUpdate(req.userId, {
                $inc: { downloads: 1 },
              });
            });

            stream.end(buffer);
          } catch (error) {
            console.error("Image processing error:", error);
            return res.status(500).json({
              message: "Error processing image",
              error: error.message,
            });
          }
        });
      }
    );
  } catch (error) {
    console.error("Payment success handler error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
// Payment Cancel Handler
export const paymentCancel = (req, res) => {
  res.json({ message: "Payment was cancelled" });
};

export const createCheckoutSession = async (req, res) => {
  try {
    const { filename, width, height } = req.query;
    console.log("mfnkalhdskjakfhskd", filename, width, height);
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // Convert price to cents for Stripe
    const amountInCents = 2500;

    // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents, // Amount in cents
      currency: "usd",
      payment_method_types: ["card"],
      description: `Image with dimensions ${width}x${height}`,
      metadata: {
        filename,
        width,
        height,
        name: req.body.name,
        email: req.body.email,
      },
      setup_future_usage: "off_session",
    });

    // Optionally, save order details in your database
    const orderData = {
      user: req.userId,
      dimensions: { width, height },
      price: 25,
      paymentMethod: "card",
      image: filename,
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret, // Send client_secret to the mobile app
    });
  } catch (error) {
    console.error("Error creating PaymentIntent:", error);
    res.status(500).json({
      success: false,
      message: "Error creating PaymentIntent",
      error: error.message,
    });
  }
};

export const downloadImageAfterPayment = async (req, res) => {
  try {
    const { filename, width, height } = req.query;
    console.log("mngamgbn", filename, width, height);
    const localFilePath = path.join(__dirname, "..", "uploads", filename);

    if (!fs.existsSync(localFilePath)) {
      console.error(`File not found at: ${localFilePath}`);
      return res.status(404).json({ message: "Image not found" });
    }

    const buffer = fs.readFileSync(localFilePath);

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

    const transformedImage = await transformer.toBuffer();

    const firebaseFileName = `${filename}`;
    const file = bucket.file(`uploads/${firebaseFileName}`);
    const stream = file.createWriteStream({
      metadata: { contentType: "image/jpeg" },
    });

    stream.on("finish", async () => {
      await file.makePublic();
      const firebaseURL = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
      res.status(200).json({
        message: "Image processed successfully",
        firebaseURL,
      });
      // res.setHeader("Content-Type", "image/jpeg");
      // res.send(transformedImage);
      console.log("Image downloaded and uploaded to Firebase:", firebaseURL);
    });
    await userModel.findByIdAndUpdate(req.userId, {
      $inc: { downloads: 1 },
    });
    stream.end(buffer);
  } catch (error) {
    console.error("Error downloading image:", error);
    res.status(500).json({
      message: "Error processing image",
      error: error.message,
    });
  }
};
