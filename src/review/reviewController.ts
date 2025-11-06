import { Request, Response } from 'express';
import Post from '../models/Post';
import User from '../models/User';
import Review from '../models/Review';

//desc Get all reviews
//route GET /api/reviews
//access Public
export const getReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find();
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch reviews', error });
  } 
};

//desc Get a review by ID
//route GET /api/reviews/:id
//access Public
export const getReviewById = async (req: Request, res: Response) => {
  const { id } = req.params;
    try {
    const review = await Review.findById(id);
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: 'Review not found' });
    }
    res.status(200).json({ success: true, data: review });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch review', error });
  }
};

//desc Get reviews by Provider ID
//route GET /api/reviews/provider/:providerId
//access Public
export const getReviewsByProviderId = async (req: Request, res: Response) => {  
    const { providerId } = req.params;
    try {
    const reviews = await Review.find({ providerId });
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch reviews', error });
  }
};

//desc Create a new review
//route POST /api/reviews
//access Public
export const createReview = async (req: Request, res: Response) => {
  try {
    const { postId, providerId, customerId, description, rating } = req.body;
    const review = await Review.create(req.body);
    res.status(201).json({ success: true, data: review });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to create review', error });
  }
};

//desc Delete a review  
//route DELETE /api/reviews/:id
//access Public
export const deleteReview = async (req: Request, res: Response) => {
  const { id } = req.params;
    try {
    const review = await Review.findByIdAndDelete(id);
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: 'Review not found' });
    }
    res.status(200).json({ success: true, message: 'Review deleted' });
    } catch (error) {   
    res
      .status(500)
      .json({ success: false, message: 'Failed to delete review', error });
  }
};