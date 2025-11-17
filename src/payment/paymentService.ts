import Post from '../models/Post';
import User from '../models/User';
import PostPayment from '../models/PostPayment';
import { createPaymentIntentRepo } from './paymentRepo';

interface CreatePaymentIntentInput {
  postId: string;
  providerId: string;
  amount: number;
}

export const createPaymentIntentService = async (
  data: CreatePaymentIntentInput,
) => {
  const { postId, providerId, amount } = data;

  const post = await Post.findById(postId);
  if (!post) {
    throw new Error('Post not found!');
  }

  const provider = await User.findById(providerId);
  if (!provider) {
    throw new Error('Provider not found!');
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
    throw new Error('Failed to save payment record');
  }

  return {
    client_secret: paymentIntent.client_secret,
  };
};
