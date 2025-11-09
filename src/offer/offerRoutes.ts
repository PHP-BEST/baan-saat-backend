import express from 'express';
import * as o from './offerController';

const offerRouter = express.Router();

/**
 * @openapi
 * /api/offers:
 *   get:
 *     summary: Get all offers
 *     tags:
 *       - Offers
 *     responses:
 *       200:
 *         description: Returns a list of all offers
 *       500:
 *         description: Failed to fetch offers
 */
offerRouter.get('/', o.getOffers);

/**
 * @openapi
 * /api/offers/{id}:
 *   get:
 *     summary: Get an offer by ID
 *     tags:
 *       - Offers
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The offer ID
 *     responses:
 *       200:
 *         description: Returns the offer
 *       404:
 *         description: Offer not found
 *       500:
 *         description: Failed to fetch offer
 */
offerRouter.get('/:id', o.getOfferById);

/**
 * @openapi
 * /api/offers/{id}/detail:
 *   get:
 *     summary: Get detailed offer by ID
 *     tags:
 *       - Offers
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The offer ID
 *     responses:
 *       200:
 *         description: Returns a detailed offer
 *       500:
 *         description: Failed to fetch offer
 */
offerRouter.get('/:id/detail', o.getDetailedOfferById);

/**
 * @openapi
 * /api/offers/provider/{providerId}:
 *   get:
 *     summary: Get offers by Provider ID
 *     tags:
 *       - Offers
 *     parameters:
 *       - in: path
 *         name: providerId
 *         required: true
 *         schema:
 *           type: string
 *         description: The provider ID
 *     responses:
 *       200:
 *         description: Returns a list of offers for the provider
 *       500:
 *         description: Failed to fetch offers
 */
offerRouter.get('/provider/:providerId', o.getOffersByProviderId);

/**
 * @openapi
 * /api/offers/customer/{customerId}:
 *   get:
 *     summary: Get offers by Customer ID
 *     tags:
 *       - Offers
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *         description: The customer ID
 *     responses:
 *       200:
 *         description: Returns a list of offers for the customer
 *       500:
 *         description: Failed to fetch offers
 */
offerRouter.get('/customer/:customerId', o.getOffersByCustomerId);

/**
 * @openapi
 * /api/offers/provider/{providerId}/detail:
 *   get:
 *     summary: Get detailed offers by Provider ID
 *     tags:
 *       - Offers
 *     parameters:
 *       - in: path
 *         name: providerId
 *         required: true
 *         schema:
 *           type: string
 *         description: The provider ID
 *     responses:
 *       200:
 *         description: Returns a list of detailed offers for the provider
 *       500:
 *         description: Failed to fetch offers
 */
offerRouter.get(
  '/provider/:providerId/detail',
  o.getDetailedOffersByProviderId,
);

/**
 * @openapi
 * /api/offers/customer/{customerId}/detail:
 *   get:
 *     summary: Get detailed offers by Customer ID
 *     tags:
 *       - Offers
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *         description: The customer ID
 *     responses:
 *       200:
 *         description: Returns a list of detailed offers for the customer
 *       500:
 *         description: Failed to fetch offers
 */
offerRouter.get(
  '/customer/:customerId/detail',
  o.getDetailedOffersByCustomerId,
);

/**
 * @openapi
 * /api/offers/post/{postId}:
 *   get:
 *     summary: Get offers by Post ID
 *     tags:
 *       - Offers
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID
 *     responses:
 *       200:
 *         description: Returns a list of offers for the post
 *       500:
 *         description: Failed to fetch offers
 */
offerRouter.get('/post/:postId', o.getOffersByPostId);

/**
 * @openapi
 * /api/offers/post/{postId}/detail:
 *   get:
 *     summary: Get detailed offers by Post ID
 *     tags:
 *       - Offers
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID
 *     responses:
 *       200:
 *         description: Returns a list of detailed offers
 *       500:
 *         description: Failed to fetch offers
 */
offerRouter.get('/post/:postId/detail', o.getDetailedOffersByPostId);

/**
 * @openapi
 * /api/offers/check/{postId}/{providerId}:
 *   get:
 *     summary: Check if an offer exists for a specific post and provider
 *     tags:
 *       - Offers
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID
 *       - in: path
 *         name: providerId
 *         required: true
 *         schema:
 *           type: string
 *         description: The provider ID
 *     responses:
 *       200:
 *         description: Returns the offer if it exists
 *       500:
 *         description: Failed to check offer
 */
