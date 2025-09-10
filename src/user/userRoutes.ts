import { Router } from 'express';
import * as u from './userController';
import { isAuthenticated } from '../auth/authController';

const router = Router();

/**
 * @openapi
 * /api/user/session:
 *   get:
 *     summary: Get user session
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Returns current user session information and sets session cookies
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: sessionId=abc123; HttpOnly; Secure
 *       401:
 *         description: Unauthorized - Invalid or missing session cookie
 */
router.get('/session', u.getUserSession);

router.use(isAuthenticated);

export default router;
