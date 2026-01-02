# Stripe Integration Guide

This document explains how to integrate Stripe for payment processing in the Localo subscription system.

## Current Implementation

The subscription system is currently set up with a mock payment flow. The subscription context and UI are fully functional, but payment processing needs to be connected to Stripe.

## Installation

1. Install Stripe dependencies:
```bash
npm install @stripe/stripe-js
```

2. Set up environment variables in `.env.local`:
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

## Integration Steps

### 1. Create Stripe Checkout Session (Backend API Route)

Create `/src/app/api/create-checkout-session/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Localo Lifetime Access',
              description: 'One-time payment for lifetime access to all features',
            },
            unit_amount: 4999, // $49.99 in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/subscription?success=true`,
      cancel_url: `${req.headers.get('origin')}/subscription?canceled=true`,
      customer_email: email,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

### 2. Update Subscription Page

In `/src/app/subscription/page.tsx`, replace the `handlePurchase` function:

```typescript
const handlePurchase = async () => {
  setIsProcessing(true);
  setError("");

  try {
    // Create checkout session
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user?.email }),
    });

    const { sessionId, error } = await response.json();
    
    if (error) {
      setError(t("subscription.error.paymentFailed"));
      return;
    }

    // Load Stripe
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
    
    if (!stripe) {
      throw new Error('Stripe failed to load');
    }

    // Redirect to Stripe Checkout
    const { error: stripeError } = await stripe.redirectToCheckout({ sessionId });
    
    if (stripeError) {
      setError(stripeError.message);
    }
  } catch (err) {
    setError(t("subscription.error.paymentFailed"));
    console.error("Payment error:", err);
  } finally {
    setIsProcessing(false);
  }
};
```

### 3. Handle Payment Success Webhook

Create `/src/app/api/webhooks/stripe/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Update user subscription in your database
    // For localStorage-based system, you'll need to handle this differently
    // Consider moving to a proper database for production
    
    const customerEmail = session.customer_email;
    const paymentIntentId = session.payment_intent as string;
    
    // Update subscription status
    // This should be done in your backend/database
  }

  return NextResponse.json({ received: true });
}
```

### 4. Update Success Page

Update `/src/app/subscription/page.tsx` to handle success callback:

```typescript
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  if (params.get('success') === 'true') {
    // Payment was successful
    // Refresh subscription status
    refreshSubscription();
    // Show success message
  }
}, []);
```

## Testing

1. Use Stripe test cards: https://stripe.com/docs/testing
2. Test the complete flow:
   - Start trial
   - Purchase lifetime access
   - Verify subscription status
   - Check payment history

## Production Considerations

1. **Move to Database**: The current localStorage-based system should be migrated to a proper database for production
2. **Webhook Security**: Ensure webhook signatures are verified
3. **Error Handling**: Add comprehensive error handling and user feedback
4. **Email Notifications**: Send confirmation emails on successful payment
5. **Refund Handling**: Implement refund logic if needed

## PayPal Alternative

If you prefer PayPal, you can integrate PayPal Checkout similarly:

1. Install `@paypal/react-paypal-js`
2. Create PayPal order on backend
3. Handle PayPal webhooks for payment confirmation
4. Update subscription status accordingly

