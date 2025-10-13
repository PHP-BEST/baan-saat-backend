import express from 'express';
import * as a from './applyController';

const applyRouter = express.Router();

/**
 * @openapi
 * /api/applies:
 *   get:
 *     summary: Get all applies
 *     tags:
 *       - Applies
 *     responses:
 *       200:
 *         description: Returns a list of all applies
 *       500:
 *         description: Failed to fetch applies
 */
applyRouter.get('/', a.getApplies);

/**
 * @openapi
 * /api/applies/{id}:
 *   get:
 *     summary: Get an apply by ID
 *     tags:
 *       - Applies
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The apply ID
 *     responses:
 *       200:
 *         description: Returns the apply
 *       404:
 *         description: Apply not found
 *       500:
 *         description: Failed to fetch apply
 */
applyRouter.get('/:id', a.getApplyById);

/**
 * @openapi
 * /api/applies/customer/{customerId}:
 *   get:
 *     summary: Get applies by Customer ID
 *     tags:
 *       - Applies
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *         description: The customer ID
 *     responses:
 *       200:
 *         description: Returns a list of applies for the customer
 *       500:
 *         description: Failed to fetch applies
 */
applyRouter.get('/customer/:customerId', a.getAppliesByCustomerId);

/**
 * @openapi
 * /api/applies/provider/{providerId}:
 *   get:
 *     summary: Get applies by Provider ID
 *     tags:
 *       - Applies
 *     parameters:
 *       - in: path
 *         name: providerId
 *         required: true
 *         schema:
 *           type: string
 *         description: The provider ID
 *     responses:
 *       200:
 *         description: Returns a list of applies for the provider
 *       500:
 *         description: Failed to fetch applies
 */
applyRouter.get('/provider/:providerId', a.getAppliesByProviderId);

/**
 * @openapi
 * /api/applies/provider/{providerId}/detail:
 *   get:
 *     summary: Get detailed applies by Provider ID
 *     tags:
 *       - Applies
 *     parameters:
 *       - in: path
 *         name: providerId
 *         required: true
 *         schema:
 *           type: string
 *         description: The provider ID
 *     responses:
 *       200:
 *         description: Returns a list of detailed applies for the provider
 *       500:
 *         description: Failed to fetch applies
 */
applyRouter.get('/provider/:providerId/detail', a.getDetailedApplyByProviderId);

/**
 * @openapi
 * /api/applies/post/{postId}:
 *   get:
 *     summary: Get applies by Post ID
 *     tags:
 *       - Applies
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID
 *     responses:
 *       200:
 *         description: Returns a list of applies for the post
 *       500:
 *         description: Failed to fetch applies
 */
applyRouter.get('/post/:postId', a.getAppliesByPostId);

/**
 * @openapi
 * /api/applies/postId/{postId}/detail:
 *   get:
 *     summary: Get detailed applies by Post ID
 *     tags:
 *       - Applies
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID
 *     responses:
 *       200:
 *         description: Returns a list of detailed applies
 *       500:
 *         description: Failed to fetch applies
 */
applyRouter.get('/post/:postId/detail', a.getDetailedApplyByPostId);

/**
 * @openapi
 * /api/applies/check/{providerId}/{postId}:
 *   get:
 *     summary: Check if a provider has already made an apply for a specific post
 *     tags:
 *       - Applies
 *     parameters:
 *       - in: path
 *         name: providerId
 *         required: true
 *         schema:
 *           type: string
 *         description: The provider ID
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID
 *     responses:
 *       200:
 *         description: Returns the apply the provider applies to the post
 *       500:
 *         description: Failed to check apply
 */
applyRouter.get('/check/:providerId/:postId', a.checkProviderApplyPost);

/**
 * @openapi
 * /api/applies:
 *   post:
 *     summary: Create a new apply
 *     tags:
 *       - Applies
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
 *               - date
 *             properties:
 *               postId:
 *                 type: string
 *                 description: The ID of the post being requested
 *                 example: 64a7b2f5e4b0c8a1d2f3g4h5
 *               providerId:
 *                 type: string
 *                 description: The ID of the provider applying the post
 *                 example: 64a7b2f5e4b0c8a1d2f3g4h6
 *               customerId:
 *                 type: string
 *                 description: The ID of the customer requesting the post
 *                 example: 64a7b2f5e4b0c8a1d2f3g4h7
 *               description:
 *                 type: string
 *                 maxLength: 2000
 *                 default: ''
 *                 example: I can help clean your house with my expertise
 *               appliedPrice:
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
 *         description: Returns the created apply
 *       400:
 *         description: Failed to create apply
 */
applyRouter.post('/', a.createApply);

/**
 * @openapi
 * /api/applies/{id}:
 *   put:
 *     summary: Update an apply by ID
 *     tags:
 *       - Applies
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The post request ID
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
 *                 example: Updated apply details
 *               appliedPrice:
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
 *         description: Returns the updated post request
 *       400:
 *         description: Failed to update post request
 *       404:
 *         description: Post request not found
 */
applyRouter.put('/:id', a.updateApply);

/**
 * @openapi
 * /api/applies/{id}:
 *   delete:
 *     summary: Delete an apply by ID
 *     tags:
 *       - Applies
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The apply ID
 *     responses:
 *       200:
 *         description: Returns the deleted apply
 *       404:
 *         description: Apply not found
 *       500:
 *         description: Failed to delete apply
 */
applyRouter.delete('/:id', a.deleteApply);

export default applyRouter;
