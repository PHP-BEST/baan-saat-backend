import request from 'supertest';
import express, { Application } from 'express';
import postRouter from '../post/postRoutes';
import userRouter from '../user/userRoutes';
import mongoose from 'mongoose';

// Set up Express app for testing
const app: Application = express();
app.use(express.json());
app.use('/posts', postRouter);
app.use('/users', userRouter);

beforeAll(async () => {
  const mongo_uri = process.env.MONGO_URI_TEST || '';
  await mongoose.connect(mongo_uri);
});

afterAll(async () => {
  if (mongoose.connection.db) {
    await mongoose.connection.db.dropDatabase();
  }
  await mongoose.disconnect();
});

describe('Testing Post API...', () => {
  let firstPostId: string;
  let secondPostId: string;
  let user1_id: string;
  let user2_id: string;

  it('Add user', async () => {
    const res1 = await request(app).post('/users').send({ name: 'User 1' });
    user1_id = res1.body.data._id;

    const res2 = await request(app).post('/users').send({ name: 'User 2' });
    user2_id = res2.body.data._id;
  });

  it('Get all posts', async () => {
    const res = await request(app).get('/posts');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(0);
  });

  it('Add the first post', async () => {
    const title = 'Basic Post 1';
    const res = await request(app)
      .post('/posts')
      .send({
        title: title,
        customerId: user1_id,
        budget: 300,
        tag: 'plumbing',
        date: new Date('2025-09-08'),
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('_id');
    expect(res.body.data.title).toBe(title);
    expect(res.body.data.budget).toBe(300);
    expect(res.body.data.tag).toEqual('plumbing');
    expect(res.body.data.others).toEqual('');
    expect(new Date(res.body.data.date)).toEqual(new Date('2025-09-08'));
    firstPostId = res.body.data._id;
  });

  it('Add the second post', async () => {
    const title = 'Basic Post 2';
    const res = await request(app)
      .post('/posts')
      .send({
        title: title,
        customerId: user1_id,
        budget: 500,
        tag: 'houseCleaning',
        others: 'Specialist',
        date: new Date('2025-08-25'),
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('_id');
    expect(res.body.data.title).toBe(title);
    expect(res.body.data.budget).toBe(500);
    expect(res.body.data.tag).toEqual('houseCleaning');
    expect(res.body.data.others).toEqual('');
    expect(new Date(res.body.data.date)).toEqual(new Date('2025-08-25'));
    secondPostId = res.body.data._id;
  });

  it('Add the third post', async () => {
    const title = 'Basic Post 3';
    const res = await request(app)
      .post('/posts')
      .send({
        title: title,
        customerId: user2_id,
        budget: 400,
        tag: 'others',
        others: 'sweeping',
        date: new Date('2025-08-15'),
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('_id');
    expect(res.body.data.title).toBe(title);
    expect(res.body.data.budget).toBe(400);
    expect(res.body.data.tag).toEqual('others');
    expect(res.body.data.others).toBe('sweeping');
    expect(new Date(res.body.data.date)).toEqual(new Date('2025-08-15'));
  });

  it('Add the fourth post', async () => {
    const title = 'Deluxe Post 1';
    const res = await request(app)
      .post('/posts')
      .send({
        title: title,
        customerId: user2_id,
        budget: 1200.5,
        tag: 'hvac',
        date: new Date('2025-09-02'),
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('_id');
    expect(res.body.data.title).toBe(title);
    expect(res.body.data.budget).toBe(1200.5);
    expect(res.body.data.tag).toEqual('hvac');
    expect(res.body.data.others).toEqual('');
    expect(new Date(res.body.data.date)).toEqual(new Date('2025-09-02'));
  });

  it('Add the fifth post', async () => {
    const title = 'Deluxe Post 2';
    const res = await request(app)
      .post('/posts')
      .send({
        title: title,
        customerId: user1_id,
        budget: 1800,
        tag: 'houseCleaning',
        others: 'Master',
        date: new Date('2025-08-12'),
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('_id');
    expect(res.body.data.title).toBe(title);
    expect(res.body.data.budget).toBe(1800);
    expect(res.body.data.tag).toEqual('houseCleaning');
    expect(res.body.data.others).toEqual('');
    expect(new Date(res.body.data.date)).toEqual(new Date('2025-08-12'));
  });

  it('Add the sixth post', async () => {
    const title = 'Deluxe Post 3';
    const res = await request(app)
      .post('/posts')
      .send({
        title: title,
        customerId: user2_id,
        budget: 1500,
        tag: 'others',
        others: 'installation',
        date: new Date('2025-09-05'),
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('_id');
    expect(res.body.data.title).toBe(title);
    expect(res.body.data.budget).toBe(1500);
    expect(res.body.data.tag).toEqual('others');
    expect(res.body.data.others).toBe('installation');
    expect(new Date(res.body.data.date)).toEqual(new Date('2025-09-05'));
  });

  it('Add the invalid post (missing title)', async () => {
    const res = await request(app)
      .post('/posts')
      .send({
        customerId: user2_id,
        budget: 1500,
        tag: 'electrician',
        date: new Date('2025-08-15'),
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Failed to create post');
  });

  it('Get all posts again', async () => {
    const res = await request(app).get('/posts');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(6);
  });

  it('Get the first post by id', async () => {
    const res = await request(app).get(`/posts/${firstPostId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('_id', firstPostId);
    expect(res.body.data.title).toBe('Basic Post 1');
    expect(res.body.data.budget).toBe(300);
    expect(res.body.data.tag).toEqual('plumbing');
    expect(res.body.data.others).toEqual('');
    expect(new Date(res.body.data.date)).toEqual(new Date('2025-09-08'));
  });

  it('Get the second post by id', async () => {
    const res = await request(app).get(`/posts/${secondPostId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('_id', secondPostId);
    expect(res.body.data.title).toBe('Basic Post 2');
    expect(res.body.data.budget).toBe(500);
    expect(res.body.data.tag).toEqual('houseCleaning');
    expect(res.body.data.others).toEqual('');
    expect(new Date(res.body.data.date)).toEqual(new Date('2025-08-25'));
  });

  it('Get All Posts of User 1', async () => {
    const res = await request(app).get(`/posts/user/${user1_id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(3);
  });

  it('Get All Posts of User 2', async () => {
    const res = await request(app).get(`/posts/user/${user2_id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(3);
  });

  it('Get a post with invalid id', async () => {
    const postId = '64d4c0f531d4f2b1a1a1a1a1';
    const res = await request(app).get(`/posts/${postId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Post not found');
  });

  it('Search posts by "" (empty string)', async () => {
    const res = await request(app).get('/posts/search').query({ query: '' });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Query parameter is required');
  });

  it('Search posts by "       "', async () => {
    const res = await request(app)
      .get('/posts/search')
      .query({ query: '       ' });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Query parameter cannot be whitespace');
  });

  it('Search posts by "Basic"', async () => {
    const res = await request(app)
      .get('/posts/search')
      .query({ query: 'Basic' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(3);
  });

  it('Search posts by "    Basic "', async () => {
    const res = await request(app)
      .get('/posts/search')
      .query({ query: '    Basic ' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(3);
  });

  it('Search posts by "baSiC"', async () => {
    const res = await request(app)
      .get('/posts/search')
      .query({ query: 'baSiC' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(3);
  });

  it('Search posts by "house"', async () => {
    const res = await request(app)
      .get('/posts/search')
      .query({ query: 'house' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(2);
  });

  it('Search posts by "basic"', async () => {
    const res = await request(app)
      .get('/posts/search')
      .query({ query: 'basic' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(3);
  });

  it('Search posts by "1500"', async () => {
    const res = await request(app)
      .get('/posts/search')
      .query({ query: '1500' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(1);
  });

  it('Search posts by "4"', async () => {
    const res = await request(app).get('/posts/search').query({ query: '4' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(0);
  });

  it('Search posts by "User 2"', async () => {
    const res = await request(app)
      .get('/posts/search')
      .query({ query: 'User 2' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(3);
  });

  it('Filter posts without any filter', async () => {
    const res = await request(app).get('/posts/filter');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(6);
  });

  it("Filter posts by userId of User 1's posts", async () => {
    const res = await request(app)
      .get('/posts/filter')
      .query({ userId: user1_id });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(3);
  });

  it("Filter posts by userId of User 2's posts", async () => {
    const res = await request(app)
      .get('/posts/filter')
      .query({ userId: user2_id });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(3);
  });

  it('Filter posts by title (Basic)', async () => {
    const res = await request(app)
      .get('/posts/filter')
      .query({ title: 'Basic' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(3);
  });

  it('Filter post by title (Deluxe)', async () => {
    const res = await request(app)
      .get('/posts/filter')
      .query({ title: 'Deluxe' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(3);
  });

  it('Filter posts by budget range (400 to 1600)', async () => {
    const res = await request(app)
      .get('/posts/filter')
      .query({ minBudget: 400, maxBudget: 1600 });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(4);
  });

  it('Filter posts by budget range equal to less than 400', async () => {
    const res = await request(app)
      .get('/posts/filter')
      .query({ maxBudget: 400 });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(2);
  });

  it('Filter posts by budget range equal to more than 1000', async () => {
    const res = await request(app)
      .get('/posts/filter')
      .query({ minBudget: 1000 });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(3);
  });

  it('Filter posts by tags (houseCleaning)', async () => {
    const res = await request(app)
      .get('/posts/filter')
      .query({ tags: 'houseCleaning' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(2);
  });

  it('Filter posts by tags (plumbing, electrical)', async () => {
    const res = await request(app)
      .get('/posts/filter')
      .query({ tags: 'plumbing,electrical' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(1);
  });

  it('Filter posts by tags (plumbing, hvac, houseCleaning)', async () => {
    const res = await request(app)
      .get('/posts/filter')
      .query({ tags: 'plumbing,hvac,houseCleaning' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(4);
  });

  it('Filter posts by tags (plumbing, hvac, houseCleaning, others)', async () => {
    const res = await request(app)
      .get('/posts/filter')
      .query({ tags: 'plumbing,hvac,houseCleaning,others' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(6);
  });

  it('Filter posts by tags (plumbing, hvac, houseCleaning, others) and others (sweeping)', async () => {
    const res = await request(app).get('/posts/filter').query({
      tags: 'plumbing,hvac,houseCleaning,others',
      others: 'sweeping',
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(5);
  });

  it('Filter posts by tags (houseCleaning, others)', async () => {
    const res = await request(app)
      .get('/posts/filter')
      .query({ tags: 'houseCleaning,others' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(4);
  });

  it('Filter posts by tags (houseCleaning, others) and others (sweeping)', async () => {
    const res = await request(app)
      .get('/posts/filter')
      .query({ tags: 'houseCleaning,others', others: 'sweeping' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(3);
  });

  it('Filter posts by others (sweeping)', async () => {
    const res = await request(app)
      .get('/posts/filter')
      .query({ others: 'sweeping' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(6);
  });

  it('Filter posts by date range (2025-08-01 to 2025-08-31)', async () => {
    const res = await request(app)
      .get('/posts/filter')
      .query({ startDate: '2025-08-01', endDate: '2025-08-31' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(3);
  });

  it('Filter posts by date range (up to 2025-08-15)', async () => {
    const res = await request(app)
      .get('/posts/filter')
      .query({ endDate: '2025-08-15' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(2);
  });

  it('Filter posts by date range (starting from 2025-09-05)', async () => {
    const res = await request(app)
      .get('/posts/filter')
      .query({ startDate: '2025-09-05' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(2);
  });

  it('Filter posts by many filters (title, budget)', async () => {
    const res = await request(app)
      .get('/posts/filter')
      .query({ title: 'Basic', minBudget: 1000, maxBudget: 5000 });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(0);
  });

  it('Filter posts by many filters (title, tags (plumbing, electrical), budget)', async () => {
    const res = await request(app)
      .get('/posts/filter')
      .query({ title: 'Deluxe', tags: 'plumbing,electrical', minBudget: 1600 });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(0);
  });

  it('Filter posts by many filters (title, tags (hvac, others), budget)', async () => {
    const res = await request(app)
      .get('/posts/filter')
      .query({ title: 'Deluxe', tags: 'hvac,others', minBudget: 1200 });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(2);
  });

  it('Filter posts by many filters (tags, budget, date)', async () => {
    const res = await request(app).get('/posts/filter').query({
      tags: 'houseCleaning',
      maxBudget: 1500,
      startDate: '2025-08-01',
      endDate: '2025-08-31',
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(1);
  });

  it('Filter posts by many filters (title, tags, budget, date)', async () => {
    const res = await request(app).get('/posts/filter').query({
      title: 'Deluxe',
      tags: 'painting',
      minBudget: 1600,
      startDate: '2025-09-01',
      endDate: '2025-09-30',
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(0);
  });

  it('Update post by ID', async () => {
    const newTitle = 'Premium Post 1';
    const res = await request(app).put(`/posts/${firstPostId}`).send({
      title: newTitle,
      budget: 4000,
      tag: 'painting',
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('_id', firstPostId);
    expect(res.body.data.title).toBe(newTitle);
    expect(res.body.data.budget).toBe(4000);
    expect(res.body.data.tag).toEqual('painting');
    expect(res.body.data.others).toEqual('');
    expect(new Date(res.body.data.date)).toEqual(new Date('2025-09-08'));
  });

  it('Update post with invalid ID', async () => {
    const postId = '64d4c0f531d4f2b1a1a1a1a1';
    const res = await request(app)
      .put(`/posts/${postId}`)
      .send({ budget: 3500 });
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Post not found');
  });

  it('Update post with invalid budget', async () => {
    const res = await request(app)
      .put(`/posts/${secondPostId}`)
      .send({ budget: -100 });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Failed to update post');
  });

  it('Update post with invalid tags', async () => {
    const res = await request(app)
      .put(`/posts/${secondPostId}`)
      .send({ tag: 'premiumCleaning' });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Failed to update post');
  });

  // it('Update post with invalid cover image', async () => {
  //   const res = await request(app)
  //     .put(`/posts/${secondPostId}`)
  //     .send({ coverPhotoUrl: 'invalid-url' });
  //   expect(res.statusCode).toBe(400);
  //   expect(res.body.success).toBe(false);
  //   expect(res.body.message).toBe('Failed to update post');
  // });

  it('Get post by ID before deletion', async () => {
    const res = await request(app).get(`/posts/${firstPostId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('_id', firstPostId);
  });

  it('Delete post by ID', async () => {
    const res = await request(app).delete(`/posts/${firstPostId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Post deleted successfully');
  });

  it('Get deleted post by ID', async () => {
    const res = await request(app).get(`/posts/${firstPostId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Post not found');
  });

  it('Delete post by invalid ID', async () => {
    const postId = '64d4c0f531d4f2b1a1a1a1a1';
    const res = await request(app).delete(`/posts/${postId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Post not found');
  });

  it('Get all posts', async () => {
    const res = await request(app).get('/posts');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(5);
  });

  it('Delete all posts belonging to a user', async () => {
    const res = await request(app).delete(`/users/${user2_id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe(
      'User and his/her posts deleted successfully',
    );
  });

  it('Get all posts', async () => {
    const res = await request(app).get('/posts');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(2);
  });
});
