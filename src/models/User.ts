import { Schema, model } from 'mongoose';
import { isEmail, isURL } from 'validator';

export interface IProvider {
  title?: string;
  skills?: Array<
    | 'houseCleaning'
    | 'houseRepair'
    | 'plumbing'
    | 'electrical'
    | 'hvac'
    | 'painting'
    | 'landscaping'
    | 'others'
  >;
  description?: string;
}

export interface IUser {
  role: 'customer' | 'provider';
  name?: string;
  email?: string;
  avatarUrl?: string;
  telNumber?: string;
  address?: string;
  lastLoginAt?: Date;
  providerProfile?: IProvider | null;
}

type UserDoc = Document & IUser;

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
      validate: {
        validator: function (
          this: UserDoc,
          value: IProvider | null | undefined,
        ): boolean {
          if (value == null) return true;
          return this.role === 'provider';
        },
        message: 'providerProfile can only be set when role is "provider".',
      },
      default: function (this: UserDoc): IProvider | undefined {
        return this.role === 'provider' ? ({} as IProvider) : undefined;
      },
    },
  },
  {
    timestamps: true,
  },
);

export default model('User', UserSchema);
