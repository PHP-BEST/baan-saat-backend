import express from "express";
import {
  addSample,
  deleteSample,
  getSampleById,
  getSamples,
  updateSample,
} from "../controllers/sample";

const sampleRouter = express.Router();

/**
 * @openapi
 * /samples:
 *   get:
 *     summary: Get all samples
 *     tags:
 *       - Samples
 *     responses:
 *       200:
 *         description: Returns a list of all samples
 */
sampleRouter.get("/", getSamples);

/**
 * @openapi
 * /samples/{id}:
 *   get:
 *     summary: Get a sample by ID
 *     tags:
 *       - Samples
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The sample ID
 *     responses:
 *       200:
 *         description: Returns the sample
 *       404:
 *         description: Sample not found
 */
sampleRouter.get("/:id", getSampleById);

/**
 * @openapi
 * /samples:
 *   post:
 *     summary: Create a new sample
 *     tags:
 *       - Samples
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Returns the created sample
 *       400:
 *         description: Failed to create sample
 */
sampleRouter.post("/", addSample);

/**
 * @openapi
 * /samples/{id}:
 *   put:
 *     summary: Update a sample by ID
 *     tags:
 *       - Samples
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The sample ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Returns the updated sample
 *       404:
 *         description: Sample not found
 */
sampleRouter.put("/:id", updateSample);

/**
 * @openapi
 * /samples/{id}:
 *   delete:
 *     summary: Delete a sample by ID
 *     tags:
 *       - Samples
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The sample ID
 *     responses:
 *       200:
 *         description: Returns the deleted sample
 *       404:
 *         description: Sample not found
 */
sampleRouter.delete("/:id", deleteSample);

export default sampleRouter;
