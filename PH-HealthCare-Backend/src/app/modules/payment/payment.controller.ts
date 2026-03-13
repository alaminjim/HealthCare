/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { PaymentService } from "./payment.service";
import catchFn from "../../shared/catchFn";
import { envConfig } from "../../config/env";
import { StatusCodes } from "http-status-codes";
import { stripe } from "../../config/stripe.config";

const handleStripeWebhookEvent = catchFn(
  async (req: Request, res: Response) => {
    const signature = req.headers["stripe-signature"] as string;
    const webhookSecret = envConfig.STRIPE.STRIPE_WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
      console.error("Missing Stripe signature or webhook secret");
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Missing Stripe signature or webhook secret" });
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        webhookSecret,
      );
    } catch (error: any) {
      console.error("Error processing Stripe webhook:", error);
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Error processing Stripe webhook" });
    }

    try {
      const result = await PaymentService.handlerWebHook(event);

      res.json({
        httpStatusCode: StatusCodes.OK,
        success: true,
        message: "Stripe webhook event processed successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error handling Stripe webhook event:", error);
    }
  },
);

export const PaymentController = {
  handleStripeWebhookEvent,
};
