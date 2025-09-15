import { Schema, model } from 'mongoose';

interface IOffer {
  serviceId: Schema.Types.ObjectId;
  providerId: Schema.Types.ObjectId;
  customerId: Schema.Types.ObjectId;
  description?: string;
  offeredPrice?: number;
  date: Date;
  status?: 'Pending' | 'Accepted' | 'Rejected';
}

const OfferSchema = new Schema(
  {
    // งานที่ Customer แปะไว้
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
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
    offeredPrice: {
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
      enum: ['Pending', 'Accepted', 'Rejected'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

OfferSchema.virtual('service', {
  ref: 'Service',
  localField: 'serviceId',
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
