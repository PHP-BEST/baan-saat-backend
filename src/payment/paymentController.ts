import { Request, Response } from 'express';
import {
  createAccountSessionRepo,
  createPaymentIntentRepo,
  retrievePaymentStatusRepo,
} from './paymentRepo';
import Post from '../models/Post';
import User from '../models/User';
import PostPayment from '../models/PostPayment';

export const createAccountSession = async (req: Request, res: Response) => {
  const connectId = (req.user as any).connectId;
  try {
    const accountSession = await createAccountSessionRepo(connectId);
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
};

export const getPaymentIntentSecret = async (req: Request, res: Response) => {
  const { postId } = req.params;

  const postPayment = await PostPayment.findOne({ postId: postId });
  if (!postPayment) {
    return res.status(404).send('Post payment detail not found!');
  }

  return res.json({
    client_secret: postPayment.paymentSecret,
  });
};

export const createPaymentIntent = async (req: Request, res: Response) => {
  const { postId, providerId, amount } = req.body;

  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).send('Post not found!');
  }

  const provider = await User.findById(providerId);
  if (!provider) {
    return res.status(404).send('Provider not found!');
  }

  const connectId = provider.connectId;
  const paymentIntent = await createPaymentIntentRepo(amount, connectId);

  try {
    const postPayment = new PostPayment({
      postId: postId,
      providerId: providerId,
      paymentId: paymentIntent.id,
      paymentSecret: paymentIntent.client_secret || '',
      paymentStatus: 'pending',
    });
    await postPayment.save();
  } catch (err) {
    console.error('Failed to create PostPayment', err);
    return res.status(500).send('Failed to save payment record');
  }

  return res.json({
    client_secret: paymentIntent.client_secret,
  });
};

export const getPaymentStatus = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const postPayment = await PostPayment.findOne({ postId: postId });

  if (!postPayment) {
    return res.status(404).send('Post not found!');
  }

  if (postPayment.paymentStatus === 'succeeded') {
    return res.json({ status: 'succeeded' });
  }

  const provider = await User.findById(postPayment.providerId);
  if (!provider) {
    return res.status(404).send('Provider not found!');
  }

  const newStatus = await retrievePaymentStatusRepo(
    postPayment.paymentId,
    provider.connectId,
  );

  if (newStatus === 'processing' || newStatus === 'succeeded') {
    postPayment.paymentStatus = newStatus;
    await postPayment.save();
    return res.json({ status: newStatus });
  }

  return res.json({ status: 'pending' });
};
