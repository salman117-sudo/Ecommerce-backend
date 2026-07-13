import { createPaymentIntent, confirmOrderPayment } from "../service/paymentService.js";

export const createIntentController = async (req, res) => {
  try {
    const result = await createPaymentIntent(req.body);
    res.json(result);
  } catch (error) {
    console.error("❌ create-intent error:", error); // ← add this
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const confirmPaymentController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await confirmOrderPayment(orderId);
    res.json(order);
  } catch (error) {
    console.error("❌ confirm-payment error:", error); // ← add this
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};