import express from 'express';
import {
  createService,
  getServices,
  getServiceById,
  searchServices,
  updateService,
  deleteService,
} from '../controllers/service';

const serviceRouter = express.Router();

/**
 * @openapi
 * /services:
 *   get:
 *     summary: Get all services
 *     tags:
 *       - Services
 *     responses:
 *       200:
 *         description: Returns a list of all services
 *       500:
 *        description: Failed to fetch services
 */
serviceRouter.get('/', getServices);

/**
 * @openapi
 * /services/{id}:
 *   get:
 *     summary: Get a service by ID
 *     tags:
 *       - Services
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The service ID
 *     responses:
 *       200:
 *         description: Returns the service
 *       404:
 *         description: Service not found
 *       500:
 *         description: Failed to fetch service
 */
serviceRouter.get('/:id', getServiceById);

/**
 * @openapi
 * /services/search:
 *   get:
 *     summary: Search services
 *     tags:
 *       - Services
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Title to search for (partial match)
 *       - in: query
 *         name: tags
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               - houseCleaning
 *               - houseRepair
 *               - plumbing
 *               - electrical
 *               - hvac
 *               - painting
 *               - landscaping
 *               - others
 *         description: Tags to filter by (exact match)
 *       - in: query
 *         name: minBudget
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Minimum budget to filter by
 *       - in: query
 *         name: maxBudget
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Maximum budget to filter by
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start date to filter by (inclusive)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End date to filter by (inclusive)
 *     responses:
 *       200:
 *         description: Returns a list of services matching the search criteria
 *       500:
 *         description: Failed to fetch services
 */
serviceRouter.get('/search', searchServices);

/**
 * @openapi
 * /services:
 *   post:
 *     summary: Create a new service
 *     tags:
 *       - Services
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerId
 *               - title
 *               - date
 *             properties:
 *               customerId:
 *                 type: string
 *                 description: The ID of the customer creating the service
 *                 example: 64a7b2f5e4b0c8a1d2f3g4h5
 *               title:
 *                 type: string
 *                 maxLength: 200
 *                 example: House Cleaning
 *               description:
 *                 type: string
 *                 maxLength: 2000
 *                 default: ''
 *                 example: I want my house cleaned thoroughly.
 *               budget:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 99999999.99
 *                 default: 0
 *                 example: 555.55
 *               telNumber:
 *                 type: string
 *                 description: Must be 10 digits and start with '0' or be empty string
 *                 maxLength: 10
 *                 default: ''
 *                 example: '0123456789'
 *               location:
 *                 type: string
 *                 maxLength: 2000
 *                 default: ''
 *                 example: 123 Main St, City, Country
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum:
 *                     - houseCleaning
 *                     - houseRepair
 *                     - plumbing
 *                     - electrical
 *                     - hvac
 *                     - painting
 *                     - landscaping
 *                     - others
 *                 default: []
 *                 example: ['houseCleaning', 'plumbing']
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-07-01T10:00:00Z
 *     responses:
 *       201:
 *         description: Returns the created service
 *       400:
 *         description: Failed to create service
 */
serviceRouter.post('/', createService);

/**
 * @openapi
 * /services/{id}:
 *   put:
 *     summary: Update a service by ID
 *     tags:
 *       - Services
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The service ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 200
 *                 example: Updated Service Title
 *               description:
 *                 type: string
 *                 maxLength: 2000
 *                 example: Updated description of the service.
 *               budget:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 99999999.99
 *                 example: 750.75
 *               telNumber:
 *                 type: string
 *                 description: Must be 10 digits and start with '0' or be empty string
 *                 example: 0987654321, ''
 *               location:
 *                 type: string
 *                 maxLength: 2000
 *                 example: 456 Another St, City, Country
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum:
 *                     - houseCleaning
 *                     - houseRepair
 *                     - plumbing
 *                     - electrical
 *                     - hvac
 *                     - painting
 *                     - landscaping
 *                     - others
 *                 example: ['electrical', 'hvac']
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-08-01T14:00:00Z
 *     responses:
 *       200:
 *         description: Returns the updated service
 *       400:
 *         description: Failed to update service
 *       404:
 *         description: Service not found
 */
serviceRouter.put('/:id', updateService);

/**
 * @openapi
 * /services/{id}:
 *   delete:
 *     summary: Delete a service by ID
 *     tags:
 *       - Services
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The service ID
 *     responses:
 *       200:
 *         description: Returns the deleted service
 *       404:
 *         description: Service not found
 *       500:
 *         description: Failed to delete service
 */
serviceRouter.delete('/:id', deleteService);

export default serviceRouter;
