import { Router } from "express";
import { createIntentController, confirmPaymentController } from "../controller/paymentController.js";

const router = Router();

router.post("/create-intent", createIntentController);
router.post("/confirm/:orderId", confirmPaymentController);

export default router;