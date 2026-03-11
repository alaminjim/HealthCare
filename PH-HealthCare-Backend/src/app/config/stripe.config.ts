import Stripe from "stripe";
import { envConfig } from "./env";

export const stripe = new Stripe(envConfig.STRIPE.STRIPE_SECRET_KEY);
