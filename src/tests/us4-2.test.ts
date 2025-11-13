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

const postTitle = 'Clean my house';
const postDescription = 'My house is dirty.';
const postBudget = 1000;
const contactNumber = '0123456789';
const performDate = new Date('2025-11-18');

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

describe('US4-2: Post Description', () => {
  it('TC2-1: Filled Description', async () => {
    const res = await request(app).post('/posts').send({
      customerId: userId,
      title: postTitle,
      description: postDescription,
      budget: postBudget,
      telNumber: contactNumber,
      date: performDate,
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe(postTitle);
    expect(res.body.data.description).toBe(postDescription);
    expect(res.body.data.budget).toBe(postBudget);
    expect(res.body.data.telNumber).toBe(contactNumber);
    expect(new Date(res.body.data.date)).toEqual(performDate);
  });

  it('TC2-2: No Description', async () => {
    const postDescription = '';
    const res = await request(app).post('/posts').send({
      customerId: userId,
      title: postTitle,
      description: postDescription,
      budget: postBudget,
      telNumber: contactNumber,
      date: performDate,
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe(postTitle);
    expect(res.body.data.description).toBe(postDescription);
    expect(res.body.data.budget).toBe(postBudget);
    expect(res.body.data.telNumber).toBe(contactNumber);
    expect(new Date(res.body.data.date)).toEqual(performDate);
  });
});
