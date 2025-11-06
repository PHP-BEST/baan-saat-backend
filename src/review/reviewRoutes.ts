import express from 'express';
import * as reviewController from './reviewController';
const reviewRouter = express.Router();

// Get all reviews
reviewRouter.get('/', reviewController.getReviews);
// Get a review by ID
reviewRouter.get('/:id', reviewController.getReviewById);
// Get reviews by Provider ID
reviewRouter.get('/provider/:providerId', reviewController.getReviewsByProviderId);
// Create a new review
reviewRouter.post('/', reviewController.createReview);

export default reviewRouter;