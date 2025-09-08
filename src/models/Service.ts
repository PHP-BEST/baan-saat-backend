import { Schema, model } from 'mongoose';

const ServiceSchema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      maxLength: 200,
      required: true,
    },
    description: {
      type: String,
      maxLength: 2000,
      default: '',
    },
    budget: {
      type: Number,
      default: 0,
      min: 0,
      max: 99999999.99,
      validate: {
        validator: (v: number) => /^\d+(\.\d{1,2})?$/.test(String(v)),
        message: 'Budget must have at most 2 decimal places.',
      },
    },
    telNumber: {
      type: String,
      maxLength: 10,
      validate: {
        validator: (value: string) =>
          value === '' || (/^\d+$/.test(value) && value.startsWith('0')),
        message: 'Please fill in a valid telephone number.',
      },
      default: '',
    },
    location: {
      type: String,
      maxLength: 2000,
      default: '',
    },
    tags: [
      {
        type: String,
        enum: [
          'houseCleaning',
          'houseRepair',
          'plumbing',
          'electrical',
          'hvac',
          'painting',
          'landscaping',
          'others',
        ],
        default: [],
      },
    ],
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

const Service = model('Service', ServiceSchema);

export default Service;
