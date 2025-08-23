"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSample = exports.updateSample = exports.addSample = exports.getSampleById = exports.getSamples = void 0;
const Sample_1 = __importDefault(require("../models/Sample"));
const getSamples = async (req, res) => {
    const samples = await Sample_1.default.find();
    res.status(200).json({ success: true, data: samples });
};
exports.getSamples = getSamples;
const getSampleById = async (req, res) => {
    const { id } = req.params;
    const sample = await Sample_1.default.findById(id);
    if (!sample) {
        return res
            .status(404)
            .json({ success: false, message: 'Sample not found' });
    }
    res.status(200).json({ success: true, data: sample });
};
exports.getSampleById = getSampleById;
const addSample = async (req, res) => {
    const newSample = await Sample_1.default.create(req.body);
    if (!newSample) {
        return res
            .status(400)
            .json({ success: false, message: 'Failed to create sample' });
    }
    res.status(200).json({ success: true, data: newSample });
};
exports.addSample = addSample;
const updateSample = async (req, res) => {
    const { id } = req.params;
    const updatedSample = await Sample_1.default.findByIdAndUpdate(id, req.body, {
        new: true,
    });
    if (!updatedSample) {
        return res
            .status(404)
            .json({ success: false, message: 'Sample not found' });
    }
    res.status(200).json({ success: true, data: updatedSample });
};
exports.updateSample = updateSample;
const deleteSample = async (req, res) => {
    const { id } = req.params;
    const deletedSample = await Sample_1.default.findByIdAndDelete(id);
    if (!deletedSample) {
        return res
            .status(404)
            .json({ success: false, message: 'Sample not found' });
    }
    res.status(200).json({ success: true, data: deletedSample });
};
exports.deleteSample = deleteSample;
