import { Router, Request, Response } from 'express';
import { createAccountSession, createPaymentIntent } from './paymentController';

const paymentRouter = Router();

paymentRouter.post('/session-secret', async (req: Request, res: Response) => {
  const connectId = (req.user as any).connectId;
  try {
    const accountSession = await createAccountSession(connectId);
    res.json({
      clientSecret: accountSession.client_secret,
    });
  } catch (error) {
    console.error(
      'An error occurred when calling the Stripe API to create an account session',
      error,
    );
    res.status(500).send((error as Error).message);
  }
});

paymentRouter.post('/payment-intent', async (req: Request, res: Response) => {
  const connectId = (req.user as any).connectId;
  const paymentIntent = await createPaymentIntent(req.body.amount, connectId);
  res.json({
    clientSecret: paymentIntent.client_secret,
  });
});

export default paymentRouter;
