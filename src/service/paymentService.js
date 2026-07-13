import Stripe from "stripe";
import env from "#env";
import { createOrder, updateOrderStatus } from "../repository/orderRepository.js";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async ({
  items,
  shipping,
  subtotal,
  deliveryFee,
  total,
}) => {
  if (!items || items.length === 0) {
    const error = new Error("No items provided");
    error.statusCode = 400;
    throw error;
  }

  console.log("Items received:");
  console.log(JSON.stringify(items, null, 2));

  // Convert frontend items to match the Order schema
  const orderItems = items.map((item) => ({
    productId: item.id,
    name: item.name,
    img: item.img,
    price: item.price,
    size: item.size,
    color: item.color,
    quantity: item.quantity,
  }));

  const amountInCents = Math.round(total * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: "usd",
    payment_method_types: ["card"],
    metadata: {
      itemCount: String(orderItems.length),
    },
  });

  const order = await createOrder({
    items: orderItems,
    shipping,
    subtotal,
    deliveryFee,
    total,
    stripePaymentIntentId: paymentIntent.id,
    status: "pending",
  });

  return {
    clientSecret: paymentIntent.client_secret,
    orderId: order._id,
  };
};

export const confirmOrderPayment = async (orderId) => {
  const order = await updateOrderStatus(orderId, "paid");

  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  return order;
};

// import Stripe from "stripe";
// import env from "#env";
// import { createOrder, updateOrderStatus } from "../repository/orderRepository.js";

// const stripe = new Stripe(env.STRIPE_SECRET_KEY);

// export const createPaymentIntent = async ({ items, shipping, subtotal, deliveryFee, total }) => {
//   if (!items || items.length === 0) {
//     const error = new Error("No items provided");
//     error.statusCode = 400;
//     throw error;
//   }

//   console.log("Items received:");
//   console.log(JSON.stringify(items, null, 2));

//   const amountInCents = Math.round(total * 100);

//   const paymentIntent = await stripe.paymentIntents.create({
//     amount: amountInCents,
//     currency: "usd",
//     payment_method_types: ["card"],
//     metadata: { itemCount: String(items.length) },
//   });

//   const order = await createOrder({
//     items,
//     shipping,
//     subtotal,
//     deliveryFee,
//     total,
//     stripePaymentIntentId: paymentIntent.id,
//     status: "pending",
//   });

//   return {
//     clientSecret: paymentIntent.client_secret,
//     orderId: order._id,
//   };
// };

// export const confirmOrderPayment = async (orderId) => {
//   const order = await updateOrderStatus(orderId, "paid");
//   if (!order) {
//     const error = new Error("Order not found");
//     error.statusCode = 404;
//     throw error;
//   }
//   return order;
// };

