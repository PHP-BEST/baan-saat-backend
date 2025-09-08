import { Request, Response } from 'express';

import Service from '../models/Service';

//desc Create a new service
//route POST /api/services
//access Public
export const createService = async (req: Request, res: Response) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: 'Failed to create service', error });
  }
};

//desc Get all services
//route GET /api/services
//access Public
export const getServices = async (req: Request, res: Response) => {
  try {
    const services = await Service.find();
    res.status(200).json({ success: true, data: services });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch services', error });
  }
};

//desc Get a service by ID
//route GET /api/services/:id
//access Public
export const getServiceById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const service = await Service.findById(id);
    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: 'Service not found' });
    }
    res.status(200).json({ success: true, data: service });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch service', error });
  }
};

//desc Get services by title keyword
//route GET /api/services/search?title=keyword
//access Public
export const searchServicesByTitle = async (req: Request, res: Response) => {
  const { title } = req.query;
  try {
    const services = await Service.find({
      title: { $regex: title as string, $options: 'i' },
    });
    res.status(200).json({ success: true, data: services });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to search services', error });
  }
};

//desc Get services by budget range
//route GET /api/services/search?minBudget=0&maxBudget=1000
//access Public
export const searchServicesByBudget = async (req: Request, res: Response) => {
  const { minBudget, maxBudget } = req.query;
  try {
    const services = await Service.find({
      budget: {
        $gte: Number(minBudget) || 0,
        $lte: Number(maxBudget) || 99999999.99,
      },
    });
    res.status(200).json({ success: true, data: services });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to search services', error });
  }
};

//desc Get services by tags
//route GET /api/services/search?tags=tag1,tag2
//access Public
export const searchServicesByTags = async (req: Request, res: Response) => {
  const { tags } = req.query;
  try {
    const tagArray = (tags as string).split(',').map((tag) => tag.trim());
    const services = await Service.find({
      tags: { $in: tagArray },
    });
    res.status(200).json({ success: true, data: services });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to search services', error });
  }
};

//@desc Get services by date range
//@route GET /api/services/search?startDate=2023-01-01&endDate=2023-12-31
//@access Public
export const searchServicesByDate = async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;
  try {
    const services = await Service.find({
      date: {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      },
    });
    res.status(200).json({ success: true, data: services });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to search services', error });
  }
};

//@desc Update a service by ID
//@route PUT /api/services/:id
//@access Public
export const updateService = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const service = await Service.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: 'Service not found' });
    }
    res.status(200).json({ success: true, data: service });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: 'Failed to update service', error });
  }
};

//@desc Delete a service by ID
//@route DELETE /api/services/:id
//@access Public
export const deleteService = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const service = await Service.findByIdAndDelete(id);
    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: 'Service not found' });
    }
    res.status(200).json({ success: true, data: service });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to delete service', error });
  }
};
