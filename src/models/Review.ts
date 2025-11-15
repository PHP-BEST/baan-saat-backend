import { Schema, model } from 'mongoose';

interface IReview {
  postId: Schema.Types.ObjectId;
  providerId: Schema.Types.ObjectId;
  customerId: Schema.Types.ObjectId;
  description?: string;
  rating: number;
}

const ReviewSchema = new Schema(
  {
    // Post ที่รีวิว
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    // ผู้ให้บริการที่ถูกรีวิว
    providerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // ลูกค้าที่รีวิว
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    description: {
      type: String,
      maxLength: 2000,
      default: '',
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

ReviewSchema.virtual('post', {
  ref: 'Post',
  localField: 'postId',
  foreignField: '_id',
  justOne: true,
});
ReviewSchema.virtual('provider', {
  ref: 'User',
  localField: 'providerId',
  foreignField: '_id',
  justOne: true,
});
ReviewSchema.virtual('customer', {
  ref: 'User',
  localField: 'customerId',
  foreignField: '_id',
  justOne: true,
});

ReviewSchema.index({ postId: 1, customerId: 1 }, { unique: true });

const Review = model<IReview>('Review', ReviewSchema);

export default Review;
