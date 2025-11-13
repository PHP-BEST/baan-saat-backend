// Test API using for create post
// POST /posts

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

describe('US4-1: Create Post', () => {
  it('TC1-1: Create Normal Post', async () => {
    const postTitle = 'Clean my house';
    const postTag = 'houseCleaning';
    const postBudget = 1000;
    const location = 'home';
    const contactNumber = '0123456789';
    const performDate = new Date('2025-11-18');

    const res = await request(app).post('/posts').send({
      customerId: userId,
      title: postTitle,
      tag: postTag,
      budget: postBudget,
      location: location,
      telNumber: contactNumber,
      date: performDate,
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe(postTitle);
    expect(res.body.data.tag).toBe(postTag);
    expect(res.body.data.budget).toBe(postBudget);
    expect(res.body.data.location).toBe(location);
    expect(res.body.data.telNumber).toBe(contactNumber);
    expect(new Date(res.body.data.date)).toEqual(performDate);
  });

  it('TC1-2.1: Create Post with No tag and No location', async () => {
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
    expect(res.body.data.tag).toBe('');
    expect(res.body.data.budget).toBe(postBudget);
    expect(res.body.data.location).toBe('');
    expect(res.body.data.telNumber).toBe(contactNumber);
    expect(new Date(res.body.data.date)).toEqual(performDate);
  });

  it('TC1-2.2: Create Post with No tag but with location', async () => {
    const postTitle = 'Clean my house';
    const postBudget = 1000;
    const location = 'home';
    const contactNumber = '0123456789';
    const performDate = new Date('2025-11-18');

    const res = await request(app).post('/posts').send({
      customerId: userId,
      title: postTitle,
      budget: postBudget,
      location: location,
      telNumber: contactNumber,
      date: performDate,
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe(postTitle);
    expect(res.body.data.tag).toBe('');
    expect(res.body.data.budget).toBe(postBudget);
    expect(res.body.data.location).toBe(location);
    expect(res.body.data.telNumber).toBe(contactNumber);
    expect(new Date(res.body.data.date)).toEqual(performDate);
  });

  it('TC1-2.3: Create Post with tag but no location', async () => {
    const postTitle = 'Clean my house';
    const postTag = 'houseCleaning';
    const postBudget = 1000;
    const contactNumber = '0123456789';
    const performDate = new Date('2025-11-18');

    const res = await request(app).post('/posts').send({
      customerId: userId,
      title: postTitle,
      budget: postBudget,
      tag: postTag,
      telNumber: contactNumber,
      date: performDate,
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe(postTitle);
    expect(res.body.data.tag).toBe(postTag);
    expect(res.body.data.budget).toBe(postBudget);
    expect(res.body.data.location).toBe('');
    expect(res.body.data.telNumber).toBe(contactNumber);
    expect(new Date(res.body.data.date)).toEqual(performDate);
  });

  it('TC1-3.1: Create Post with No title', async () => {
    const postTag = 'houseCleaning';
    const postBudget = 1000;
    const location = 'home';
    const contactNumber = '0123456789';
    const performDate = new Date('2025-11-18');

    const res = await request(app).post('/posts').send({
      customerId: userId,
      tag: postTag,
      budget: postBudget,
      location: location,
      telNumber: contactNumber,
      date: performDate,
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('TC1-3.2: Create Post with Empty title', async () => {
    const postTitle = '';
    const postTag = 'houseCleaning';
    const postBudget = 1000;
    const location = 'home';
    const contactNumber = '0123456789';
    const performDate = new Date('2025-11-18');

    const res = await request(app).post('/posts').send({
      customerId: userId,
      title: postTitle,
      tag: postTag,
      budget: postBudget,
      location: location,
      telNumber: contactNumber,
      date: performDate,
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('TC1-4.1: Create Post with 0 budget', async () => {
    const postTitle = 'Clean my house';
    const postTag = 'houseCleaning';
    const postBudget = 0;
    const location = 'home';
    const contactNumber = '0123456789';
    const performDate = new Date('2025-11-18');

    const res = await request(app).post('/posts').send({
      customerId: userId,
      title: postTitle,
      tag: postTag,
      budget: postBudget,
      location: location,
      telNumber: contactNumber,
      date: performDate,
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('TC1-4.2: Create Post with positive budget', async () => {
    const postTitle = 'Clean my house';
    const postTag = 'houseCleaning';
    const postBudget = 100;
    const location = 'home';
    const contactNumber = '0123456789';
    const performDate = new Date('2025-11-18');

    const res = await request(app).post('/posts').send({
      customerId: userId,
      title: postTitle,
      tag: postTag,
      budget: postBudget,
      location: location,
      telNumber: contactNumber,
      date: performDate,
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe(postTitle);
    expect(res.body.data.tag).toBe(postTag);
    expect(res.body.data.budget).toBe(postBudget);
    expect(res.body.data.location).toBe(location);
    expect(res.body.data.telNumber).toBe(contactNumber);
    expect(new Date(res.body.data.date)).toEqual(performDate);
  });

  it('TC1-5.1: Create Post with Contact number not 9 or 10 digits', async () => {
    const postTitle = 'Clean my house';
    const postTag = 'houseCleaning';
    const postBudget = 1000;
    const location = 'home';
    const contactNumber = '01234567';
    const performDate = new Date('2025-11-18');

    const res = await request(app).post('/posts').send({
      customerId: userId,
      title: postTitle,
      tag: postTag,
      budget: postBudget,
      location: location,
      telNumber: contactNumber,
      date: performDate,
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('TC1-5.2: Create Post with 9-digit contact number', async () => {
    const postTitle = 'Clean my house';
    const postTag = 'houseCleaning';
    const postBudget = 1000;
    const location = 'home';
    const contactNumber = '012345678';
    const performDate = new Date('2025-11-18');

    const res = await request(app).post('/posts').send({
      customerId: userId,
      title: postTitle,
      tag: postTag,
      budget: postBudget,
      location: location,
      telNumber: contactNumber,
      date: performDate,
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.telNumber).toBe(contactNumber);
  });

  it('TC1-5.3: Create Post with 10-digit contact number', async () => {
    const postTitle = 'Clean my house';
    const postTag = 'houseCleaning';
    const postBudget = 1000;
    const location = 'home';
    const contactNumber = '0123456789';
    const performDate = new Date('2025-11-18');

    const res = await request(app).post('/posts').send({
      customerId: userId,
      title: postTitle,
      tag: postTag,
      budget: postBudget,
      location: location,
      telNumber: contactNumber,
      date: performDate,
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.telNumber).toBe(contactNumber);
  });

  it('TC1-6: Create Post with No Contact number', async () => {
    const postTitle = 'Clean my house';
    const postTag = 'houseCleaning';
    const postBudget = 1000;
    const location = 'home';
    const performDate = new Date('2025-11-18');

    const res = await request(app).post('/posts').send({
      customerId: userId,
      title: postTitle,
      tag: postTag,
      budget: postBudget,
      location: location,
      date: performDate,
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('TC1-7.1: Create Post with Invalid Contact number', async () => {
    const postTitle = 'Clean my house';
    const postTag = 'houseCleaning';
    const postBudget = 1000;
    const location = 'home';
    const contactNumber = '01234valid';
    const performDate = new Date('2025-11-18');

    const res = await request(app).post('/posts').send({
      customerId: userId,
      title: postTitle,
      tag: postTag,
      budget: postBudget,
      location: location,
      telNumber: contactNumber,
      date: performDate,
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('TC1-7.2: Create Post with Contact number too long (11 digits)', async () => {
    const postTitle = 'Clean my house';
    const postTag = 'houseCleaning';
    const postBudget = 1000;
    const location = 'home';
    const contactNumber = '01234567890';
    const performDate = new Date('2025-11-18');

    const res = await request(app).post('/posts').send({
      customerId: userId,
      title: postTitle,
      tag: postTag,
      budget: postBudget,
      location: location,
      telNumber: contactNumber,
      date: performDate,
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('TC1-8: Create Post with No Perform date', async () => {
    const postTitle = 'Clean my house';
    const postTag = 'houseCleaning';
    const postBudget = 1000;
    const location = 'home';
    const contactNumber = '0123456789';

    const res = await request(app).post('/posts').send({
      customerId: userId,
      title: postTitle,
      tag: postTag,
      budget: postBudget,
      location: location,
      telNumber: contactNumber,
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
