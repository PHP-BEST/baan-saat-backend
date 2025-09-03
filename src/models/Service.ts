import { Schema, model } from 'mongoose';

const ServiceSchema = new Schema({
  ServiceId: {
    type: String,
    required: true,
    unique: true,
  },
  customerId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    maxLength: 200,
    required: true,
  },
  description: {
    type: String,
    maxLength: 2000,
    default: ''
  },
  budget: {
    type: Number,
    default: 0,
    min: 0,
    max: 99999999.99,
    set: (value: number) => Math.round(value * 100) / 100
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
    default: ''
  },
  tags: [
    {
        type: [String],
        enum: [
            'plumbing', 
            'electrical', 
            'cleaning', 
            'other',
        ],
        default: []
    },
  ],
  date: {
    type: Date,
    required: true
  }
}, { timestamps: true }
);

const Service = model('Service', ServiceSchema);

export default Service;
