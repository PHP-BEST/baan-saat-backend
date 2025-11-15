import request from 'supertest';
import express, { Application } from 'express';
import mongoose from 'mongoose';
import User from '../models/User';
import Post from '../models/Post';
import { filterPosts } from '../post/filterPost';

const app: Application = express();
app.use(express.json());
app.get('/filter', filterPosts);

let userId: string;
let userId2: string;

beforeAll(async () => {
  const mongo_uri = process.env.MONGO_URI_TEST || '';

  try {
    await mongoose.connect(mongo_uri, {
      serverSelectionTimeoutMS: 10000,
    });

    const user1 = await User.create({
      email: 'testuser@test.com',
      name: 'Test User',
      role: 'customer',
    });
    userId = user1._id.toString();

    const user2 = await User.create({
      email: 'testuser2@test.com',
      name: 'Test User 2',
      role: 'customer',
    });
    userId2 = user2._id.toString();

    await Post.create([
      {
        customerId: userId,
        title: 'House Cleaning Service',
        description: 'Need thorough cleaning',
        budget: 1500,
        tag: 'houseCleaning',
        telNumber: '0123456789',
        date: new Date('2025-11-20'),
        isMatched: false,
        status: 'Not working',
      },
      {
        customerId: userId,
        title: 'Plumbing Repair',
        description: 'Fix leaking pipes',
        budget: 800,
        tag: 'plumbing',
        telNumber: '0987654321',
        date: new Date('2025-11-25'),
        isMatched: true,
        status: 'In progress',
      },
      {
        customerId: userId2,
        title: 'Electrical Work',
        description: 'Install new outlets',
        budget: 2500,
        tag: 'electrical',
        telNumber: '0111222333',
        date: new Date('2025-12-01'),
        isMatched: false,
        status: 'Completed',
      },
      {
        customerId: userId,
        title: 'Custom Carpentry',
        description: 'Build custom shelves',
        budget: 3000,
        tag: 'others',
        others: 'Carpentry',
        telNumber: '0444555666',
        date: new Date('2025-12-10'),
        isMatched: false,
        status: 'Not working',
      },
      {
        customerId: userId,
        title: 'Garden Maintenance',
        description: 'Trim hedges and mow lawn',
        budget: 500,
        tag: 'landscaping',
        telNumber: '0777888999',
        date: new Date('2025-11-15'),
        isMatched: false,
        status: 'Deleted',
      },
    ]);
  } catch (error) {
    console.error('Error in beforeAll:', error);
    throw error;
  }
}, 30000);

afterAll(async () => {
  try {
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error in afterAll:', error);
    throw error;
  }
}, 30000);

