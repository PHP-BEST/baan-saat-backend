import express from 'express';
import * as p from './postController';

const postRouter = express.Router();

/**
 * @openapi
 * /api/posts:
 *   get:
 *     summary: Get all posts
 *     tags:
 *       - Posts
 *     responses:
 *       200:
 *         description: Returns a list of all posts
 *       500:
 *        description: Failed to fetch posts
 */
postRouter.get('/', p.getPosts);

/**
 * @openapi
 * /api/posts/search:
 *   get:
 *     summary: Search posts
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *     responses:
 *       200:
 *         description: Returns a list of posts
 *       500:
 *         description: Failed to fetch posts
 */
postRouter.get('/search', p.searchPosts);

/**
 * @openapi
 * /api/posts/filter:
 *   get:
 *     summary: Filter posts
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: User ID to filter posts by (exact match)
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Title to search for (partial match)
 *       - in: query
 *         name: tags
 *         style: form
 *         explode: false
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               - houseCleaning
 *               - houseRepair
 *               - plumbing
 *               - electrical
 *               - hvac
 *               - painting
 *               - landscaping
 *               - others
 *         description: Tags to filter by (partial match)
 *       - in: query
 *         name: others
 *         schema:
 *           type: string
 *           maxLength: 200
 *         description: Neglected if tags does not include 'others'.
 *       - in: query
 *         name: minBudget
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Minimum budget to filter by
 *       - in: query
 *         name: maxBudget
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Maximum budget to filter by
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start date to filter by (inclusive)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End date to filter by (inclusive)
 *     responses:
 *       200:
 *         description: Returns a list of posts matching the search criteria
 *       500:
 *         description: Failed to fetch posts
 */
postRouter.get('/filter', p.filterPosts);

/**
 * @openapi
 * /api/posts/{id}:
 *   get:
 *     summary: Get a post by ID
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID
 *     responses:
 *       200:
 *         description: Returns the post
 *       404:
 *         description: Post not found
 *       500:
 *         description: Failed to fetch post
 */
postRouter.get('/:id', p.getPostById);

/**
 * @openapi
 * /api/posts/user/{userId}:
 *   get:
 *     summary: Get posts by User ID
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: Returns a list of posts for the user
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to fetch posts
 */
postRouter.get('/user/:userId', p.getPostsByUserId);

/**
 * @openapi
 * /api/posts:
 *   post:
 *     summary: Create a new post
 *     tags:
 *       - Posts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerId
 *               - title
 *               - date
 *             properties:
 *               customerId:
 *                 type: string
 *                 description: The ID of the customer creating the post
 *                 example: 64a7b2f5e4b0c8a1d2f3g4h5
 *               title:
 *                 type: string
 *                 maxLength: 200
 *                 example: House Cleaning
 *               description:
 *                 type: string
 *                 maxLength: 2000
 *                 default: ''
 *                 example: I want my house cleaned thoroughly.
 *               budget:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 99999999.99
 *                 default: 0
 *                 example: 555.55
 *               coverPhotoUrl:
 *                 type: string
 *                 maxLength: 2000
 *                 default: ''
 *                 example: http://example.com/photo.jpg
 *               telNumber:
 *                 type: string
 *                 description: Must be 9-10 digits and start with '0' or be empty string
 *                 minLength: 9
 *                 maxLength: 10
 *                 default: '000000000'
 *                 example: '0123456789'
 *               location:
 *                 type: string
 *                 maxLength: 2000
 *                 default: ''
 *                 example: 123 Main St, City, Country
 *               tags:
 *                 type: string
 *                 enum:
 *                   - houseCleaning
 *                   - houseRepair
 *                   - plumbing
 *                   - electrical
 *                   - hvac
 *                   - painting
 *                   - landscaping
 *                   - others
 *                 default: ''
 *                 example: 'houseCleaning'
 *               others:
 *                 type: string
 *                 maxLength: 200
 *                 default: ''
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-07-01T10:00:00Z
 *     responses:
 *       201:
 *         description: Returns the created post
 *       400:
 *         description: Failed to create post
 */
postRouter.post('/', p.createPost);

/**
 * @openapi
 * /api/posts/{id}:
 *   put:
 *     summary: Update a post by ID
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 200
 *                 example: Updated Post Title
 *               description:
 *                 type: string
 *                 maxLength: 2000
 *                 example: Updated description of the post.
 *               budget:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 99999999.99
 *                 example: 750.75
 *               telNumber:
 *                 type: string
 *                 description: Must be 9-10 digits and start with '0' or be empty string
 *                 example: '0987654321'
 *               location:
 *                 type: string
 *                 maxLength: 2000
 *                 example: 456 Another St, City, Country
 *               tags:
 *                 type: string
 *                 enum:
 *                   - houseCleaning
 *                   - houseRepair
 *                   - plumbing
 *                   - electrical
 *                   - hvac
 *                   - painting
 *                   - landscaping
 *                   - others
 *                 default: ''
 *                 example: 'electrical'
 *               others:
 *                 type: string
 *                 maxLength: 200
 *                 default: ''
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-08-01T14:00:00Z
 *     responses:
 *       200:
 *         description: Returns the updated post
 *       400:
 *         description: Failed to update post
 *       404:
 *         description: Post not found
 */
postRouter.put('/:id', p.updatePost);

/**
 * @openapi
 * /api/posts/{id}:
 *   delete:
 *     summary: Delete a post by ID
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID
 *     responses:
 *       200:
 *         description: Returns the deleted post
 *       404:
 *         description: Post not found
 *       500:
 *         description: Failed to delete post
 */
postRouter.delete('/:id', p.deletePost);

// /**
//  * @openapi
//  * /api/posts:
//  *   delete:
//  *     summary: Delete all posts (Use with caution)
//  *     tags:
//  *       - Posts
//  *     responses:
//  *       200:
//  *         description: All posts deleted successfully
//  *       500:
//  *         description: Failed to delete posts
//  */
// postRouter.delete('/', deleteAllPosts);

export default postRouter;
