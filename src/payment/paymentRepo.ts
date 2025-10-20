import Stripe from 'stripe';
import { stripeSecretKey } from '../configs';

const stripe = new Stripe(stripeSecretKey);

export const createConnectAccountRepo = async () => {
  const account = await stripe.accounts.create({
    country: 'TH',
    controller: {
      stripe_dashboard: {
        type: 'none',
      },
    },
    capabilities: {
      card_payments: {
        requested: true,
      },
      promptpay_payments: {
        requested: true,
      },
      transfers: {
        requested: true,
      },
    },
  });

  return account.id;
};

export const prefillAccountRepo = async (connectId: string) => {
  await stripe.accounts.update(connectId, {
    business_type: 'company',
    capabilities: {
      card_payments: {
        requested: true,
      },
      promptpay_payments: {
        requested: true,
      },
      transfers: {
        requested: true,
      },
    },
  });
};

export const createAccountSessionRepo = async (connectId: string) => {
  const accountSession = await stripe.accountSessions.create({
    account: connectId,
    components: {
      account_onboarding: {
        enabled: true,
        features: {
          external_account_collection: true,
        },
      },
      account_management: {
        enabled: true,
        features: {
          external_account_collection: true,
        },
      },
      notification_banner: {
        enabled: true,
        features: {
          external_account_collection: true,
        },
      },
      payments: {
        enabled: true,
        features: {
          refund_management: true,
          dispute_management: true,
          capture_payments: true,
        },
      },
      payouts: {
        enabled: true,
        features: {
          instant_payouts: true,
          standard_payouts: true,
          edit_payout_schedule: true,
          external_account_collection: true,
        },
      },
    },
  });

  return accountSession;
};

export const createPaymentIntentRepo = async (
  amount: number,
  connectId: string,
) => {
  if (amount < 1000) {
    amount = 1000;
  }
  const paymentIntent = await stripe.paymentIntents.create(
    {
      amount: amount,
      currency: 'thb',
      automatic_payment_methods: {
        enabled: true,
      },
      // application_fee_amount: 100,
    },
    {
      stripeAccount: connectId,
    },
  );

  return paymentIntent;
};

export const retrievePaymentStatusRepo = async (
  paymentId: string,
  connectId: string,
) => {
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentId, {
    stripeAccount: connectId,
  });

  return paymentIntent.status;
};
