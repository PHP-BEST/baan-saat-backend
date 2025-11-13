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
 * /api/posts/search/available:
 *   get:
 *     summary: Search available posts (unmatched and not deleted)
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query for available posts
 *     responses:
 *       200:
 *         description: Returns a list of available posts matching the search criteria
 *       400:
 *         description: Query parameter is required or invalid
 *       500:
 *         description: Failed to search available posts
 */
postRouter.get('/search/available', p.searchAvailablePosts);

/**
 * @openapi
 * /api/posts/available:
 *   get:
 *     summary: Get all available posts (unmatched and not deleted)
 *     tags:
 *       - Posts
 *     responses:
 *       200:
 *         description: Returns a list of all available posts
 *       500:
 *         description: Failed to fetch available posts
 */
postRouter.get('/available', p.getAvailablePosts);

/**
 * @openapi
 * /api/posts/filter:
 *   get:
 *     summary: Filter posts by various criteria
 *     description: Filter posts by userId, title, tags, budget, date range, match status, and post status
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
 *       - in: query
 *         name: isMatched
 *         schema:
 *           type: boolean
 *         description: Whether the post is matched or not
 *       - in: query
 *         name: status
 *         style: form
 *         explode: false
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               - Not working
 *               - In progress
 *               - Completed
 *               - Deleted
 *         description: Filter by post status (partial match)
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
 * /api/posts/user/{userId}/available:
 *   get:
 *     summary: Get available posts by User ID (unmatched and not deleted)
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
 *         description: Returns a list of available posts for the user
 *       500:
 *         description: Failed to fetch available posts
 */
postRouter.get('/user/:userId/available', p.getAvailablePostsByUserId);

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
 *               image1Url:
 *                 type: string
 *                 maxLength: 2000
 *                 default: ''
 *                 example: http://example.com/image1.jpg
 *               image2Url:
 *                 type: string
 *                 maxLength: 2000
 *                 default: ''
 *                 example: http://example.com/image2.jpg
 *               image3Url:
 *                 type: string
 *                 maxLength: 2000
 *                 default: ''
 *                 example: http://example.com/image3.jpg
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
 *               tag:
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
 *               status:
 *                 type: string
 *                 enum:
 *                   - Not working
 *                   - In progress
 *                   - Completed
 *                 default: 'Not working'
 *                 example: 'Not working'
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-07-01T10:00:00Z
 *               isMatched:
 *                 type: boolean
 *                 default: false
 *                 example: true
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
 *               coverPhotoUrl:
 *                 type: string
 *                 maxLength: 2000
 *                 default: ''
 *                 example: http://example.com/newphoto.jpg
 *               image1Url:
 *                 type: string
 *                 maxLength: 2000
 *                 default: ''
 *                 example: http://example.com/newimage1.jpg
 *               image2Url:
 *                 type: string
 *                 maxLength: 2000
 *                 default: ''
 *                 example: http://example.com/newimage2.jpg
 *               image3Url:
 *                 type: string
 *                 maxLength: 2000
 *                 default: ''
 *                 example: http://example.com/newimage3.jpg
 *               telNumber:
 *                 type: string
 *                 description: Must be 9-10 digits and start with '0' or be empty string
 *                 example: '0987654321'
 *               location:
 *                 type: string
 *                 maxLength: 2000
 *                 example: 456 Another St, City, Country
 *               tag:
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
 *               status:
 *                 type: string
 *                 enum:
 *                   - Not working
 *                   - In progress
 *                   - Completed
 *                 default: 'Not working'
 *                 example: 'Not working'
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-08-01T14:00:00Z
 *               isMatched:
 *                 type: boolean
 *                 default: false
 *                 example: true
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
 * @swagger
 * /update-poststatus:
 *   post:
 *     summary: Update multiple posts' match status
 *     description: Set `isMatched` to `true` for all posts whose IDs are provided.
 *     tags:
 *       - Posts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - postsId
 *             properties:
 *               postsId:
 *                 type: array
 *                 description: List of post IDs to update.
 *                 items:
 *                   type: string
 *                   example: "64f8c1a9b2e4a123456789ab"
 *           example:
 *             postsId:
 *               - "64f8c1a9b2e4a123456789ab"
 *               - "64f8c1a9b2e4a123456789ac"
 *     responses:
 *       200:
 *         description: Successfully updated one or more posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: string
 *                   example: Updated 2 posts
 *       404:
 *         description: Posts not found or invalid request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Post not found
 *       400:
 *         description: Bad request (invalid input or server error)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Failed to update post
 *                 error:
 *                   type: string
 *                   example: ValidationError
 */
postRouter.post('/update-poststatus', p.updateManyPosts);

/**
 * @openapi
 * /api/posts/{id}:
 *   delete:
 *     summary: Delete a post by ID (soft delete - changes status to 'Deleted')
 *     description: Soft deletes a post by changing its status to 'Deleted' and also updates all related applications and offers to 'Deleted' status
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
 *         description: Returns the updated post with status 'Deleted' and confirms related data was also updated
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
