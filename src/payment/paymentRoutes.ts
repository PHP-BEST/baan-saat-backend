import { Router } from 'express';
import * as p from './paymentController';

const paymentRouter = Router();

// Create account session
paymentRouter.post('/account-session', p.createAccountSession);

// Get payment intent secret by post's id
paymentRouter.get('/payment-intent/:postId', p.getPaymentIntentSecret);

// Create payment intent
paymentRouter.post('/payment-intent', p.createPaymentIntent);

// Retrieve payment status by post's id
paymentRouter.put('/status/:postId', p.getPaymentStatus);

export default paymentRouter;