describe('filterPosts', () => {
  it('TC1: Filter by userId only', async () => {
    const res = await request(app).get('/filter').query({ userId });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(4);
  });

  it('TC2: Filter by title only', async () => {
    const res = await request(app).get('/filter').query({ title: 'Cleaning' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].title).toContain('Cleaning');
  });

  it('TC3: Filter by tags only (without others)', async () => {
    const res = await request(app)
      .get('/filter')
      .query({ tags: 'houseCleaning,plumbing' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(2);
  });

  it('TC4: Filter by tags with others included', async () => {
    const res = await request(app).get('/filter').query({
      tags: 'others,houseCleaning',
      others: 'Carpentry',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(2);
  });

  it('TC5: Filter by minBudget only', async () => {
    const res = await request(app).get('/filter').query({ minBudget: '2000' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(2);
    res.body.data.forEach((post: any) => {
      expect(post.budget).toBeGreaterThanOrEqual(2000);
    });
  });

  it('TC6: Filter by maxBudget only', async () => {
    const res = await request(app).get('/filter').query({ maxBudget: '1000' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(2);
    res.body.data.forEach((post: any) => {
      expect(post.budget).toBeLessThanOrEqual(1000);
    });
  });

  it('TC7: Filter by minBudget and maxBudget', async () => {
    const res = await request(app).get('/filter').query({
      minBudget: '1000',
      maxBudget: '2000',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    res.body.data.forEach((post: any) => {
      expect(post.budget).toBeGreaterThanOrEqual(1000);
      expect(post.budget).toBeLessThanOrEqual(2000);
    });
  });

  it('TC8: Filter by startDate only', async () => {
    const res = await request(app)
      .get('/filter')
      .query({ startDate: '2025-11-25T00:00:00Z' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(3);
  });

  it('TC9: Filter by endDate only', async () => {
    const res = await request(app)
      .get('/filter')
      .query({ endDate: '2025-11-25T23:59:59Z' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(3);
  });

  it('TC10: Filter by startDate and endDate', async () => {
    const res = await request(app).get('/filter').query({
      startDate: '2025-11-20T00:00:00Z',
      endDate: '2025-12-01T23:59:59Z',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(3);
  });

  it('TC11: Filter by isMatched = true', async () => {
    const res = await request(app).get('/filter').query({ isMatched: 'true' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].isMatched).toBe(true);
  });

  it('TC12: Filter by isMatched = false', async () => {
    const res = await request(app).get('/filter').query({ isMatched: 'false' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(4);
    res.body.data.forEach((post: any) => {
      expect(post.isMatched).toBe(false);
    });
  });

  it('TC13: Filter by single status', async () => {
    const res = await request(app)
      .get('/filter')
      .query({ status: 'In progress' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].status).toBe('In progress');
  });

  it('TC14: Filter by multiple statuses', async () => {
    const res = await request(app)
      .get('/filter')
      .query({ status: 'Not working,Completed' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(3);
  });

  it('TC15: Filter with multiple criteria combined', async () => {
    const res = await request(app).get('/filter').query({
      userId: userId,
      title: 'House',
      minBudget: '1000',
      maxBudget: '2000',
      isMatched: 'false',
      status: 'Not working',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(1);
  });

  it('TC16: Filter with no matching results', async () => {
    const res = await request(app).get('/filter').query({
      title: 'NonExistentTitle',
      minBudget: '10000',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(0);
  });

  it('TC17: Filter with no query parameters', async () => {
    const res = await request(app).get('/filter');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(5);
  });

  it('TC18: Filter by tags with others when others param exists', async () => {
    const res = await request(app).get('/filter').query({
      tags: 'others',
      others: 'Carpentry',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    const carpentryPost = res.body.data.find(
      (p: any) => p.others === 'Carpentry',
    );
    expect(carpentryPost).toBeDefined();
  });

  it('TC19: Filter by multiple tags including others', async () => {
    const res = await request(app).get('/filter').query({
      tags: 'others,houseCleaning,plumbing',
      others: 'Carpentry',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(3);
  });

  it('TC20: Filter with all possible parameters', async () => {
    const res = await request(app).get('/filter').query({
      userId: userId,
      title: 'Cleaning',
      tags: 'houseCleaning',
      minBudget: '1000',
      maxBudget: '2000',
      startDate: '2025-11-15T00:00:00Z',
      endDate: '2025-11-25T23:59:59Z',
      isMatched: 'false',
      status: 'Not working',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('TC21: Filter by userId with different user', async () => {
    const res = await request(app).get('/filter').query({ userId: userId2 });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].customerId.toString()).toBe(userId2);
  });

  it('TC22: Filter with multiple non-others tags', async () => {
    const res = await request(app)
      .get('/filter')
      .query({ tags: 'houseCleaning,plumbing,electrical' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(3);
  });

  it('TC23: Filter by tags=others without others parameter', async () => {
    const res = await request(app).get('/filter').query({ tags: 'others' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('TC24: Error handling', async () => {
    const originalFind = Post.find;
    Post.find = jest.fn().mockImplementationOnce(() => {
      throw new Error('Database error');
    });

    const res = await request(app).get('/filter').query({ userId });

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Failed to search posts');
    Post.find = originalFind;
  });

  it('TC25: Filter with empty string parameters', async () => {
    const res = await request(app).get('/filter').query({
      title: '',
      tags: '',
      others: '',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('TC26: Filter by exact budget boundaries', async () => {
    const res = await request(app).get('/filter').query({
      minBudget: '1500',
      maxBudget: '1500',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    res.body.data.forEach((post: any) => {
      expect(post.budget).toBe(1500);
    });
  });

  it('TC27: Filter by exact date match', async () => {
    const res = await request(app).get('/filter').query({
      startDate: '2025-11-20T00:00:00Z',
      endDate: '2025-11-20T00:00:00Z',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('TC28: Filter by all status values', async () => {
    const res = await request(app).get('/filter').query({
      status: 'Not working,In progress,Completed,Deleted',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(5);
  });
});
