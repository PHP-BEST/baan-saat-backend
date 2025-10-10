import express from 'express';
import * as a from './hireController';

const hireRouter = express.Router();
/**
 * @swagger
 * /hires:
 *   get:
 *     summary: Get all hires
 *     tags:
 *       - hires
 *     responses:
 *       200:
 *         description: List of hires
 *       500:
 *         description: Server error
 */
hireRouter.get('/', a.getHires);

/**
 * @swagger
 * /hires/{id}:
 *   get:
 *     summary: Get hire by ID
 *     tags:
 *       - hires
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: hire ID
 *     responses:
 *       200:
 *         description: Hire found
 *       404:
 *         description: Hire not found
 *       500:
 *         description: Server error
 */
hireRouter.get('/:id', a.getHireById);



/**
 * @swagger
 * /hires/customer/{customerId}:
 *   get:
 *     summary: Get hires by customer ID
 *     tags:
 *       - hires
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: List of hires
 *       500:
 *         description: Server error
 */
hireRouter.get('/customer/:customerId', a.getHiresByCustomerId);

/**
 * @swagger
 * /hires/post/{postId}:
 *   get:
 *     summary: Get hires by post ID
 *     tags:
 *       - hires
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: List of hires
 *       500:
 *         description: Server error
 */
hireRouter.get('/post/:postId', a.getHiresByPostId);

/**
 * @swagger
 * /hires/provider/{id}:
 *   get:
 *     summary: Get all hires by provider ID
 *     tags:
 *       - hires
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the provider
 *     responses:
 *       200:
 *         description: List of hires retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   hireId:
 *                     type: string
 *                     description: The ID of the hire
 *                   providerId:
 *                     type: string
 *                     description: The ID of the provider
 *                   price:
 *                     type: number
 *                     description: The price of the hire
 *                   date:
 *                     type: string
 *                     format: date-time
 *                     description: The date of the hire
 *               example:
 *                 - hireId: "hire123"
 *                   providerId: "provider456"
 *                   price: 1500
 *                   date: "2023-10-01T12:00:00Z"
 *                 - hireId: "hire124"
 *                   providerId: "provider456"
 *                   price: 2000
 *                   date: "2023-10-02T15:00:00Z"
 *       404:
 *         description: Provider not found
 *       500:
 *         description: Internal server error
 */
hireRouter.get('/provider/:id', a.getHiresByProviderId);

/**
 * @swagger
 * /hires:
 *   post:
 *     summary: Create a new hire
 *     tags:
 *       - hires
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               providerId:
 *                 type: string
 *                 description: The ID of the provider
 *               price:
 *                 type: number
 *                 description: The price of the hire
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: The date of the hire
 *             example:
 *               providerId: "provider456"
 *               price: 1500
 *               date: "2023-10-01T12:00:00Z"
 *     responses:
 *       201:
 *         description: Hire successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 hireId:
 *                   type: string
 *                   description: The ID of the newly created hire
 *                 providerId:
 *                   type: string
 *                   description: The ID of the provider
 *                 price:
 *                   type: number
 *                   description: The price of the hire
 *                 date:
 *                   type: string
 *                   format: date-time
 *                   description: The date of the hire
 *               example:
 *                 hireId: "hire123"
 *                 providerId: "provider456"
 *                 price: 1500
 *                 date: "2023-10-01T12:00:00Z"
 *       400:
 *         description: Bad request, invalid input
 *       500:
 *         description: Internal server error
 */
hireRouter.post('/', a.createHire);

/**
 * @swagger
 * /hires/{id}:
 *   put:
 *     summary: Update a hire
 *     tags:
 *       - hires
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the hire to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               price:
 *                 type: number
 *                 description: The updated price for the hire
 *             example:
 *               price: 1500
 *     responses:
 *       200:
 *         description: Hire successfully updated
 *       404:
 *         description: Hire not found
 *       500:
 *         description: Internal server error
 */
hireRouter.put('/:id', a.updateHire);

/**
 * @swagger
 * /hires/{id}:
 *   delete:
 *     summary: Delete a hire
 *     tags:
 *       - hires
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the hire to delete
 *     responses:
 *       200:
 *         description: Hire successfully deleted
 *       404:
 *         description: Hire not found
 *       500:
 *         description: Internal server error
 */
hireRouter.delete('/:id', a.deleteHire);


export default hireRouter;