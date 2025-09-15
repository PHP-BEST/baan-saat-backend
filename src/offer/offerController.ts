import { Request, Response } from 'express';
import Offer from '../models/Offer';

export const getOffers = async (req: Request, res: Response) => {
  try {
    const offers = await Offer.find();
    res.status(200).json({ success: true, data: offers });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch offers',
      error,
    });
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
    res.status(500).json({
      success: false,
      message: 'Failed to fetch offer',
      error,
    });
  }
};

export const getOffersByCustomerId = async (req: Request, res: Response) => {
  const { customerId } = req.params;
  try {
    const offers = await Offer.find({
      customerId: customerId,
    });

    res.status(200).json({ success: true, data: offers });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch offers', error });
  }
};

export const getOffersByProviderId = async (req: Request, res: Response) => {
  const { providerId } = req.params;
  try {
    const offers = await Offer.find({
      providerId: providerId,
    });
    res.status(200).json({ success: true, data: offers });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch offers', error });
  }
};

export const getDetailedOfferByProviderId = async (
  req: Request,
  res: Response,
) => {
  const { providerId } = req.params;
  try {
    const offers = await Offer.find({ providerId: providerId })
      .populate('service')
      .populate('customer')
      .populate('provider');

    res.status(200).json({ success: true, data: offers });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch offers', error });
  }
};

export const getOffersByServiceId = async (req: Request, res: Response) => {
  const { serviceId } = req.params;
  try {
    const offers = await Offer.find({ serviceId: serviceId });
    res.status(200).json({ success: true, data: offers });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch offers', error });
  }
};

export const checkProviderOfferService = async (
  req: Request,
  res: Response,
) => {
  const { providerId, serviceId } = req.params;

  try {
    const offer = await Offer.findOne({
      providerId: providerId,
      serviceId: serviceId,
    });

    res.status(200).json({
      success: true,
      data: offer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to check provider offer',
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
      .status(400)
      .json({ success: false, message: 'Failed to create offer', error });
  }
};

export const updateOffer = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const offer = await Offer.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!offer) {
      return res
        .status(404)
        .json({ success: false, message: 'Offer not found' });
    }
    res.status(200).json({ success: true, data: offer });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: 'Failed to update offer', error });
  }
};

export const deleteOffer = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const offer = await Offer.findByIdAndDelete(id);
    if (!offer) {
      return res
        .status(404)
        .json({ success: false, message: 'Offer not found' });
    }
    res.status(200).json({
      success: true,
      data: offer,
      message: 'Offer deleted successfully',
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to delete offer', error });
  }
};
