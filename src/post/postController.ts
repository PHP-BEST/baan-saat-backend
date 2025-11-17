import { Request, Response } from 'express';

import Post from '../models/Post';
import User from '../models/User';
import Apply from '../models/Apply';
import Offer from '../models/Offer';

//desc Get all posts
//route GET /api/posts
//access Public
export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find();
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch posts', error });
  }
};

//desc Get all available posts (unmatched and not deleted)
//route GET /api/posts/available
//access Public
export const getAvailablePosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find({
      isMatched: false,
      status: { $ne: 'Deleted' },
    });
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch available posts',
      error,
    });
  }
};

//desc Get a post by ID
//route GET /api/posts/:id
//access Public
export const getPostById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: 'Post not found' });
    }
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch post', error });
  }
};

//desc Get posts by User ID
//route GET /api/posts/user/:userId
//access Public
export const getPostsByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const posts = await Post.find({ customerId: userId });
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch posts', error });
  }
};

//desc Get available posts by User ID
//route GET /api/posts/user/:userId/available
//access Public
export const getAvailablePostsByUserId = async (
  req: Request,
  res: Response,
) => {
  const { userId } = req.params;
  try {
    const posts = await Post.find({
      customerId: userId,
      isMatched: false,
      status: { $ne: 'Deleted' },
    });
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch available posts',
      error,
    });
  }
};

//desc Create a new post
//route POST /api/posts
//access Public
export const createPost = async (req: Request, res: Response) => {
  try {
    const post = await Post.create(req.body);
    res.status(201).json({ success: true, data: post });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: 'Failed to create post', error });
  }
};

// desc Search posts
// route GET /api/posts/search?query=your_query
// access Public
export const searchPosts = async (req: Request, res: Response) => {
  const { query } = req.query;
  if (!query) {
    return res
      .status(400)
      .json({ success: false, message: 'Query parameter is required' });
  }

  if (typeof query !== 'string') {
    return res
      .status(400)
      .json({ success: false, message: 'Query parameter must be a string' });
  }

  const trimmedQuery = query.trim();
  if (trimmedQuery.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Query parameter cannot be whitespace',
    });
  }

  try {
    const matchingUsers = await User.find({
      $or: [
        { name: { $regex: trimmedQuery, $options: 'i' } },
        { email: { $regex: trimmedQuery, $options: 'i' } },
      ],
    }).select('_id');

    const userIds = matchingUsers.map((user) => user._id);

    const posts = await Post.find({
      $or: [
        { title: { $regex: trimmedQuery, $options: 'i' } },
        { description: { $regex: trimmedQuery, $options: 'i' } },
        { budget: isNaN(Number(trimmedQuery)) ? -1 : Number(trimmedQuery) },
        { location: { $regex: trimmedQuery, $options: 'i' } },
        { tag: { $regex: trimmedQuery, $options: 'i' } },
        { others: { $regex: trimmedQuery, $options: 'i' } },
        { customerId: { $in: userIds } },
      ],
    }).populate(
      'customerId',
      'name email telNumber address role providerProfile',
    );

    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to search posts', error });
  }
};

// desc Search available posts (unmatched and not deleted)
// route GET /api/posts/search/available?query=your_query
// access Public
export const searchAvailablePosts = async (req: Request, res: Response) => {
  const { query } = req.query;
  if (!query) {
    return res
      .status(400)
      .json({ success: false, message: 'Query parameter is required' });
  }

  if (typeof query !== 'string') {
    return res
      .status(400)
      .json({ success: false, message: 'Query parameter must be a string' });
  }

  const trimmedQuery = query.trim();
  if (trimmedQuery.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Query parameter cannot be whitespace',
    });
  }

  try {
    const matchingUsers = await User.find({
      $or: [
        { name: { $regex: trimmedQuery, $options: 'i' } },
        { email: { $regex: trimmedQuery, $options: 'i' } },
      ],
    }).select('_id');

    const userIds = matchingUsers.map((user) => user._id);

    const posts = await Post.find({
      $and: [
        {
          $or: [
            { title: { $regex: trimmedQuery, $options: 'i' } },
            { description: { $regex: trimmedQuery, $options: 'i' } },
            { budget: isNaN(Number(trimmedQuery)) ? -1 : Number(trimmedQuery) },
            { location: { $regex: trimmedQuery, $options: 'i' } },
            { tag: { $regex: trimmedQuery, $options: 'i' } },
            { others: { $regex: trimmedQuery, $options: 'i' } },
            { customerId: { $in: userIds } },
          ],
        },
        { isMatched: false },
        { status: { $ne: 'Deleted' } },
      ],
    }).populate(
      'customerId',
      'name email telNumber address role providerProfile',
    );

    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to search available posts',
      error,
    });
  }
};

//@desc Update a post by ID
//@route PUT /api/posts/:id
//@access Public
export const updatePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    // Option 1: Use runValidators in findByIdAndUpdate
    const post = await Post.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true, // This ensures validation runs before saving
    });
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: 'Post not found' });
    }
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: 'Failed to update post', error });
  }
};

//@desc Delete a post by ID (soft delete)
//@route DELETE /api/posts/:id
//@access Public
export const deletePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    // Check if post exists
    const post = await Post.findById(id);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: 'Post not found' });
    }

    // Soft delete the post by changing status to 'Deleted'
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { status: 'Deleted' },
      { new: true },
    );

    // Update all related applies to 'Deleted' status
    await Apply.updateMany({ postId: id }, { status: 'Deleted' });

    // Update all related offers to 'Deleted' status
    await Offer.updateMany({ postId: id }, { status: 'Deleted' });

    res.status(200).json({
      success: true,
      data: updatedPost,
      message: 'Post and related applications/offers deleted successfully',
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to delete post', error });
  }
};

// export const deleteAllPosts = async (req: Request, res: Response) => {
//   try {
//     await Post.deleteMany({});
//     res.status(200).json({ success: true, message: 'All posts deleted' });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ success: false, message: 'Failed to delete posts', error });
//   }
// };
