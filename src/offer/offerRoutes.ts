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
offerRouter.get('/provider/:providerId/detail', o.getDetailedOfferByProviderId);

/**
 * @openapi
 * /api/offers/service/{serviceId}:
 *   get:
 *     summary: Get offers by Service ID
 *     tags:
 *       - Offers
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The service ID
 *     responses:
 *       200:
 *         description: Returns a list of offers for the service
 *       500:
 *         description: Failed to fetch offers
 */
offerRouter.get('/service/:serviceId', o.getOffersByServiceId);

/**
 * @openapi
 * /api/offers/check/{providerId}/{serviceId}:
 *   get:
 *     summary: Check if a provider has already made an offer for a specific service
 *     tags:
 *       - Offers
 *     parameters:
 *       - in: path
 *         name: providerId
 *         required: true
 *         schema:
 *           type: string
 *         description: The provider ID
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The service ID
 *     responses:
 *       200:
 *         description: Returns true if an offer exists, false otherwise
 *       500:
 *         description: Failed to check offer
 */
offerRouter.get('/check/:providerId/:serviceId', o.checkProviderOfferService);

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
 *               - serviceId
 *               - providerId
 *               - customerId
 *               - date
 *             properties:
 *               serviceId:
 *                 type: string
 *                 description: The ID of the service being requested
 *                 example: 64a7b2f5e4b0c8a1d2f3g4h5
 *               providerId:
 *                 type: string
 *                 description: The ID of the provider offering the service
 *                 example: 64a7b2f5e4b0c8a1d2f3g4h6
 *               customerId:
 *                 type: string
 *                 description: The ID of the customer requesting the service
 *                 example: 64a7b2f5e4b0c8a1d2f3g4h7
 *               description:
 *                 type: string
 *                 maxLength: 2000
 *                 default: ''
 *                 example: I can help clean your house with my expertise
 *               offeredPrice:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 99999999.99
 *                 default: 0
 *                 example: 500.00
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-07-01T10:00:00Z
 *               status:
 *                 type: string
 *                 enum: [Pending, Accepted, Rejected]
 *                 default: Pending
 *                 example: Pending
 *     responses:
 *       201:
 *         description: Returns the created offer
 *       400:
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
 *         description: The service request ID
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
 *                 example: Updated offer details
 *               offeredPrice:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 99999999.99
 *                 example: 600.00
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-08-01T14:00:00Z
 *               status:
 *                 type: string
 *                 enum: [Pending, Accepted, Rejected]
 *                 example: Accepted
 *     responses:
 *       200:
 *         description: Returns the updated service request
 *       400:
 *         description: Failed to update service request
 *       404:
 *         description: Service request not found
 */
offerRouter.put('/:id', o.updateOffer);

/**
 * @openapi
 * /api/offers/{id}:
 *   delete:
 *     summary: Delete an offer by ID
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
 *         description: Returns the deleted offer
 *       404:
 *         description: Offer not found
 *       500:
 *         description: Failed to delete offer
 */
offerRouter.delete('/:id', o.deleteOffer);

export default offerRouter;
