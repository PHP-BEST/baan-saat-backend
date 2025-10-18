import { Schema, model, Document } from 'mongoose';
// import { isURL } from 'validator';

interface IPost extends Document {
  customerId: Schema.Types.ObjectId;
  title: string;
  description: string;
  budget: number;
  coverPhotoUrl: string;
  telNumber: string;
  location: string;
  tags: string;
  others: string;
  date: Date;
  paymentSecret: string;
  paymentStatus: string;
  paymentId: string;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema(
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
    coverPhotoUrl: {
      type: String,
      trim: true,
      default: '',
      // validate: {
      //   validator: (value: string) =>
      //     value === '' ||
      //     isURL(value, {
      //       require_protocol: false,
      //       require_host: true,
      //       require_tld: true,
      //       max_allowed_length: 2000,
      //     }),
      //   message: 'Please fill in a valid cover photo URL.',
      // },
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
    location: {
      type: String,
      maxLength: 2000,
      default: '',
    },
    tags: {
      type: String,
      enum: [
        '',
        'houseCleaning',
        'houseRepair',
        'plumbing',
        'electrical',
        'hvac',
        'painting',
        'landscaping',
        'others',
      ],
      default: '',
    },
    others: {
      type: String,
      maxLength: 200,
      default: '',
    },
    date: {
      type: Date,
      required: true,
    },
    paymentSecret: {
      type: String,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'processing', 'succeeded'],
    },
    paymentId: {
      type: String,
    },
  },
  { timestamps: true },
);

PostSchema.pre('save', function (next) {
  if (this.others && this.others.trim() !== '' && this.tags !== 'others') {
    this.others = '';
  }
  next();
});

const Post = model<IPost>('Post', PostSchema);

export default Post;
