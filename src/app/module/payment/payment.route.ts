// /initiate-checkout

import { Router } from "express";
import { paymentController } from "./payment.controller";

const router = Router();

router.post(
  "/initiate-checkout/:assignmentId",
  paymentController.initiateCheckout,
);

export const PaymentRoute = router;
