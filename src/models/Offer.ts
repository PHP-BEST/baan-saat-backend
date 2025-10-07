import { Schema, model } from 'mongoose';

interface IOffer {
  postId: Schema.Types.ObjectId;
  customerId: Schema.Types.ObjectId;
  providerId: Schema.Types.ObjectId;
  description?: string;
  OfferedPrice?: number;
  date: Date;
}

const OfferSchema = new Schema({
  postId: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  customerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  providerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  description: {
    type: String,
    maxLength: 2000,
    default: '',
  },
  OfferedPrice: {
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
    required: true
  }
},
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

export default model<IOffer>('Offer', OfferSchema);