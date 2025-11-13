import request from 'supertest';
import express, { Application } from 'express';
import postRouter from '../post/postRoutes';
import userRouter from '../user/userRoutes';
import mongoose from 'mongoose';

const app: Application = express();
app.use(express.json());
app.use('/posts', postRouter);
app.use('/users', userRouter);

let userId: string;
let postId: string;

const postTitle = 'Hiring an exterior house painter';
const postDescription =
  "I'm looking for a skilled painter to repaint my house.";
const postBudget = 500;
const contactNumber = '0123456789';
const performDate = new Date('2025-11-18');
const postCoverPhotoUrl = 'cover1.png';
const postImage1Url = 'image1.png';
const postImage2Url = 'image2.png';
const postImage3Url = 'image3.png';

beforeAll(async () => {
  const mongo_uri = process.env.MONGO_URI_TEST || '';
  await mongoose.connect(mongo_uri);

  const userRes = await request(app).post('/users').send({
    email: 'testuser@test.com',
    password: 'password123',
    name: 'Test User',
    role: 'customer',
  });

  userId = userRes.body.data._id;

  const postRes = await request(app).post('/posts').send({
    customerId: userId,
    title: postTitle,
    description: postDescription,
    budget: postBudget,
    telNumber: contactNumber,
    coverPhotoUrl: postCoverPhotoUrl,
    image1Url: postImage1Url,
    image2Url: postImage2Url,
    image3Url: postImage3Url,
    date: performDate,
  });

  postId = postRes.body.data._id;
});

afterAll(async () => {
  if (mongoose.connection.db) {
    await mongoose.connection.db.dropDatabase();
  }
  await mongoose.disconnect();
});

describe('US4-6: Provider views a post that no match between Customer and Provider', () => {
  it('TC4-1: Provider see the post information', async () => {
    const res = await request(app).get(`/posts/${postId}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe(postTitle);
    expect(res.body.data.budget).toBe(postBudget);
    expect(res.body.data.telNumber).toBe(contactNumber);
    expect(new Date(res.body.data.date)).toEqual(performDate);
    expect(res.body.data.coverPhotoUrl).toBe(postCoverPhotoUrl);
    expect(res.body.data.image1Url).toBe(postImage1Url);
    expect(res.body.data.image2Url).toBe(postImage2Url);
    expect(res.body.data.image3Url).toBe(postImage3Url);

    // This means no match between Customer and Provider
    expect(res.body.data.isMatched).toBe(false);
  });
});
