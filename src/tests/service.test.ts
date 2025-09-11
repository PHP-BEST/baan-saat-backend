import request from 'supertest';
import express, { Application } from 'express';
import serviceRouter from '../routes/service';
import userRouter from '../routes/user';
import mongoose from 'mongoose';

// Set up Express app for testing
const app: Application = express();
app.use(express.json());
app.use('/services', serviceRouter);
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

describe('Testing Service API...', () => {
  let firstServiceId: string;
  let secondServiceId: string;
  let user1_id: string;
  let user2_id: string;

  it('Add user', async () => {
    const res1 = await request(app).post('/users').send({ name: 'User 1' });
    user1_id = res1.body.data._id;

    const res2 = await request(app).post('/users').send({ name: 'User 2' });
    user2_id = res2.body.data._id;
  });

  it('Get all services', async () => {
    const res = await request(app).get('/services');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(0);
  });

  it('Add the first service', async () => {
    const title = 'Basic Service 1';
    const res = await request(app)
      .post('/services')
      .send({
        title: title,
        customerId: user1_id,
        budget: 300,
        tags: ['plumbing', 'electrical'],
        date: new Date('2025-09-08'),
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('_id');
    expect(res.body.data.title).toBe(title);
    expect(res.body.data.budget).toBe(300);
    expect(res.body.data.tags).toEqual(['plumbing', 'electrical']);
    expect(new Date(res.body.data.date)).toEqual(new Date('2025-09-08'));
    firstServiceId = res.body.data._id;
  });

  it('Add the second service', async () => {
    const title = 'Basic Service 2';
    const res = await request(app)
      .post('/services')
      .send({
        title: title,
        customerId: user1_id,
        budget: 500,
        tags: ['houseCleaning'],
        date: new Date('2025-08-25'),
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('_id');
    expect(res.body.data.title).toBe(title);
    expect(res.body.data.budget).toBe(500);
    expect(res.body.data.tags).toEqual(['houseCleaning']);
    expect(new Date(res.body.data.date)).toEqual(new Date('2025-08-25'));
    secondServiceId = res.body.data._id;
  });

  it('Add the third service', async () => {
    const title = 'Basic Service 3';
    const res = await request(app)
      .post('/services')
      .send({
        title: title,
        customerId: user2_id,
        budget: 400,
        tags: ['houseRepair', 'others'],
        date: new Date('2025-08-15'),
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('_id');
    expect(res.body.data.title).toBe(title);
    expect(res.body.data.budget).toBe(400);
    expect(res.body.data.tags).toEqual(['houseRepair', 'others']);
    expect(new Date(res.body.data.date)).toEqual(new Date('2025-08-15'));
  });

  it('Add the fourth service', async () => {
    const title = 'Deluxe Service 1';
    const res = await request(app)
      .post('/services')
      .send({
        title: title,
        customerId: user2_id,
        budget: 1200.5,
        tags: ['houseCleaning', 'hvac'],
        date: new Date('2025-09-02'),
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('_id');
    expect(res.body.data.title).toBe(title);
    expect(res.body.data.budget).toBe(1200.5);
    expect(res.body.data.tags).toEqual(['houseCleaning', 'hvac']);
    expect(new Date(res.body.data.date)).toEqual(new Date('2025-09-02'));
  });

  it('Add the fifth service', async () => {
    const title = 'Deluxe Service 2';
    const res = await request(app)
      .post('/services')
      .send({
        title: title,
        customerId: user1_id,
        budget: 1800,
        tags: ['houseCleaning', 'plumbing', 'electrical', 'painting'],
        date: new Date('2025-08-12'),
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('_id');
    expect(res.body.data.title).toBe(title);
    expect(res.body.data.budget).toBe(1800);
    expect(res.body.data.tags).toEqual([
      'houseCleaning',
      'plumbing',
      'electrical',
      'painting',
    ]);
    expect(new Date(res.body.data.date)).toEqual(new Date('2025-08-12'));
  });

  it('Add the sixth service', async () => {
    const title = 'Deluxe Service 3';
    const res = await request(app)
      .post('/services')
      .send({
        title: title,
        customerId: user2_id,
        budget: 1500,
        tags: ['landscaping', 'plumbing', 'electrical', 'others'],
        date: new Date('2025-09-05'),
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('_id');
    expect(res.body.data.title).toBe(title);
    expect(res.body.data.budget).toBe(1500);
    expect(res.body.data.tags).toEqual([
      'landscaping',
      'plumbing',
      'electrical',
      'others',
    ]);
    expect(new Date(res.body.data.date)).toEqual(new Date('2025-09-05'));
  });

  it('Add the invalid service (missing title)', async () => {
    const res = await request(app)
      .post('/services')
      .send({
        customerId: user2_id,
        budget: 1500,
        tags: ['houseCleaning', 'hvac', 'electrician', 'others'],
        date: new Date('2025-08-15'),
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Failed to create service');
  });

  it('Get all services again', async () => {
    const res = await request(app).get('/services');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(6);
  });

  it('Get the first service by id', async () => {
    const res = await request(app).get(`/services/${firstServiceId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('_id', firstServiceId);
    expect(res.body.data.title).toBe('Basic Service 1');
    expect(res.body.data.budget).toBe(300);
    expect(res.body.data.tags).toEqual(['plumbing', 'electrical']);
    expect(new Date(res.body.data.date)).toEqual(new Date('2025-09-08'));
  });

  it('Get the second service by id', async () => {
    const res = await request(app).get(`/services/${secondServiceId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('_id', secondServiceId);
    expect(res.body.data.title).toBe('Basic Service 2');
    expect(res.body.data.budget).toBe(500);
    expect(res.body.data.tags).toEqual(['houseCleaning']);
    expect(new Date(res.body.data.date)).toEqual(new Date('2025-08-25'));
  });

  it('Get a service with invalid id', async () => {
    const serviceId = '64d4c0f531d4f2b1a1a1a1a1';
    const res = await request(app).get(`/services/${serviceId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Service not found');
  });

  it('Filter services by title (Basic)', async () => {
    const res = await request(app)
      .get('/services/filter')
      .query({ title: 'Basic' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(3);
  });

  it('Filter service by title (Deluxe)', async () => {
    const res = await request(app)
      .get('/services/filter')
      .query({ title: 'Deluxe' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(3);
  });

  it('Filter services by budget range (400 to 1600)', async () => {
    const res = await request(app)
      .get('/services/filter')
      .query({ minBudget: 400, maxBudget: 1600 });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(4);
  });

  it('Filter services by budget range equal to less than 400', async () => {
    const res = await request(app)
      .get('/services/filter')
      .query({ maxBudget: 400 });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(2);
  });

  it('Filter services by budget range equal to more than 1000', async () => {
    const res = await request(app)
      .get('/services/filter')
      .query({ minBudget: 1000 });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(3);
  });

  it('Filter services by tags (houseCleaning)', async () => {
    const res = await request(app)
      .get('/services/filter')
      .query({ tags: 'houseCleaning' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(3);
  });

  it('Filter services by tags (plumbing, electrical)', async () => {
    const res = await request(app)
      .get('/services/filter')
      .query({ tags: 'plumbing,electrical' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(3);
  });

  it('Filter services by tags (houseCleaning, others)', async () => {
    const res = await request(app)
      .get('/services/filter')
      .query({ tags: 'houseCleaning,others' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(0);
  });

  it('Filter services by date range (2025-08-01 to 2025-08-31)', async () => {
    const res = await request(app)
      .get('/services/filter')
      .query({ startDate: '2025-08-01', endDate: '2025-08-31' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(3);
  });

  it('Filter services by date range (up to 2025-08-15)', async () => {
    const res = await request(app)
      .get('/services/filter')
      .query({ endDate: '2025-08-15' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(2);
  });

  it('Filter services by date range (starting from 2025-09-05)', async () => {
    const res = await request(app)
      .get('/services/filter')
      .query({ startDate: '2025-09-05' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(2);
  });

  it('Filter services by many filters (title, budget)', async () => {
    const res = await request(app)
      .get('/services/filter')
      .query({ title: 'Basic', minBudget: 1000, maxBudget: 5000 });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(0);
  });

  it('Filter services by many filters (title, tags, budget)', async () => {
    const res = await request(app)
      .get('/services/filter')
      .query({ title: 'Deluxe', tags: 'plumbing,electrical', minBudget: 1600 });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(1);
  });

  it('Filter services by many filters (tags, budget, date)', async () => {
    const res = await request(app).get('/services/filter').query({
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

  it('Filter services by many filters (title, tags, budget, date)', async () => {
    const res = await request(app).get('/services/filter').query({
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

  it('Update service by ID', async () => {
    const newTitle = 'Premium Service 1';
    const res = await request(app)
      .put(`/services/${firstServiceId}`)
      .send({
        title: newTitle,
        budget: 4000,
        tags: [
          'houseCleaning',
          'houseRepair',
          'plumbing',
          'electrical',
          'hvac',
          'landscaping',
          'painting',
          'others',
        ],
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('_id', firstServiceId);
    expect(res.body.data.title).toBe(newTitle);
    expect(res.body.data.budget).toBe(4000);
    expect(res.body.data.tags).toEqual([
      'houseCleaning',
      'houseRepair',
      'plumbing',
      'electrical',
      'hvac',
      'landscaping',
      'painting',
      'others',
    ]);
    expect(new Date(res.body.data.date)).toEqual(new Date('2025-09-08'));
  });

  it('Update service with invalid ID', async () => {
    const serviceId = '64d4c0f531d4f2b1a1a1a1a1';
    const res = await request(app)
      .put(`/services/${serviceId}`)
      .send({ budget: 3500 });
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Service not found');
  });

  it('Update service with invalid budget', async () => {
    const res = await request(app)
      .put(`/services/${secondServiceId}`)
      .send({ budget: -100 });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Failed to update service');
  });

  it('Update service with invalid tags', async () => {
    const res = await request(app)
      .put(`/services/${secondServiceId}`)
      .send({ tags: ['premium', 'fast'] });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Failed to update service');
  });

  it('Update service with invalid cover image', async () => {
    const res = await request(app)
      .put(`/services/${secondServiceId}`)
      .send({ coverImage: 'invalid-url.rpg' });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Failed to update service');
  });

  it('Get service by ID before deletion', async () => {
    const res = await request(app).get(`/services/${firstServiceId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('_id', firstServiceId);
  });

  it('Delete service by ID', async () => {
    const res = await request(app).delete(`/services/${firstServiceId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Service deleted successfully');
  });

  it('Get deleted service by ID', async () => {
    const res = await request(app).get(`/services/${firstServiceId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Service not found');
  });

  it('Delete service by invalid ID', async () => {
    const serviceId = '64d4c0f531d4f2b1a1a1a1a1';
    const res = await request(app).delete(`/services/${serviceId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Service not found');
  });

  it('Get all services', async () => {
    const res = await request(app).get('/services');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(5);
  });

  it('Delete all services belonging to a user', async () => {
    const res = await request(app).delete(`/users/${user2_id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe(
      'User and his/her services deleted successfully',
    );
  });

  it('Get all services', async () => {
    const res = await request(app).get('/services');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(2);
  });
});