offerRouter.get('/check/:postId/:providerId', o.checkPostOfferProvider);

/**
 * @openapi
 * /api/offers/filter:
 *   get:
 *     summary: Filter offers by various criteria
 *     description: Filter offers by postId, providerId, customerId, and status
 *     tags:
 *       - Offers
 *     parameters:
 *       - in: query
 *         name: postId
 *         schema:
 *           type: string
 *         description: Filter by post ID
 *       - in: query
 *         name: providerId
 *         schema:
 *           type: string
 *         description: Filter by provider ID
 *       - in: query
 *         name: customerId
 *         schema:
 *           type: string
 *         description: Filter by customer ID
 *       - in: query
 *         name: status
 *         style: form
 *         explode: false
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               - Pending
 *               - Accepted
 *               - Rejected
 *               - Deleted
 *         description: Filter by offer status (partial matching)
 *     responses:
 *       200:
 *         description: Returns a list of offers matching the filter criteria
 *       500:
 *         description: Failed to filter offers
 */
offerRouter.get('/filter', o.filterOffers);

/**
 * @openapi
 * /api/offers/filter/detail:
 *   get:
 *     summary: Filter offers with detailed information (populated data)
 *     description: Filter offers by various criteria and return detailed information including populated post, provider, and customer data
 *     tags:
 *       - Offers
 *     parameters:
 *       - in: query
 *         name: postId
 *         schema:
 *           type: string
 *         description: Filter by post ID
 *       - in: query
 *         name: providerId
 *         schema:
 *           type: string
 *         description: Filter by provider ID
 *       - in: query
 *         name: customerId
 *         schema:
 *           type: string
 *         description: Filter by customer ID
 *       - in: query
 *         name: status
 *         style: form
 *         explode: false
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               - Pending
 *               - Accepted
 *               - Rejected
 *               - Deleted
 *         description: Filter by offer status (partial matching)
 *     responses:
 *       200:
 *         description: Returns a list of detailed offers with populated post, provider, and customer information
 *       500:
 *         description: Failed to filter detailed offers
 */
offerRouter.get('/filter/detail', o.filterDetailedOffers);

/**
 * @openapi
 * /api/offers:
 *   post:
 *     summary: Create a new offer
 *     tags:
 *       - Offers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - postId
 *               - providerId
 *               - customerId
 *             properties:
 *               postId:
 *                 type: string
 *                 description: The ID of the post being offered
 *                 example: 64a7b2f5e4b0c8a1d2f3g4h5
 *               providerId:
 *                 type: string
 *                 description: The ID of the provider being offered the job
 *                 example: 64a7b2f5e4b0c8a1d2f3g4h6
 *               customerId:
 *                 type: string
 *                 description: The ID of the customer making the offer
 *                 example: 64a7b2f5e4b0c8a1d2f3g4h7
 *               description:
 *                 type: string
 *                 maxLength: 2000
 *                 default: ''
 *                 example: I would like to offer you this cleaning job
 *               status:
 *                 type: string
 *                 enum: [Pending, Accepted, Rejected, Deleted]
 *                 default: Pending
 *                 example: Pending
 *     responses:
 *       201:
 *         description: Returns the created offer
 *       500:
 *         description: Failed to create offer
 */
offerRouter.post('/', o.createOffer);

/**
 * @openapi
 * /api/offers/{id}:
 *   put:
 *     summary: Update an offer by ID
 *     tags:
 *       - Offers
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The offer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 maxLength: 2000
 *                 example: Updated offer description
 *               status:
 *                 type: string
 *                 enum: [Pending, Accepted, Rejected, Deleted]
 *                 example: Accepted
 *     responses:
 *       200:
 *         description: Returns the updated offer
 *       404:
 *         description: Offer not found
 *       500:
 *         description: Failed to update offer
 */
offerRouter.put('/:id', o.updateOffer);

/**
 * @openapi
 * /api/offers/{id}:
 *   delete:
 *     summary: Delete an offer by ID (soft delete - changes status to 'Deleted')
 *     description: Soft deletes an offer by changing its status to 'Deleted' instead of permanently removing it
 *     tags:
 *       - Offers
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The offer ID
 *     responses:
 *       200:
 *         description: Returns the updated offer with status 'Deleted' and success message
 *       404:
 *         description: Offer not found
 *       500:
 *         description: Failed to delete offer
 */
offerRouter.delete('/:id', o.deleteOffer);

export default offerRouter;
