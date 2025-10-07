import express from 'express';
import * as a from './applyController';

const applyRouter = express.Router();

/**
 * @openapi
 * /api/applys:
 *   get:
 *     summary: Get all applys
 *     tags:
 *       - Applys
 *     responses:
 *       200:
 *         description: Returns a list of all applys
 *       500:
 *         description: Failed to fetch applys
 */
applyRouter.get('/', a.getApplys);

/**
 * @openapi
 * /api/applys/{id}:
 *   get:
 *     summary: Get an apply by ID
 *     tags:
 *       - Applys
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
 * /api/applys/customer/{customerId}:
 *   get:
 *     summary: Get applys by Customer ID
 *     tags:
 *       - Applys
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *         description: The customer ID
 *     responses:
 *       200:
 *         description: Returns a list of applys for the customer
 *       500:
 *         description: Failed to fetch applys
 */
applyRouter.get('/customer/:customerId', a.getApplysByCustomerId);

/**
 * @openapi
 * /api/applys/provider/{providerId}:
 *   get:
 *     summary: Get applys by Provider ID
 *     tags:
 *       - Applys
 *     parameters:
 *       - in: path
 *         name: providerId
 *         required: true
 *         schema:
 *           type: string
 *         description: The provider ID
 *     responses:
 *       200:
 *         description: Returns a list of applys for the provider
 *       500:
 *         description: Failed to fetch applys
 */
applyRouter.get('/provider/:providerId', a.getApplysByProviderId);

/**
 * @openapi
 * /api/applys/provider/{providerId}/detail:
 *   get:
 *     summary: Get detailed applys by Provider ID
 *     tags:
 *       - Applys
 *     parameters:
 *       - in: path
 *         name: providerId
 *         required: true
 *         schema:
 *           type: string
 *         description: The provider ID
 *     responses:
 *       200:
 *         description: Returns a list of detailed applys for the provider
 *       500:
 *         description: Failed to fetch applys
 */
applyRouter.get('/provider/:providerId/detail', a.getDetailedApplyByProviderId);

/**
 * @openapi
 * /api/applys/post/{postId}:
 *   get:
 *     summary: Get applys by Post ID
 *     tags:
 *       - Applys
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID
 *     responses:
 *       200:
 *         description: Returns a list of applys for the post
 *       500:
 *         description: Failed to fetch applys
 */
applyRouter.get('/post/:postId', a.getApplysByPostId);

/**
 * @openapi
 * /api/applys/check/{providerId}/{postId}:
 *   get:
 *     summary: Check if a provider has already made an apply for a specific post
 *     tags:
 *       - Applys
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
 *         description: Returns true if an apply exists, false otherwise
 *       500:
 *         description: Failed to check apply
 */
applyRouter.get('/check/:providerId/:postId', a.checkProviderApplyPost);

/**
 * @openapi
 * /api/applys:
 *   post:
 *     summary: Create a new apply
 *     tags:
 *       - Applys
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
 *               applyedPrice:
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
 * /api/applys/{id}:
 *   put:
 *     summary: Update an apply by ID
 *     tags:
 *       - Applys
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
 *               applyedPrice:
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
 * /api/applys/{id}:
 *   delete:
 *     summary: Delete an apply by ID
 *     tags:
 *       - Applys
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
