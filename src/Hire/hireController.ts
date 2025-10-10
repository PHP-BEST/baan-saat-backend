import { Request, Response } from 'express';
import Hire from '../models/Hire';

export const getHires = async (req: Request, res: Response) => {
  try {
    const hires = await Hire.find();
    res.status(200).json({
      success: true,
      data: hires,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch Hire',
      error,
    });
  }
};
export const getHireById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const hire = await Hire.findById(id);
    if (!hire) {
      return res.status(404).json({
        success: false,
        message: 'Hire not found',
      });
    }
    res.status(200).json({
      success: true,
      data: hire,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hire',
      error,
    });
  }
};
export const getHiresByCustomerId = async (req: Request, res: Response) => {
  const { customerId } = req.params;
  try {
    const hires = await Hire.find({ customerId: customerId });
    res.status(200).json({
      success: true,
      data: hires,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hires',
      error,
    });
  }
};
export const getHiresByProviderId = async (req: Request, res: Response) => {
  const { providerId } = req.params;
  try {
    const hires = await Hire.find({ providerId: providerId });
    res.status(200).json({
      success: true,
      data: hires,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hire',
      error,
    });
  }
};
export const getHiresByPostId = async (req: Request, res: Response) => {
  const { postId } = req.params;
  try {
    const hires = await Hire.find({ postId: postId });
    res.status(200).json({
      success: true,
      data: hires,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hires',
      error,
    });
  }
};
export const createHire = async (req: Request, res: Response) => {
  try {
    const hire = Hire.create(req.body);
    res.status(201).json({
      success: true,
      data: hire,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create hire',
      error,
    });
  }
};
export const updateHire = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const hire = await Hire.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!hire) {
      return res.status(404).json({
        success: false,
        message: 'Hire not found',
      });
    }
    res.status(200).json({
      success: true,
      data: hire,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update hire',
      error,
    });
  }
};
export const deleteHire = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const hire = await Hire.findByIdAndDelete(id);
    if (!hire) {
      return res.status(404).json({
        success: false,
        message: 'Hire not found',
      });
    }
    res.status(200).json({
      success: true,
      data: hire,
      message: 'Hire deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete hire',
      error,
    });
  }
};
