import { Request, Response } from "express";

import Sample from "../models/Sample";

export const getSamples = async (req: Request, res: Response) => {
  const samples = await Sample.find();
  res.status(200).json({ success: true, data: samples });
};

export const getSampleById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const sample = await Sample.findById(id);
  if (!sample) {
    return res
      .status(404)
      .json({ success: false, message: "Sample not found" });
  }
  res.status(200).json({ success: true, data: sample });
};

export const addSample = async (req: Request, res: Response) => {
  const newSample = await Sample.create(req.body);
  if (!newSample) {
    return res
      .status(400)
      .json({ success: false, message: "Failed to create sample" });
  }
  res.status(200).json({ success: true, data: newSample });
};

export const updateSample = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedSample = await Sample.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!updatedSample) {
    return res
      .status(404)
      .json({ success: false, message: "Sample not found" });
  }
  res.status(200).json({ success: true, data: updatedSample });
};

export const deleteSample = async (req: Request, res: Response) => {
  const { id } = req.params;
  const deletedSample = await Sample.findByIdAndDelete(id);
  if (!deletedSample) {
    return res
      .status(404)
      .json({ success: false, message: "Sample not found" });
  }
  res.status(200).json({ success: true, data: deletedSample });
};
