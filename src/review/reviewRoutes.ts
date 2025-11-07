import express from 'express';
import * as reviewController from './reviewController';
const reviewRouter = express.Router();

// Get all reviews
reviewRouter.get('/', reviewController.getReviews);
// Get reviews by Provider ID  <-- move this before :id
reviewRouter.get('/provider/:providerId', reviewController.getReviewsByProviderId);
// Get a review by ID
reviewRouter.get('/:id', reviewController.getReviewById);
// Create a new review
reviewRouter.post('/', reviewController.createReview);
// delete a review by ID
reviewRouter.delete('/:id', reviewController.deleteReview);

export default reviewRouter;