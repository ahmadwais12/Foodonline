import { loadStripe, Stripe } from '@stripe/stripe-js';

// Make sure to add your Stripe publishable key to your .env file
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';

if (!STRIPE_PUBLISHABLE_KEY) {
  console.warn('Stripe publishable key is not set. Please add VITE_STRIPE_PUBLISHABLE_KEY to your .env file.');
}

let stripePromise: Promise<Stripe | null> | null = null;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};