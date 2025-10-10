import { Schema, model } from 'mongoose';

interface IHire {
  postId: Schema.Types.ObjectId;
  providerId: Schema.Types.ObjectId;
  customerId: Schema.Types.ObjectId;
  Price?: number;
  status?: 'Pending' | 'Ongoing' | 'Done' | 'Cancelled';
}

const HireSchema = new Schema(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    providerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    Price: {
      type: Number,
      default: 0,
      min: 0,
      max: 99999999.99,
      validate: {
        validator: (v: number) => /^\d+(\.\d{1,2})?$/.test(String(v)),
        message: 'Budget must have at most 2 decimal places.',
      },
    },
    status: {
      type: String,
      enum: ['Pending', 'Ongoing', 'Done', 'Cancelled'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

HireSchema.virtual('post', {
  ref: 'Post',
  localField: 'postId',
  foreignField: '_id',
  justOne: true,
});

HireSchema.virtual('provider', {
  ref: 'User',
  localField: 'providerId',
  foreignField: '_id',
  justOne: true,
});

HireSchema.virtual('customer', {
  ref: 'User',
  localField: 'customerId',
  foreignField: '_id',
  justOne: true,
});
//price from post
HireSchema.virtual('price', {
  ref: 'Post',
  localField: 'postId',
  foreignField: '_id',
  justOne: true,
  options: { select: 'price' },
});
const Hire = model<IHire>('Hire', HireSchema);

export default Hire;
