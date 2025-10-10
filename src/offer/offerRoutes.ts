import express from 'express';
import * as a from './offerController';

const offerRouter = express.Router();
/**
 * @swagger
 * /offers:
 *   get:
 *     summary: Get all offers
 *     tags:
 *       - Offers
 *     responses:
 *       200:
 *         description: List of offers
 *       500:
 *         description: Server error
 */
offerRouter.get('/', a.getOffers);
/**
 * @swagger
 * /offers/{id}:
 *   get:
 *     summary: Get offer by ID
 *     tags:
 *       - Offers
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Offer ID
 *     responses:
 *       200:
 *         description: Offer found
 *       404:
 *         description: Offer not found
 *       500:
 *         description: Server error
 */
offerRouter.get('/:id', a.getOfferById);

/**
 * @swagger
 * /offers/customer/{customerId}:
 *   get:
 *     summary: Get offers by customer ID
 *     tags:
 *       - Offers
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: List of offers
 *       500:
 *         description: Server error
 */
offerRouter.get('/customer/:customerId', a.getOffersByCustomerId);

/**
 * @swagger
 * /offers/provider/{providerId}:
 *     get:
 *         summary: Get offers by provider ID
 *         tags:
 *         - Offers
 *         parameters:
 *         - in: path
 *           name: providerId
 *           required: true
 *           schema:
 *             type: string
 *           description: Provider ID
 *         responses:
 *           200:
 *             description: List of offers
 *             500:
 *             description: Server error
 */
offerRouter.get('/provider/:providerId', a.getOffersByProviderId);

/**
 * @swagger
 * /offers/post/{postId}:
 *   get:
 *     summary: Get offers by post ID
 *     tags:
 *       - Offers
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: List of offers
 *       500:
 *         description: Server error
 */
offerRouter.get('/post/:postId', a.getOfferByPostId);

/**
 * @swagger
 * /offers/customer/{customerId}/details:
 *   get:
 *     summary: Get detailed offers by customer ID (with populated data)
 *     tags:
 *       - Offers
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: Detailed offer list
 *       500:
 *         description: Server error
 */
offerRouter.get(
  '/customer/:customerId/details',
  a.getDetailedOfferByCustomerId,
);

/**
 * @swagger
 * /offers/customer/{customerId}/post/{postId}:
 *   get:
 *     summary: Get offer by customer and post ID
 *     tags:
 *       - Offers
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Offer data
 *       500:
 *         description: Server error
 */
offerRouter.get('/customer/:customerId/:postId', a.getCustomerOfferService);

/**
 * @swagger
 * /offers:
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
 *             example:
 *               customerId: "123"
 *               providerId: "456"
 *               postId: "789"
 *               price: 1000
 *     responses:
 *       201:
 *         description: Offer created
 *       500:
 *         description: Server error
 */
offerRouter.post('/', a.createOffer);

/**
 * @swagger
 * /offers/{id}:
 *   put:
 *     summary: Update an existing offer
 *     tags:
 *       - Offers
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Offer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               price: 1500
 *     responses:
 *       200:
 *         description: Offer updated
 *       404:
 *         description: Offer not found
 *       500:
 *         description: Server error
 */
offerRouter.put('/:id', a.updateOffer);

/**
 * @swagger
 * /offers/{id}:
 *   delete:
 *     summary: Delete an offer
 *     tags:
 *       - Offers
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Offer ID
 *     responses:
 *       200:
 *         description: Offer deleted
 *       404:
 *         description: Offer not found
 *       500:
 *         description: Server error
 */
offerRouter.delete('/:id', a.deleteOffer);

export default offerRouter;
