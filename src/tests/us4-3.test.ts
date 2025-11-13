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
});

afterAll(async () => {
  if (mongoose.connection.db) {
    await mongoose.connection.db.dropDatabase();
  }
  await mongoose.disconnect();
});

describe('US4-3: Post Photos', () => {
  it('TC3-1: Post with No Cover Photo and Additional Photos', async () => {
    const postTitle = 'Clean my house';
    const postBudget = 1000;
    const contactNumber = '0123456789';
    const performDate = new Date('2025-11-18');

    const res = await request(app).post('/posts').send({
      customerId: userId,
      title: postTitle,
      budget: postBudget,
      telNumber: contactNumber,
      date: performDate,
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe(postTitle);
    expect(res.body.data.budget).toBe(postBudget);
    expect(res.body.data.telNumber).toBe(contactNumber);
    expect(new Date(res.body.data.date)).toEqual(performDate);
    expect(res.body.data.coverPhotoUrl).toBe('');
    expect(res.body.data.image1Url).toBe('');
    expect(res.body.data.image2Url).toBe('');
    expect(res.body.data.image3Url).toBe('');
  });

  it('TC3-2: Post with Cover Photo and Additional Photos', async () => {
    const postTitle = 'Clean my house';
    const postBudget = 1000;
    const contactNumber = '0123456789';
    const performDate = new Date('2025-11-18');
    const postCoverPhotoUrl = 'cover1.png';
    const postImage1Url = 'image1.png';
    const postImage2Url = 'image2.png';
    const postImage3Url = 'image3.png';

    const res = await request(app).post('/posts').send({
      customerId: userId,
      title: postTitle,
      budget: postBudget,
      telNumber: contactNumber,
      date: performDate,
      coverPhotoUrl: postCoverPhotoUrl,
      image1Url: postImage1Url,
      image2Url: postImage2Url,
      image3Url: postImage3Url,
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe(postTitle);
    expect(res.body.data.budget).toBe(postBudget);
    expect(res.body.data.telNumber).toBe(contactNumber);
    expect(new Date(res.body.data.date)).toEqual(performDate);
    expect(res.body.data.coverPhotoUrl).toBe(postCoverPhotoUrl);
    expect(res.body.data.image1Url).toBe(postImage1Url);
    expect(res.body.data.image2Url).toBe(postImage2Url);
    expect(res.body.data.image3Url).toBe(postImage3Url);
  });

  it('TC3-3: Post with Cover Photo but No Additional Photos', async () => {
    const postTitle = 'Clean my house';
    const postBudget = 1000;
    const contactNumber = '0123456789';
    const performDate = new Date('2025-11-18');
    const postCoverPhotoUrl = 'cover1.png';

    const res = await request(app).post('/posts').send({
      customerId: userId,
      title: postTitle,
      budget: postBudget,
      telNumber: contactNumber,
      date: performDate,
      coverPhotoUrl: postCoverPhotoUrl,
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe(postTitle);
    expect(res.body.data.budget).toBe(postBudget);
    expect(res.body.data.telNumber).toBe(contactNumber);
    expect(new Date(res.body.data.date)).toEqual(performDate);
    expect(res.body.data.coverPhotoUrl).toBe(postCoverPhotoUrl);
    expect(res.body.data.image1Url).toBe('');
    expect(res.body.data.image2Url).toBe('');
    expect(res.body.data.image3Url).toBe('');
  });

  it('TC3-4: Post with No Cover Photo but Have Additional Photos', async () => {
    const postTitle = 'Clean my house';
    const postBudget = 1000;
    const contactNumber = '0123456789';
    const performDate = new Date('2025-11-18');
    const postImage1Url = 'image1.png';
    const postImage2Url = 'image2.png';
    const postImage3Url = 'image3.png';

    const res = await request(app).post('/posts').send({
      customerId: userId,
      title: postTitle,
      budget: postBudget,
      telNumber: contactNumber,
      date: performDate,
      image1Url: postImage1Url,
      image2Url: postImage2Url,
      image3Url: postImage3Url,
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe(postTitle);
    expect(res.body.data.budget).toBe(postBudget);
    expect(res.body.data.telNumber).toBe(contactNumber);
    expect(new Date(res.body.data.date)).toEqual(performDate);
    expect(res.body.data.coverPhotoUrl).toBe('');
    expect(res.body.data.image1Url).toBe(postImage1Url);
    expect(res.body.data.image2Url).toBe(postImage2Url);
    expect(res.body.data.image3Url).toBe(postImage3Url);
  });
});
