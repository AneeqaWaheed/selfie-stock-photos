import Order from "../models/orderModel.js";
import Image from "../models/imageModel.js";
import paypal from "paypal-rest-sdk"; // Ensure PayPal SDK is configured

// Create Order for Image and trigger payment
export const createOrder = async (req, res) => {
  try {
    const { imageId } = req.body;

    // Fetch the image from the database
    const image = await Image.findById(imageId);

    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    // Create a new order using the image's dimensions and a fixed price of $25
    const newOrder = new Order({
      image: image._id, // Reference to the image
      user: req.user._id, // Assuming you have the authenticated user's ID
      dimensions: {
        width: image.width,
        height: image.height,
      },
      price: 25, // Fixed price
    });

    // Save the order to the database
    await newOrder.save();

    // Create a PayPal payment after the order is created
    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: `http://localhost:3000/payment/success?orderId=${newOrder._id}`,
        cancel_url: "http://localhost:3000/payment/cancel",
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: `Image Purchase - ${image.filename}`,
                sku: image._id.toString(),
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
          description: `Purchase of image with ID ${image._id}`,
        },
      ],
    };

    paypal.payment.create(create_payment_json, (error, payment) => {
      if (error) {
        console.error("PayPal Payment Error:", error);
        return res
          .status(500)
          .json({ error: "Failed to create PayPal payment" });
      }

      // Find PayPal approval URL and send it back to the client
      const approvalUrl = payment.links.find(
        (link) => link.rel === "approval_url"
      );
      if (approvalUrl) {
        return res
          .status(201)
          .json({ forwardLink: approvalUrl.href, order: newOrder });
      }
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};
