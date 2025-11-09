import { Schema, model } from 'mongoose';

interface IOffer {
  postId: Schema.Types.ObjectId;
  providerId: Schema.Types.ObjectId;
  customerId: Schema.Types.ObjectId;
  status?: 'Pending' | 'Accepted' | 'Rejected' | 'Deleted';
}

const OfferSchema = new Schema(
  {
    // Post that the customer want to offer to the provider
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    // Provider who is being offered the job
    providerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Customer who is making the offer
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    description: {
      type: String,
      maxLength: 2000,
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected', 'Deleted'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

OfferSchema.virtual('post', {
  ref: 'Post',
  localField: 'postId',
  foreignField: '_id',
  justOne: true,
});

OfferSchema.virtual('provider', {
  ref: 'User',
  localField: 'providerId',
  foreignField: '_id',
  justOne: true,
});

OfferSchema.virtual('customer', {
  ref: 'User',
  localField: 'customerId',
  foreignField: '_id',
  justOne: true,
});

const Offer = model<IOffer>('Offer', OfferSchema);

export default Offer;
