import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Post from '../models/Post';
import User from '../models/User';
import Review from '../models/Review';
import { MongoServerError } from 'mongodb';

//desc Get all reviews
//route GET /api/reviews
//access Public
export const getReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find().populate('post provider customer');
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch reviews' });
  }
};

//desc Get a review by ID
//route GET /api/reviews/:id
//access Public
export const getReviewById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res
      .status(400)
      .json({ success: false, message: 'Invalid review id' });
  }
  try {
    const review = await Review.findById(id).populate('post provider customer');
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: 'Review not found' });
    }
    res.status(200).json({ success: true, data: review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch review' });
  }
};

//desc Get reviews by Provider ID
//route GET /api/reviews/provider/:providerId
//access Public
export const getReviewsByProviderId = async (req: Request, res: Response) => {
  const { providerId } = req.params;
  if (!mongoose.isValidObjectId(providerId)) {
    return res
      .status(400)
      .json({ success: false, message: 'Invalid provider id' });
  }
  try {
    const reviews = await Review.find({ providerId }).populate(
      'post provider customer',
    );
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch reviews' });
  }
};

//desc Create a new review
//route POST /api/reviews
//access Public
export const createReview = async (req: Request, res: Response) => {
  try {
    const {
      postId,
      providerId,
      customerId,
      description = '',
      rating,
    } = req.body;

    if (!postId || !providerId || !customerId || rating === undefined) {
      return res.status(400).json({
        success: false,
        message: 'postId, providerId, customerId and rating are required',
      });
    }
    if (
      !mongoose.isValidObjectId(postId) ||
      !mongoose.isValidObjectId(providerId) ||
      !mongoose.isValidObjectId(customerId)
    ) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid id(s) provided' });
    }
    const numericRating = Number(rating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be a number between 1 and 5',
      });
    }

    const [postExists, providerExists, customerExists] = await Promise.all([
      Post.exists({ _id: postId }),
      User.exists({ _id: providerId }),
      User.exists({ _id: customerId }),
    ]);
    if (!postExists || !providerExists || !customerExists) {
      return res.status(400).json({
        success: false,
        message: 'Referenced post/provider/customer not found',
      });
    }

    const alreadyReviewed = await Review.exists({ postId, customerId });
    if (alreadyReviewed) {
      return res.status(409).json({
        success: false,
        message: 'You have already submitted a review for this post.',
      });
    }

    const review = await Review.create({
      postId,
      providerId,
      customerId,
      description,
      rating: numericRating,
    });
    await review.populate('post provider customer');
    res.status(201).json({ success: true, data: review });
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof MongoServerError && error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'You have already submitted a review for this post.',
      });
    }
    res
      .status(500)
      .json({ success: false, message: 'Failed to create review' });
  }
};

//desc Delete a review
//route DELETE /api/reviews/:id
//access Public
export const deleteReview = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res
      .status(400)
      .json({ success: false, message: 'Invalid review id' });
  }
  try {
    const review = await Review.findByIdAndDelete(id);
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: 'Review not found' });
    }
    res.status(200).json({ success: true, message: 'Review deleted' });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: 'Failed to delete review' });
  }
};
