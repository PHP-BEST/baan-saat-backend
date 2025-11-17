import { Request, Response } from 'express';
import {
  createAccountSessionRepo,
  retrievePaymentStatusRepo,
} from './paymentRepo';
import User from '../models/User';
import PostPayment from '../models/PostPayment';
import { createPaymentIntentService } from './paymentService';

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

export const getPaymentIntent = async (req: Request, res: Response) => {
  const postPayments = await PostPayment.find();

  return res.json({ postPayments: postPayments });
};

export const getPaymentIntentSecretById = async (
  req: Request,
  res: Response,
) => {
  const { postId } = req.params;

  const postPayment = await PostPayment.findOne({ postId: postId });
  if (!postPayment) {
    return res.status(404).send('Post payment detail not found!');
  }

  return res.json({
    client_secret: postPayment.paymentSecret,
  });
};

export const createPaymentIntentController = async (
  req: Request,
  res: Response,
) => {
  const { postId, providerId, amount } = req.body;

  // Validation
  if (!postId || !providerId || !amount) {
    return res
      .status(400)
      .send('Missing required fields: postId, providerId, or amount');
  }

  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).send('Invalid amount');
  }

  try {
    const result = await createPaymentIntentService({
      postId,
      providerId,
      amount,
    });

    return res.json(result);
  } catch (error) {
    const errorMessage = (error as Error).message;

    if (
      errorMessage === 'Post not found!' ||
      errorMessage === 'Provider not found!'
    ) {
      return res.status(404).send(errorMessage);
    }

    if (errorMessage === 'Failed to save payment record') {
      return res.status(500).send(errorMessage);
    }

    console.error('Unexpected error in createPaymentIntent:', error);
    return res.status(500).send('An unexpected error occurred');
  }
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
