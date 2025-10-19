import { Router } from 'express';
import * as u from './userController';
import { isAuthenticated } from '../auth/authController';

const userRouter = Router();

/**
 * @openapi
 * /api/users/session:
 *   get:
 *     summary: Get user session
 *     tags:
 *       - Users
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
userRouter.get('/session', u.getUserSession);

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags:
 *      - Users
 *     responses:
 *       200:
 *         description: Returns a list of all users
 *       500:
 *         description: Failed to fetch users
 */
userRouter.get('/', u.getUsers);

/**
 * @openapi
 * /api/users/providers:
 *   get:
 *     summary: Get all providers
 *     tags:
 *      - Users
 *     responses:
 *       200:
 *         description: Returns a list of all providers
 *       500:
 *         description: Failed to fetch providers
 */
userRouter.get('/providers', u.getProviders);

/**
 * @openapi
 * /api/users/search:
 *  get:
 *     summary: Search providers
 *     tags:
 *       - Users
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *           description: The search query string to partially match against provider names, email addresses, and provider descriptions.
 *     responses:
 *       200:
 *         description: Returns a list of providers
 *       400:
 *         description: Query parameter is required or invalid
 *       500:
 *         description: Failed to search providers
 */
userRouter.get('/search', u.searchProviders);

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags:
 *      - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: Returns the user object
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to fetch user
 */
userRouter.get('/:id', u.getUserById);

/**
 * @openapi
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [customer, provider]
 *                 default: customer
 *                 example: provider
 *               name:
 *                 type: string
 *                 maxLength: 150
 *                 default: ''
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 maxLength: 254
 *                 default: ''
 *                 example: john.doe@example.com
 *               avatarUrl:
 *                 type: string
 *                 format: uri
 *                 default: ''
 *                 example: https://example.com/avatar.jpg
 *               telNumber:
 *                 type: string
 *                 description: Must be 9-10 digits and start with '0' or be empty string
 *                 minLength: 9
 *                 maxLength: 10
 *                 default: '000000000'
 *                 example: '0812345678'
 *               address:
 *                 type: string
 *                 maxLength: 2000
 *                 default: ''
 *                 example: 123 Main St, City, Country
 *               providerProfile:
 *                 type: object
 *                 properties:
 *                   description:
 *                     type: string
 *                     maxLength: 2000
 *                     default: ''
 *                     example: Experienced plumber with a knack for fixing leaks.
 *     responses:
 *       201:
 *         description: Returns the created user
 *       400:
 *         description: Failed to create user
 */
userRouter.post('/', u.createUser);

/**
 * @openapi
 * /api/users/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags:
 *       - Users
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [customer, provider]
 *                 example: provider
 *               name:
 *                 type: string
 *                 maxLength: 150
 *                 example: Jane Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 maxLength: 254
 *                 example: jane.doe@example.com
 *               avatarUrl:
 *                 type: string
 *                 format: uri
 *                 example: https://example.com/avatar2.jpg
 *               telNumber:
 *                 type: string
 *                 minLength: 9
 *                 maxLength: 10
 *                 default: '000000000'
 *                 example: 0898765432
 *               address:
 *                 type: string
 *                 maxLength: 2000
 *                 example: 456 Another Rd, City, Country
 *               providerProfile:
 *                 type: object
 *                 properties:
 *                   description:
 *                     type: string
 *                     maxLength: 2000
 *                     example: Certified electrician with 5+ years of experience.
 *     responses:
 *       200:
 *         description: Returns the updated user
 *       400:
 *         description: Failed to update user
 *       404:
 *         description: User not found
 */
userRouter.put('/:id', u.updateUser);

/**
 * @openapi
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags:
 *      - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to delete user
 */
userRouter.delete('/:id', u.deleteUser);

// /**
//  * @openapi
//  * /api/users:
//  *   delete:
//  *     summary: Delete all users (Use with caution)
//  *     tags:
//  *      - Users
//  *     responses:
//  *       200:
//  *         description: All users deleted
//  *       500:
//  *         description: Failed to delete users
//  */
// userRouter.delete('/', deleteAllUsers);

userRouter.post('/promotion', u.promoteUser);

userRouter.use(isAuthenticated);

export default userRouter;
