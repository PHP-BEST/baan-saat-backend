import { Router } from 'express';
import {
  addSample,
  deleteSample,
  // deleteAllSamples,
  getSampleById,
  getSamples,
  updateSample,
} from './sampleController';

const router = Router();

/**
 * @openapi
 * /api/samples:
 *   get:
 *     summary: Get all samples
 *     tags:
 *       - Samples
 *     responses:
 *       200:
 *         description: Returns a list of all samples
 */
router.get('/', getSamples);

/**
 * @openapi
 * /api/samples/{id}:
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
router.get('/:id', getSampleById);

/**
 * @openapi
 * /api/samples:
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
router.post('/', addSample);

/**
 * @openapi
 * /api/samples/{id}:
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
router.put('/:id', updateSample);

/**
 * @openapi
 * /api/samples/{id}:
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
router.delete('/:id', deleteSample);

export default router;
