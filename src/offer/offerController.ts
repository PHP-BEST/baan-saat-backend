import { Request, Response } from 'express';
import Offer from '../models/Offer';

export const getOffers = async (req: Request, res: Response) => {
  try {
    const offers = await Offer.find();
    res.status(200).json({ success: true, data: offers });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch offers', error });
  }
};

export const getOfferById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const offer = await Offer.findById(id);
    if (!offer) {
      return res
        .status(404)
        .json({ success: false, message: 'Offer not found' });
    }
    res.status(200).json({ success: true, data: offer });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch offer', error });
  }
};

export const getDetailedOfferById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const offer = await Offer.findById(id)
      .populate('post')
      .populate('provider')
      .populate('customer');
    if (!offer) {
      return res
        .status(404)
        .json({ success: false, message: 'Offer not found' });
    }
    res.status(200).json({ success: true, data: offer });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch offer', error });
  }
};

export const getOffersByProviderId = async (req: Request, res: Response) => {
  const { providerId } = req.params;
  try {
    const offers = await Offer.find({ providerId: providerId });
    res.status(200).json({ success: true, data: offers });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch offers', error });
  }
};

export const getOffersByCustomerId = async (req: Request, res: Response) => {
  const { customerId } = req.params;
  try {
    const offers = await Offer.find({ customerId: customerId });
    res.status(200).json({ success: true, data: offers });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch offers', error });
  }
};

export const getDetailedOffersByProviderId = async (
  req: Request,
  res: Response,
) => {
  const { providerId } = req.params;
  try {
    const offers = await Offer.find({ providerId: providerId })
      .populate('post')
      .populate('provider')
      .populate('customer');
    res.status(200).json({ success: true, data: offers });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch offers', error });
  }
};

export const getDetailedOffersByCustomerId = async (
  req: Request,
  res: Response,
) => {
  const { customerId } = req.params;
  try {
    const offers = await Offer.find({ customerId: customerId })
      .populate('post')
      .populate('provider')
      .populate('customer');
    res.status(200).json({ success: true, data: offers });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch offers', error });
  }
};

export const getOffersByPostId = async (req: Request, res: Response) => {
  const { postId } = req.params;
  try {
    const offers = await Offer.find({ postId: postId });
    res.status(200).json({ success: true, data: offers });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch offers', error });
  }
};

export const getDetailedOffersByPostId = async (
  req: Request,
  res: Response,
) => {
  const { postId } = req.params;
  try {
    const offers = await Offer.find({ postId: postId })
      .populate('post')
      .populate('provider')
      .populate('customer');
    res.status(200).json({ success: true, data: offers });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch offers', error });
  }
};

export const checkPostOfferProvider = async (req: Request, res: Response) => {
  const { postId, providerId } = req.params;
  try {
    const offer = await Offer.findOne({
      postId: postId,
      providerId: providerId,
    });
    res.status(200).json({ success: true, data: offer });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to check offer', error });
  }
};

//desc Filter offers
//route GET /api/offers/filter
//access Public
export const filterOffers = async (req: Request, res: Response) => {
  const { postId, providerId, customerId, status } = req.query;

  interface OfferFilter {
    postId?: string;
    providerId?: string;
    customerId?: string;
    status?: { $in: string[] };
  }

  const filter: OfferFilter = {};

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

    const offers = await Offer.find(filter);
    res.status(200).json({ success: true, data: offers });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to filter offers', error });
  }
};

//desc Filter detailed offers with population
//route GET /api/offers/filter/detail
//access Public
export const filterDetailedOffers = async (req: Request, res: Response) => {
  const { postId, providerId, customerId, status } = req.query;

  interface OfferFilter {
    postId?: string;
    providerId?: string;
    customerId?: string;
    status?: { $in: string[] };
  }

  const filter: OfferFilter = {};

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

    const offers = await Offer.find(filter)
      .populate('post')
      .populate('provider')
      .populate('customer');
    res.status(200).json({ success: true, data: offers });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to filter detailed offers',
      error,
    });
  }
};

export const createOffer = async (req: Request, res: Response) => {
  try {
    const offer = await Offer.create(req.body);
    res.status(201).json({ success: true, data: offer });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to create offer', error });
  }
};

export const updateOffer = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const offer = await Offer.findByIdAndUpdate(id, req.body, { new: true });
    if (!offer) {
      return res
        .status(404)
        .json({ success: false, message: 'Offer not found' });
    }
    res.status(200).json({ success: true, data: offer });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to update offer', error });
  }
};

export const deleteOffer = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    // Check if offer exists
    const offer = await Offer.findById(id);
    if (!offer) {
      return res
        .status(404)
        .json({ success: false, message: 'Offer not found' });
    }

    // Soft delete by changing status to 'Deleted'
    const updatedOffer = await Offer.findByIdAndUpdate(
      id,
      { status: 'Deleted' },
      { new: true },
    );

    res.status(200).json({
      success: true,
      data: updatedOffer,
      message: 'Offer deleted successfully',
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to delete offer', error });
  }
};
