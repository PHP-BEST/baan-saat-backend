import { Schema, model } from 'mongoose';

interface IApply {
  postId: Schema.Types.ObjectId;
  providerId: Schema.Types.ObjectId;
  customerId: Schema.Types.ObjectId;
  description?: string;
  appliedPrice?: number;
  date: Date;
  status?: 'Pending' | 'Accepted' | 'Rejected' | 'Deleted';
}

const ApplySchema = new Schema(
  {
    // งานที่ Customer แปะไว้
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    // คนเสนอตัวทำงาน
    providerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // คนแปะความต้องการ
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
    appliedPrice: {
      type: Number,
      default: 0,
      min: 0,
      max: 99999999.99,
      validate: {
        validator: (v: number) => /^\d+(\.\d{1,2})?$/.test(String(v)),
        message: 'Budget must have at most 2 decimal places.',
      },
    },
    date: {
      type: Date,
      required: true,
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

ApplySchema.virtual('post', {
  ref: 'Post',
  localField: 'postId',
  foreignField: '_id',
  justOne: true,
});

ApplySchema.virtual('provider', {
  ref: 'User',
  localField: 'providerId',
  foreignField: '_id',
  justOne: true,
});

ApplySchema.virtual('customer', {
  ref: 'User',
  localField: 'customerId',
  foreignField: '_id',
  justOne: true,
});

const Apply = model<IApply>('Apply', ApplySchema);

export default Apply;
