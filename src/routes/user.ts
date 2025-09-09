import express from 'express';
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  deleteAllUsers,
} from '../controllers/user';

const userRouter = express.Router();

/**
 * @openapi
 * /users:
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
userRouter.get('/', getUsers);

/**
 * @openapi
 * /users/{id}:
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
userRouter.get('/:id', getUserById);

/**
 * @openapi
 * /users:
 *   post:
 *     summary: Create a new user (Customer can't have provider profile)
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
 *                 maxLength: 10
 *                 default: ''
 *                 example: "0812345678"
 *               address:
 *                 type: string
 *                 maxLength: 2000
 *                 default: ''
 *                 example: 123 Main St, City, Country
 *               providerProfile:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                     maxLength: 200
 *                     default: ''
 *                     example: Plumber
 *                   skills:
 *                     type: array
 *                     items:
 *                       type: string
 *                       enum: [houseCleaning, houseRepair, plumbing, electrical, hvac, painting, landscaping, others]
 *                     example: [houseCleaning, houseRepair]
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
userRouter.post('/', createUser);

/**
 * @openapi
 * /users/{id}:
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
 *                 maxLength: 10
 *                 example: 0898765432
 *               address:
 *                 type: string
 *                 maxLength: 2000
 *                 example: 456 Another Rd, City, Country
 *               providerProfile:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                     maxLength: 200
 *                     example: Electrician
 *                   skills:
 *                     type: array
 *                     items:
 *                       type: string
 *                       enum: [houseCleaning, houseRepair, plumbing, electrical, hvac, painting, landscaping, others]
 *                     example: [electrical, hvac]
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
userRouter.put('/:id', updateUser);

/**
 * @openapi
 * /users/{id}:
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
userRouter.delete('/:id', deleteUser);

/**
 * @openapi
 * /users:
 *   delete:
 *     summary: Delete all users (Use with caution)
 *     tags:
 *      - Users
 *     responses:
 *       200:
 *         description: All users deleted
 *       500:
 *         description: Failed to delete users
 */
userRouter.delete('/', deleteAllUsers);

export default userRouter;
