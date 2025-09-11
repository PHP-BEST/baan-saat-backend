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
      minLength: 9,
      maxLength: 10,
      default: '000000000',
      validate: (value: string) => {
        if (value === null) return false;
        const s = String(value).trim();
        return /^(0\d{8,9}|)$/.test(s);
      },
      message: 'Please fill in a valid telephone number.',
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
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  },
);

export default model('User', UserSchema);
