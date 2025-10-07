import { Request, Response } from 'express';
import Apply from '../models/Apply';

export const getApplies = async (req: Request, res: Response) => {
  try {
    const applies = await Apply.find();
    res.status(200).json({ success: true, data: applies });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applies',
      error,
    });
  }
};

export const getApplyById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const apply = await Apply.findById(id);
    if (!apply) {
      return res
        .status(404)
        .json({ success: false, message: 'Apply not found' });
    }
    res.status(200).json({ success: true, data: apply });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch apply',
      error,
    });
  }
};

export const getAppliesByCustomerId = async (req: Request, res: Response) => {
  const { customerId } = req.params;
  try {
    const applies = await Apply.find({
      customerId: customerId,
    });

    res.status(200).json({ success: true, data: applies });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch applies', error });
  }
};

export const getAppliesByProviderId = async (req: Request, res: Response) => {
  const { providerId } = req.params;
  try {
    const applies = await Apply.find({
      providerId: providerId,
    });
    res.status(200).json({ success: true, data: applies });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch applies', error });
  }
};

export const getDetailedApplyByProviderId = async (
  req: Request,
  res: Response,
) => {
  const { providerId } = req.params;
  try {
    const applies = await Apply.find({ providerId: providerId })
      .populate('post')
      .populate('customer')
      .populate('provider');

    res.status(200).json({ success: true, data: applies });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch applies', error });
  }
};

export const getAppliesByPostId = async (req: Request, res: Response) => {
  const { postId } = req.params;
  try {
    const applies = await Apply.find({ postId: postId });
    res.status(200).json({ success: true, data: applies });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch applies', error });
  }
};

export const checkProviderApplyPost = async (req: Request, res: Response) => {
  const { providerId, postId } = req.params;

  try {
    const apply = await Apply.findOne({
      providerId: providerId,
      postId: postId,
    });

    res.status(200).json({
      success: true,
      data: apply,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to check provider apply',
      error,
    });
  }
};

export const createApply = async (req: Request, res: Response) => {
  try {
    const apply = await Apply.create(req.body);
    res.status(201).json({ success: true, data: apply });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: 'Failed to create apply', error });
  }
};

export const updateApply = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const apply = await Apply.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!apply) {
      return res
        .status(404)
        .json({ success: false, message: 'Apply not found' });
    }
    res.status(200).json({ success: true, data: apply });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: 'Failed to update apply', error });
  }
};

export const deleteApply = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const apply = await Apply.findByIdAndDelete(id);
    if (!apply) {
      return res
        .status(404)
        .json({ success: false, message: 'Apply not found' });
    }
    res.status(200).json({
      success: true,
      data: apply,
      message: 'Apply deleted successfully',
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to delete apply', error });
  }
};
