import { Schema, model, Document } from 'mongoose';

export interface IPostPayment extends Document {
  postId: string;
  paymentId: string;
  paymentSecret: string;
  paymentStatus: 'pending' | 'processing' | 'succeeded';
  createdAt?: Date;
  updatedAt?: Date;
}

const PostPaymentSchema = new Schema<IPostPayment>(
  {
    postId: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
    },
    paymentSecret: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'processing', 'succeeded'],
      required: true,
    },
  },
  { timestamps: true },
);

const PostPayment = model<IPostPayment>('PostPayment', PostPaymentSchema);

export default PostPayment;
