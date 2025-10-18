import { Router, Request, Response } from 'express';
import {
  createAccountSession,
  createPaymentIntent,
  retrievePaymentStatus,
} from './paymentController';
import Post from '../models/Post';
import User from '../models/User';

const paymentRouter = Router();

// Create account session
paymentRouter.post('/account-session', async (req: Request, res: Response) => {
  const connectId = (req.user as any).connectId;
  try {
    const accountSession = await createAccountSession(connectId);
    res.json({
      client_secret: accountSession.client_secret,
    });
  } catch (error) {
    console.error(
      'An error occurred when calling the Stripe API to create an account session',
      error,
    );
    res.status(500).send((error as Error).message);
  }
});

// Create payment intent by post's id
paymentRouter.post('/payment-intent', async (req: Request, res: Response) => {
  const { postId, providerId, amount } = req.body;

  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).send('Post not found!');
  }

  const provider = await User.findById(providerId);
  if (!provider || provider.role !== 'provider') {
    return res.status(404).send('Provider not found!');
  }

  const connectId = provider.connectId;
  const paymentIntent = await createPaymentIntent(amount, connectId);

  post.paymentId = paymentIntent.id;
  post.paymentSecret = paymentIntent.client_secret || '';
  post.paymentStatus = 'pending';
  await post.save();

  return res.json({
    client_secret: paymentIntent.client_secret,
  });
});

// Retrieve payment status by post's id
paymentRouter.put('/status/:postId', async (req: Request, res: Response) => {
  const { postId } = req.params;
  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).send('Post not found!');
  }

  if (post.paymentStatus === 'succeeded') {
    return res.json({ status: 'succeeded' });
  }

  const newStatus = await retrievePaymentStatus(post.paymentId);
  if (newStatus === 'processing' || newStatus === 'succeeded') {
    post.paymentStatus = newStatus;
    await post.save();
    return res.json({ status: newStatus });
  }

  return res.json({ status: 'pending' });
});

export default paymentRouter;
