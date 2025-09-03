import { Schema, model } from 'mongoose';
import { isEmail, isURL } from 'validator';
import { randomUUID } from 'node:crypto';

const ProviderSchema = new Schema({
  title: {
    type: String,
    maxLength: 200,
    default: '',
  },
  skills: [
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
    },
  ],
  description: {
    type: String,
    maxLength: 2000,
    default: '',
  },
});

const UserSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      default: randomUUID,
    },
    role: {
      type: String,
      required: true,
      enum: ['customer', 'provider'],
      default: 'customer',
    },
    name: {
      type: String,
      trim: true,
      maxLength: 150,
      default: '',
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxLength: 254,
      default: '',
      validate: {
        validator: (value: string) => value === '' || isEmail(value),
        message: 'Please fill in a valid email address.',
      },
    },
    avatarUrl: {
      type: String,
      trim: true,
      default: '',
      validate: {
        validator: (value: string) =>
          value === '' ||
          isURL(value, {
            require_protocol: false,
            require_host: true,
            require_tld: true,
            max_allowed_length: 2000,
          }),
        message: 'Please fill in a valid avatar URL.',
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
    address: {
      type: String,
      trim: true,
      maxLength: 2000,
      default: '',
    },
    lastLoginAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    providerProfile: {
      type: ProviderSchema,
    },
  },
  {
    timestamps: true,
  },
);

export default model('User', UserSchema);
