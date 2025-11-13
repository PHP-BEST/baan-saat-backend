import { Schema, model, Document } from 'mongoose';

interface IPost extends Document {
  customerId: Schema.Types.ObjectId;
  title: string;
  description: string;
  budget: number;
  coverPhotoUrl: string;
  image1Url: string;
  image2Url: string;
  image3Url: string;
  telNumber: string;
  location: string;
  tag: string;
  others: string;
  status: string;
  isMatched: boolean;
  date: Date;
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
      min: 1,
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
    },
    image1Url: {
      type: String,
      trim: true,
      default: '',
    },
    image2Url: {
      type: String,
      trim: true,
      default: '',
    },
    image3Url: {
      type: String,
      trim: true,
      default: '',
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
    tag: {
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
    status: {
      type: String,
      enum: ['Not working', 'In progress', 'Completed', 'Deleted'],
      default: 'Not working',
    },
    isMatched: {
      type: Boolean,
      default: false,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

PostSchema.pre('save', function (next) {
  if (this.others && this.others.trim() !== '' && this.tag !== 'others') {
    this.others = '';
  }
  next();
});

const Post = model<IPost>('Post', PostSchema);

export default Post;
