import { Request, Response } from 'express';

import Service from '../models/Service';
import User from '../models/User';

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

// desc Search services
// route GET /api/services/search?query=your_query
// access Public
export const searchServices = async (req: Request, res: Response) => {
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
        { telNumber: { $regex: trimmedQuery, $options: 'i' } },
        { address: { $regex: trimmedQuery, $options: 'i' } },
        { 'providerProfile.title': { $regex: trimmedQuery, $options: 'i' } },
        { 'providerProfile.skills': { $regex: trimmedQuery, $options: 'i' } },
        {
          'providerProfile.description': {
            $regex: trimmedQuery,
            $options: 'i',
          },
        },
      ],
    }).select('_id');

    const userIds = matchingUsers.map((user) => user._id);

    const services = await Service.find({
      $or: [
        { title: { $regex: trimmedQuery, $options: 'i' } },
        { description: { $regex: trimmedQuery, $options: 'i' } },
        { budget: isNaN(Number(trimmedQuery)) ? -1 : Number(trimmedQuery) },
        { location: { $regex: trimmedQuery, $options: 'i' } },
        { telNumber: { $regex: trimmedQuery, $options: 'i' } },
        { tags: { $regex: trimmedQuery, $options: 'i' } },
        { customerId: { $in: userIds } },
      ],
    }).populate(
      'customerId',
      'name email telNumber address role providerProfile',
    );

    res.status(200).json({ success: true, data: services });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to search services', error });
  }
};

//desc Filter services
//route GET /api/services/filter
//access Public
export const filterServices = async (req: Request, res: Response) => {
  const { title, tags, minBudget, maxBudget, startDate, endDate } = req.query;

  interface ServiceFilter {
    title?: { $regex: string; $options: string };
    tags?: { $all: string[] };
    budget?: { $gte?: number; $lte?: number };
    date?: { $gte?: Date; $lte?: Date };
  }

  const filter: ServiceFilter = {};

  try {
    if (title) {
      filter.title = { $regex: title as string, $options: 'i' };
    }
    if (tags) {
      const tagsArray = (tags as string).split(',').map((tag) => tag.trim());
      filter.tags = { $all: tagsArray };
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

    const services = await Service.find(filter);
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
    await service.validate();
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
    res.status(200).json({
      success: true,
      data: service,
      message: 'Service deleted successfully',
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to delete service', error });
  }
};

// export const deleteAllServices = async (req: Request, res: Response) => {
//   try {
//     await Service.deleteMany({});
//     res.status(200).json({ success: true, message: 'All services deleted' });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ success: false, message: 'Failed to delete services', error });
//   }
// };
