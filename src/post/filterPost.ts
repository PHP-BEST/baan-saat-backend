import { Request, Response } from 'express';
import Post from '../models/Post';

//desc Filter posts
//route GET /api/posts/filter
//access Public
export const filterPosts = async (req: Request, res: Response) => {
  const {
    userId,
    title,
    tags,
    others,
    minBudget,
    maxBudget,
    startDate,
    endDate,
    isMatched,
    status,
  } = req.query;

  interface PostFilter {
    customerId?: string;
    title?: { $regex: string; $options: string };
    $or?: Array<{
      tag?: { $in: string[] };
      others?: { $regex: string; $options: string };
    }>;
    budget?: { $gte?: number; $lte?: number };
    date?: { $gte?: Date; $lte?: Date };
    isMatched?: boolean;
    status?: { $in: string[] };
  }

  const filter: PostFilter = {};

  try {
    if (userId) {
      filter.customerId = userId as string;
    }
    if (title) {
      filter.title = { $regex: title as string, $options: 'i' };
    }
    if (tags) {
      const orConditions: Array<{
        tag?: { $in: string[] };
        others?: { $regex: string; $options: string };
      }> = [];

      const tagsArray = (tags as string).split(',').map((tag) => tag.trim());
      if (others) {
        const index = tagsArray.indexOf('others');
        tagsArray.splice(index, 1);
        orConditions.push({
          others: { $regex: others as string, $options: 'i' },
        });
      }
      orConditions.push({ tag: { $in: tagsArray } });

      filter.$or = orConditions;
    }
    if (minBudget || maxBudget) {
      filter.budget = {};
      if (minBudget) {
        filter.budget.$gte = Number(minBudget);
      }
      if (maxBudget) {
        filter.budget.$lte = Number(maxBudget);
      }
    }
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate as string);
      }
      if (endDate) {
        filter.date.$lte = new Date(endDate as string);
      }
    }
    if (isMatched) {
      filter.isMatched = isMatched === 'true';
    }
    if (status) {
      const statusArray = (status as string).split(',').map((s) => s.trim());
      filter.status = { $in: statusArray };
    }

    const posts = await Post.find(filter);
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to search posts', error });
  }
};
