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

export const getDetailedApplyById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const apply = await Apply.findById(id)
      .populate('post')
      .populate('customer')
      .populate('provider');
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
export const getDetailedAppliesByCustomerId = async (
  req: Request,
  res: Response,
) => {
  const { customerId } = req.params;
  try {
    const applies = await Apply.find({ customerId: customerId })
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
export const getDetailedAppliesByProviderId = async (
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

export const getDetailedAppliesByPostId = async (
  req: Request,
  res: Response,
) => {
  const { postId } = req.params;
  try {
    const applies = await Apply.find({ postId })
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

//desc Filter applies
//route GET /api/applies/filter
//access Public
export const filterApplies = async (req: Request, res: Response) => {
  const {
    postId,
    providerId,
    customerId,
    status,
    minPrice,
    maxPrice,
    startDate,
    endDate,
  } = req.query;

  interface ApplyFilter {
    postId?: string;
    providerId?: string;
    customerId?: string;
    status?: { $in: string[] };
    appliedPrice?: { $gte?: number; $lte?: number };
    date?: { $gte?: Date; $lte?: Date };
  }

  const filter: ApplyFilter = {};

  try {
    if (postId) {
      filter.postId = postId as string;
    }
    if (providerId) {
      filter.providerId = providerId as string;
    }
    if (customerId) {
      filter.customerId = customerId as string;
    }
    if (status) {
      const statusArray = (status as string).split(',').map((s) => s.trim());
      filter.status = { $in: statusArray };
    }
    if (minPrice || maxPrice) {
      filter.appliedPrice = {};
      if (minPrice) {
        filter.appliedPrice.$gte = Number(minPrice);
      }
      if (maxPrice) {
        filter.appliedPrice.$lte = Number(maxPrice);
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

    const applies = await Apply.find(filter);
    res.status(200).json({ success: true, data: applies });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to filter applies', error });
  }
};

//desc Filter detailed applies with population
//route GET /api/applies/filter/detail
//access Public
export const filterDetailedApplies = async (req: Request, res: Response) => {
  const {
    postId,
    providerId,
    customerId,
    status,
    minPrice,
    maxPrice,
    startDate,
    endDate,
  } = req.query;

  interface ApplyFilter {
    postId?: string;
    providerId?: string;
    customerId?: string;
    status?: { $in: string[] };
    appliedPrice?: { $gte?: number; $lte?: number };
    date?: { $gte?: Date; $lte?: Date };
  }

  const filter: ApplyFilter = {};

  try {
    if (postId) {
      filter.postId = postId as string;
    }
    if (providerId) {
      filter.providerId = providerId as string;
    }
    if (customerId) {
      filter.customerId = customerId as string;
    }
    if (status) {
      const statusArray = (status as string).split(',').map((s) => s.trim());
      filter.status = { $in: statusArray };
    }
    if (minPrice || maxPrice) {
      filter.appliedPrice = {};
      if (minPrice) {
        filter.appliedPrice.$gte = Number(minPrice);
      }
      if (maxPrice) {
        filter.appliedPrice.$lte = Number(maxPrice);
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

    const applies = await Apply.find(filter)
      .populate('post')
      .populate('customer')
      .populate('provider');
    res.status(200).json({ success: true, data: applies });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to filter detailed applies',
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
    // Check if apply exists
    const apply = await Apply.findById(id);
    if (!apply) {
      return res
        .status(404)
        .json({ success: false, message: 'Apply not found' });
    }

    // Soft delete by changing status to 'Deleted'
    const updatedApply = await Apply.findByIdAndUpdate(
      id,
      { status: 'Deleted' },
      { new: true },
    );

    res.status(200).json({
      success: true,
      data: updatedApply,
      message: 'Apply deleted successfully',
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to delete apply', error });
  }
};
