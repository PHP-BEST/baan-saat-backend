import mongoose from 'mongoose';
import User from '../models/User';
import Service from '../models/Service';

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

describe('Testing Service Model ... ', () => {
  it('Create a service with default values', async () => {
    const user = await User.create({});
    const service = await Service.create({
      customerId: user._id,
      title: 'Test Service',
      date: new Date(),
    });
    expect(service._id).toBeTruthy();
    expect(service.customerId).toEqual(user._id);
    expect(service.title).toBe('Test Service');
    expect(service.description).toBe('');
    expect(service.budget).toBe(0);
    expect(service.telNumber).toBe('');
    expect(service.location).toBe('');
    expect(service.tags).toEqual([]);
    expect(service.date).toBeInstanceOf(Date);
    expect(Number.isNaN(service.date.getTime())).toBe(false);
    expect(service.createdAt).toBeInstanceOf(Date);
    expect(Number.isNaN(service.createdAt.getTime())).toBe(false);
    expect(service.updatedAt).toBeInstanceOf(Date);
    expect(Number.isNaN(service.updatedAt.getTime())).toBe(false);
  });

  it('Create a service with custom values', async () => {
    const user = await User.create({});
    const service = await Service.create({
      customerId: user._id,
      title: 'Custom Service',
      description: 'This is a custom service.',
      budget: 100,
      telNumber: '0123456789',
      location: 'Custom Location',
      tags: ['houseCleaning'],
      date: new Date(),
    });
    expect(service._id).toBeTruthy();
    expect(service.customerId).toEqual(user._id);
    expect(service.title).toBe('Custom Service');
    expect(service.description).toBe('This is a custom service.');
    expect(service.budget).toBe(100);
    expect(service.telNumber).toBe('0123456789');
    expect(service.location).toBe('Custom Location');
    expect(service.tags).toEqual(['houseCleaning']);
    expect(service.date).toBeInstanceOf(Date);
    expect(Number.isNaN(service.date.getTime())).toBe(false);
    expect(service.createdAt).toBeInstanceOf(Date);
    expect(Number.isNaN(service.createdAt.getTime())).toBe(false);
    expect(service.updatedAt).toBeInstanceOf(Date);
    expect(Number.isNaN(service.updatedAt.getTime())).toBe(false);
  });

  //Invalid budget
  it.each([[-100], [-0.1], [20.125], [100.475], [100000000], [Infinity]])(
    'Create a service with invalid budget %d',
    async (budget) => {
      const user = await User.create({});
      await expect(
        Service.create({
          customerId: user._id,
          title: 'Invalid Service',
          budget,
          date: new Date(),
        }),
      ).rejects.toThrow();
    },
  );
});

//valid budget
it.each([[0], [0.1], [20], [100.99], [99999999.99]])(
  'Create a service with valid budget %d',
  async (budget) => {
    const user = await User.create({});
    const service = await Service.create({
      customerId: user._id,
      title: 'Valid Service',
      budget,
      date: new Date(),
    });
    expect(service).toBeTruthy();
    expect(service.budget).toBe(budget);
  },
);

//invalid cover photo URL
it.each([
  ['htp://example.com'],
  ['http//example.com'],
  ['http:/example.com'],
  ['://example.com'],
  ['http://'],
  ['example'],
  ['http://exa mple.com'],
  ['http://example_.com'],
  ['http://example.c'],
  ['a'.repeat(2001) + '.com'],
])(
  'Create a service with invalid cover photo URL %s',
  async (coverPhotoUrl) => {
    const user = await User.create({});
    await expect(
      Service.create({
        customerId: user._id,
        title: 'Invalid Service',
        coverPhotoUrl,
        date: new Date(),
      }),
    ).rejects.toThrow();
  },
);

//valid cover photo URL
it.each([
  ['http://example.com'],
  ['https://example.com'],
  ['http://www.example.com'],
  ['https://www.example.com'],
  ['http://sub.example.com'],
  ['google.com'],
  ['www.google.com'],
])('Create a service with valid cover photo URL %s', async (coverPhotoUrl) => {
  const user = await User.create({});
  const service = await Service.create({
    customerId: user._id,
    title: 'Valid Service',
    coverPhotoUrl,
    date: new Date(),
  });
  expect(service).toBeTruthy();
  expect(service.coverPhotoUrl).toBe(coverPhotoUrl);
});

