import { Request, Response } from 'express';

import Service from '../models/Service';

//@desc Create a new service
//@route POST /api/services
//@access Public
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
