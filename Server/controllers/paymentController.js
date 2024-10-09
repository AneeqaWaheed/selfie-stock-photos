import paypal from "paypal-rest-sdk";

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
