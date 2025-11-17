import { Router } from 'express';
import * as p from './paymentController';
import { isAuthenticated } from '../auth/authController';

const paymentRouter = Router();

paymentRouter.use(isAuthenticated);

/**
 * @openapi
 * /api/payments/account-session:
 *   post:
 *     summary: Create an account session
 *     tags:
 *       - Payment
 *     responses:
 *       200:
 *         description: Account session created successfully
 *       500:
 *         description: Failed to create account session
 */
paymentRouter.post('/account-session', p.createAccountSession);

/**
 * @openapi
 * /api/payments/payment-intent:
 *   get:
 *     summary: Get all post payments
 *     tags:
 *       - Payment
 *     responses:
 *       200:
 *         description: Returns all post payments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 postPayments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       postId:
 *                         type: string
 *                       providerId:
 *                         type: string
 *                       amount:
 *                         type: number
 *                       paymentId:
 *                         type: string
 *                       paymentSecret:
 *                         type: string
 *                       paymentStatus:
 *                         type: string
 */
paymentRouter.get('/payment-intent', p.getPaymentIntent);

/**
 * @openapi
 * /api/payments/payment-intent/{postId}:
 *   get:
 *     summary: Get payment intent secret by post ID
 *     tags:
 *       - Payment
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID
 *     responses:
 *       200:
 *         description: Returns the payment intent secret
 *       404:
 *         description: Post not found
 *       500:
 *         description: Failed to fetch payment intent secret
 */
paymentRouter.get('/payment-intent/:postId', p.getPaymentIntentSecretById);

/**
 * @openapi
 * /api/payments/payment-intent:
 *   post:
 *     summary: Create a payment intent
 *     tags:
 *       - Payment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - postId
 *               - providerId
 *               - amount
 *             properties:
 *               postId:
 *                 type: string
 *                 description: The post ID for payment
 *               providerId:
 *                 type: string
 *                 description: The provider ID
 *               amount:
 *                 type: number
 *                 description: The payment amount
 *     responses:
 *       200:
 *         description: Payment intent created successfully
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Failed to create payment intent
 */
paymentRouter.post('/payment-intent', p.createPaymentIntentController);

/**
 * @openapi
 * /api/payments/status/{postId}:
 *   put:
 *     summary: Retrieve and update payment status by post ID
 *     tags:
 *       - Payment
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID
 *     responses:
 *       200:
 *         description: Payment status retrieved successfully
 *       404:
 *         description: Post not found
 *       500:
 *         description: Failed to retrieve payment status
 */
paymentRouter.put('/status/:postId', p.getPaymentStatus);

export default paymentRouter;
