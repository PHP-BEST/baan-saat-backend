import express from 'express';
import * as o from './offerController';

const offerRouter = express.Router();

/**
 * @openapi
 * /api/offers:
 *  get:
 *   summary: Get all offers
 *   tags:
 *    - Offers
 *   responses:
 *     200:
 *      description: Returns a list of all offers
 *     500:
 *      description: Failed to fetch offers
 */
offerRouter.get('/', o.getOffers);

offerRouter.get('/:id', o.getOfferById);

offerRouter.get('/:id/detail', o.getDetailedOfferById);

offerRouter.get('/provider/:providerId', o.getOffersByProviderId);

offerRouter.get('/customer/:customerId', o.getOffersByCustomerId);

offerRouter.get(
  '/provider/:providerId/detail',
  o.getDetailedOffersByProviderId,
);

offerRouter.get(
  '/customer/:customerId/detail',
  o.getDetailedOffersByCustomerId,
);

offerRouter.get('/post/:postId', o.getOffersByPostId);

offerRouter.get('/post/:postId/detail', o.getDetailedOffersByPostId);

offerRouter.get('/check/:postId/:providerId', o.checkPostOfferProvider);

offerRouter.post('/', o.createOffer);

offerRouter.put('/:id', o.updateOffer);

offerRouter.delete('/:id', o.deleteOffer);

export default offerRouter;
