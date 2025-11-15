import express from 'express';
import * as reviewController from './reviewController';
const reviewRouter = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Reviews
 *     description: Review management endpoints
 */

/**
 * @openapi
 * /api/reviews:
 *  get:
 *    summary: Get all reviews
 *    tags:
 *      - Reviews
 *    responses:
 *      200:
 *        description: Successfully retrieved all reviews
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: true
 *                data:
 *                  type: array
 *      500:
 *        description: Failed to fetch reviews
 */
reviewRouter.get('/', reviewController.getReviews);

/**
 * @openapi
 * /api/reviews/{id}:
 *  get:
 *    summary: Get a single review by ID
 *    tags:
 *      - Reviews
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Review ID
 *    responses:
 *      200:
 *        description: Successfully retrieved the review
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: true
 *                data:
 *      400:
 *        description: Invalid review ID
 *      404:
 *        description: Review not found
 *      500:
 *        description: Failed to fetch review
 */
reviewRouter.get(
  '/provider/:providerId',
  reviewController.getReviewsByProviderId,
);

/**
 * @openapi
 * /api/reviews/provider/{providerId}:
 *  get:
 *    summary: Get all reviews for a specific provider
 *    tags:
 *      - Reviews
 *    parameters:
 *      - in: path
 *        name: providerId
 *        schema:
 *          type: string
 *        required: true
 *        description: Provider ID
 *    responses:
 *      200:
 *        description: Successfully retrieved reviews for provider
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: true
 *                data:
 *                  type: array
 *      400:
 *        description: Invalid provider ID
 *      500:
 *        description: Failed to fetch reviews
 */
reviewRouter.get('/:id', reviewController.getReviewById);
/**
 * @openapi
 * /api/reviews:
 *  post:
 *    summary: Create a new review
 *    tags:
 *      - Reviews
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - postId
 *              - providerId
 *              - customerId
 *              - rating
 *            properties:
 *              postId:
 *                type: string
 *                example: "67314a6f21c4a8d084e87f9a"
 *              providerId:
 *                type: string
 *                example: "672ff4c8e56b44b302fb3de1"
 *              customerId:
 *                type: string
 *                example: "672ff4c8e56b44b302fb3de2"
 *              description:
 *                type: string
 *                example: "The service was excellent and fast!"
 *              rating:
 *                type: number
 *                minimum: 1
 *                maximum: 5
 *                example: 5
 *    responses:
 *      201:
 *        description: Review created successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: true
 *                data:
 *                  type: object
 *                  properties:
 *                    _id:
 *                      type: string
 *                      example: "673150d421c4a8d084e87faa"
 *                    postId:
 *                      type: string
 *                    providerId:
 *                      type: string
 *                    customerId:
 *                      type: string
 *                    description:
 *                      type: string
 *                    rating:
 *                      type: number
 *                    createdAt:
 *                      type: string
 *                      format: date-time
 *      400:
 *        description: Missing or invalid parameters
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: false
 *                message:
 *                  type: string
 *                  example: "postId, providerId, customerId and rating are required"
 *      500:
 *        description: Server error while creating review
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: false
 *                message:
 *                  type: string
 *                  example: "Failed to create review"
 */

reviewRouter.post('/', reviewController.createReview);
/**
 * @openapi
 * /api/reviews/{id}:
 *  delete:
 *    summary: Delete a review by ID
 *    tags:
 *      - Reviews
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Review ID
 *    responses:
 *      200:
 *        description: Review deleted successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: true
 *                message:
 *                  type: string
 *                  example: "Review deleted"
 *      400:
 *        description: Invalid review ID
 *      404:
 *        description: Review not found
 *      500:
 *        description: Failed to delete review
 */
reviewRouter.delete('/:id', reviewController.deleteReview);

export default reviewRouter;