//invalid telephone number
it.each([
  ['123456789'],
  ['5123456789'],
  ['1234567890'],
  ['1234567890'],
  ['abcdefghij'],
  ['123456789a'],
  ['1234568790'],
  ['7890123456'],
  [null],
])('Create a service with invalid telephone number %s', async (telNumber) => {
  const user = await User.create({});
  await expect(
    Service.create({
      customerId: user._id,
      title: 'Invalid Service',
      telNumber,
      date: new Date(),
    }),
  ).rejects.toThrow();
});

//valid telephone number
it.each([['0123456789'], ['0987654321'], ['0123465789']])(
  'Create a service with valid telephone number %s',
  async (telNumber) => {
    const user = await User.create({});
    const service = await Service.create({
      customerId: user._id,
      title: 'Valid Service',
      telNumber,
      date: new Date(),
    });
    expect(service).toBeTruthy();
    expect(service.telNumber).toBe(telNumber);
  },
);

//invalid tags
it.each([
  ['horseCleaning'],
  ['horseRepair'],
  ['jumping'],
  ['electron'],
  ['hVAc'],
  ['panting'],
  ['landsliding'],
  ['otherService'],
])('Create a service with invalid tags %s', async (tags) => {
  const user = await User.create({});
  await expect(
    Service.create({
      customerId: user._id,
      title: 'Invalid Service',
      tags,
      date: new Date(),
    }),
  ).rejects.toThrow();
});

//invalid multiple tags
it.each([
  [['houseCleaning', 'landsliding']],
  [['houseRepair', 'electron']],
  [['plumbing', 'jumping', 'otherService']],
])('Create a service with invalid multiple tags %s', async (tags) => {
  const user = await User.create({});
  await expect(
    Service.create({
      customerId: user._id,
      title: 'Invalid Service',
      tags,
      date: new Date(),
    }),
  ).rejects.toThrow();
});

//valid tags
it.each([
  [['houseCleaning']],
  [['houseRepair']],
  [['plumbing']],
  [['electrical']],
  [['hvac']],
  [['painting']],
  [['landscaping']],
  [['others']],
])('Create a service with valid tags %s', async (tags) => {
  const user = await User.create({});
  const service = await Service.create({
    customerId: user._id,
    title: 'Valid Service',
    tags,
    date: new Date(),
  });
  expect(service).toBeTruthy();
  expect(service.tags).toEqual(expect.arrayContaining(tags));
});

//valid multiple tags
it.each([
  [['houseCleaning', 'houseRepair']],
  [['plumbing', 'electrical']],
  [['hvac', 'painting', 'landscaping']],
  [['others']],
])('Create a service with valid multiple tags %s', async (tags) => {
  const user = await User.create({});
  const service = await Service.create({
    customerId: user._id,
    title: 'Valid Service',
    tags,
    date: new Date(),
  });
  expect(service).toBeTruthy();
  expect(service.tags).toEqual(expect.arrayContaining(tags));
});

//title value exceeds
it('Create a service with title value exceeds the limit', async () => {
  const user = await User.create({});
  await expect(
    Service.create({
      customerId: user._id,
      title: 'a'.repeat(201),
      date: new Date(),
    }),
  ).rejects.toThrow();
});

//description value exceeds
it('Create a service with description value exceeds the limit', async () => {
  const user = await User.create({});
  await expect(
    Service.create({
      customerId: user._id,
      title: 'Valid Service',
      description: 'a'.repeat(2001),
      date: new Date(),
    }),
  ).rejects.toThrow();
});

//telephone value exceeds
it('Create a service with telephone value exceeds the limit', async () => {
  const user = await User.create({});
  await expect(
    Service.create({
      customerId: user._id,
      title: 'Valid Service',
      telNumber: '1234567890123456',
      date: new Date(),
    }),
  ).rejects.toThrow();
});

//location value exceeds
it('Create a service with location value exceeds the limit', async () => {
  const user = await User.create({});
  await expect(
    Service.create({
      customerId: user._id,
      title: 'Valid Service',
      location: 'a'.repeat(2001),
      date: new Date(),
    }),
  ).rejects.toThrow();
});
