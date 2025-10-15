import request from 'supertest';
import express, { Application } from 'express';
import userRouter from '../user/userRoutes';
import mongoose from 'mongoose';

// Set up Express app for testing
const app: Application = express();
app.use(express.json());
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

describe('Testing User API...', () => {
  let firstUserId: string;

  it('Get all users', async () => {
    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(0);
  });

  it('Add the first user', async () => {
    const name = 'User name 1';
    const res = await request(app).post('/users').send({ name: name });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('_id');
    expect(res.body.data.name).toBe(name);
    firstUserId = res.body.data._id;
  });

  it('Add the second user', async () => {
    const name = 'User name 2';
    const res = await request(app).post('/users').send({ name: name });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('_id');
    expect(res.body.data.name).toBe(name);
  });

  it('Add first provider with provider profile', async () => {
    const name = 'Provider with Provider Profile';
    const res = await request(app)
      .post('/users')
      .send({
        name: name,
        role: 'provider',
        providerProfile: { description: 'Expert01' },
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('_id');
    expect(res.body.data.name).toBe(name);
    expect(res.body.data.role).toBe('provider');
    expect(res.body.data.providerProfile?.description).toBe('Expert01');
  });

  it('Add second provider with provider profile', async () => {
    const name = 'Provider with Provider Profile 2';
    const res = await request(app)
      .post('/users')
      .send({
        name: name,
        role: 'provider',
        providerProfile: { description: 'Skillful01' },
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('_id');
    expect(res.body.data.name).toBe(name);
    expect(res.body.data.role).toBe('provider');
    expect(res.body.data.providerProfile?.description).toBe('Skillful01');
  });

  it('Add third provider with provider profile', async () => {
    const name = 'Provider with Provider Profile 3';
    const res = await request(app)
      .post('/users')
      .send({
        name: name,
        role: 'provider',
        providerProfile: { description: 'Expert02' },
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('_id');
    expect(res.body.data.name).toBe(name);
    expect(res.body.data.role).toBe('provider');
    expect(res.body.data.providerProfile?.description).toBe('Expert02');
  });

  it('Add customer with provider profile', async () => {
    const name = 'Customer with Provider Profile';
    const res = await request(app)
      .post('/users')
      .send({
        name: name,
        role: 'customer',
        providerProfile: { description: 'Valid' },
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('_id');
    expect(res.body.data.name).toBe(name);
    expect(res.body.data.role).toBe('customer');
    expect(res.body.data.providerProfile?.description).toBe('');
  });

  it('Add user with invalid value', async () => {
    const name = 'User with Invalid Value';
    const res = await request(app)
      .post('/users')
      .send({ name: name, telNumber: '12345' });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Failed to create user');
  });

  it('Get all users', async () => {
    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(6);
  });

  it('Get all providers', async () => {
    const res = await request(app).get('/users/providers');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(3);
  });

  it('Get user by ID', async () => {
    const res = await request(app).get(`/users/${firstUserId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('_id', firstUserId);
    expect(res.body.data.name).toBe('User name 1');
    expect(res.body.data.role).toBe('customer');
    expect(res.body.data.email).toBe('');
    expect(res.body.data.telNumber).toBe('000000000');
    expect(res.body.data.address).toBe('');
    expect(res.body.data.avatarUrl).toBe('');
    expect(res.body.data.providerProfile?.description).toBe('');
  });

  it('Get user by invalid ID', async () => {
    const userId = '64b64c4f4f4f4f4f4f4f4f4f';
    const res = await request(app).get(`/users/${userId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('User not found');
  });

  it('Search providers (Provider)', async () => {
    const query = 'Provider';
    const res = await request(app).get('/users/search').query({ query: query });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(3);
  });

  it('Search providers (Expert)', async () => {
    const query = 'Expert';
    const res = await request(app).get('/users/search').query({ query: query });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(2);
  });

  it('Search providers (Skillful)', async () => {
    const query = 'Skillful';
    const res = await request(app).get('/users/search').query({ query: query });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(1);
  });

  it('Search providers (01)', async () => {
    const query = '01';
    const res = await request(app).get('/users/search').query({ query: query });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(2);
  });

  it('Search providers with empty query', async () => {
    const query = '   ';
    const res = await request(app).get('/users/search').query({ query: query });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Query parameter cannot be empty');
  });

  it('Search providers with no matching query', async () => {
    const query = 'NonExistingQuery';
    const res = await request(app).get('/users/search').query({ query: query });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(0);
  });

  it('Update user by ID', async () => {
    const newName = 'Updated User Name';
    const res = await request(app)
      .put(`/users/${firstUserId}`)
      .send({ name: newName });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('_id', firstUserId);
    expect(res.body.data.name).toBe(newName);
  });

  it('Get updated user by ID', async () => {
    const res = await request(app).get(`/users/${firstUserId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('_id', firstUserId);
    expect(res.body.data.name).toBe('Updated User Name');
  });

  it('Update user with invalid ID', async () => {
    const userId = '64b64c4f4f4f4f4f4f4f4f4f';
    const newName = 'Updated User Name';
    const res = await request(app)
      .put(`/users/${userId}`)
      .send({ name: newName });
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('User not found');
  });

  it('Update user with invalid value', async () => {
    const res = await request(app)
      .put(`/users/${firstUserId}`)
      .send({ name: '', email: 'test1234@com' });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Failed to update user');
  });

  it('Update user with multiple fields', async () => {
    const newName = 'Multi-field Updated User Name';
    const newEmail = 'multi.field.updated@example.com';
    const newTelNumber = '083957789';
    const newAddress = '123 Updated Address, City, Country';
    const newAvatarUrl = 'https://example.com/new-avatar.jpg';
    const res = await request(app).put(`/users/${firstUserId}`).send({
      name: newName,
      email: newEmail,
      telNumber: newTelNumber,
      address: newAddress,
      avatarUrl: newAvatarUrl,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('_id', firstUserId);
    expect(res.body.data.name).toBe(newName);
    expect(res.body.data.email).toBe(newEmail);
    expect(res.body.data.telNumber).toBe(newTelNumber);
    expect(res.body.data.address).toBe(newAddress);
    expect(res.body.data.avatarUrl).toBe(newAvatarUrl);
  });

  it('Update user role from customer to provider', async () => {
    const newRole = 'provider';
    const providerProfile = {
      description: 'Experienced provider in plumbing and electrical work.',
    };
    const res = await request(app).put(`/users/${firstUserId}`).send({
      role: newRole,
      providerProfile: providerProfile,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('_id', firstUserId);
    expect(res.body.data.role).toBe(newRole);
    expect(res.body.data.providerProfile).toEqual(
      expect.objectContaining(providerProfile),
    );
  });

  it('Get user by ID before deletion', async () => {
    const res = await request(app).get(`/users/${firstUserId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('_id', firstUserId);
  });

  it('Delete user by ID', async () => {
    const res = await request(app).delete(`/users/${firstUserId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe(
      'User and his/her posts deleted successfully',
    );
  });

  it('Get deleted user by ID', async () => {
    const res = await request(app).get(`/users/${firstUserId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('User not found');
  });

  it('Delete user with invalid ID', async () => {
    const userId = '64b64c4f4f4f4f4f4f4f4f4f';
    const res = await request(app).delete(`/users/${userId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('User not found');
  });

  it('Get all users after deletion', async () => {
    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(5);
  });
});
