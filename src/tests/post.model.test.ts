import mongoose from 'mongoose';
import User from '../models/User';
import Post from '../models/Post';

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

describe('Testing Post Model ... ', () => {
  it('Create a post with default values', async () => {
    const user = await User.create({});
    const post = await Post.create({
      customerId: user._id,
      title: 'Test Post',
      date: new Date(),
    });
    expect(post._id).toBeTruthy();
    expect(post.customerId).toEqual(user._id);
    expect(post.title).toBe('Test Post');
    expect(post.description).toBe('');
    expect(post.budget).toBe(0);
    expect(post.telNumber).toBe('000000000');
    expect(post.location).toBe('');
    expect(post.tags).toEqual([]);
    expect(post.date).toBeInstanceOf(Date);
    expect(Number.isNaN(post.date.getTime())).toBe(false);
    expect(post.createdAt).toBeInstanceOf(Date);
    expect(Number.isNaN(post.createdAt.getTime())).toBe(false);
    expect(post.updatedAt).toBeInstanceOf(Date);
    expect(Number.isNaN(post.updatedAt.getTime())).toBe(false);
  });

  it('Create a post with custom values', async () => {
    const user = await User.create({});
    const post = await Post.create({
      customerId: user._id,
      title: 'Custom Post',
      description: 'This is a custom post.',
      budget: 100,
      telNumber: '0123456789',
      location: 'Custom Location',
      tags: ['houseCleaning'],
      date: new Date(),
    });
    expect(post._id).toBeTruthy();
    expect(post.customerId).toEqual(user._id);
    expect(post.title).toBe('Custom Post');
    expect(post.description).toBe('This is a custom post.');
    expect(post.budget).toBe(100);
    expect(post.telNumber).toBe('0123456789');
    expect(post.location).toBe('Custom Location');
    expect(post.tags).toEqual(['houseCleaning']);
    expect(post.date).toBeInstanceOf(Date);
    expect(Number.isNaN(post.date.getTime())).toBe(false);
    expect(post.createdAt).toBeInstanceOf(Date);
    expect(Number.isNaN(post.createdAt.getTime())).toBe(false);
    expect(post.updatedAt).toBeInstanceOf(Date);
    expect(Number.isNaN(post.updatedAt.getTime())).toBe(false);
  });

  //Invalid budget
  it.each([[-100], [-0.1], [20.125], [100.475], [100000000], [Infinity]])(
    'Create a post with invalid budget %d',
    async (budget) => {
      const user = await User.create({});
      await expect(
        Post.create({
          customerId: user._id,
          title: 'Invalid Post',
          budget,
          date: new Date(),
        }),
      ).rejects.toThrow();
    },
  );
});

//valid budget
it.each([[0], [0.1], [20], [100.99], [99999999.99]])(
  'Create a post with valid budget %d',
  async (budget) => {
    const user = await User.create({});
    const post = await Post.create({
      customerId: user._id,
      title: 'Valid Post',
      budget,
      date: new Date(),
    });
    expect(post).toBeTruthy();
    expect(post.budget).toBe(budget);
  },
);

// //invalid cover photo URL
// it.each([
//   ['htp://example.com'],
//   ['http//example.com'],
//   ['http:/example.com'],
//   ['://example.com'],
//   ['http://'],
//   ['example'],
//   ['http://exa mple.com'],
//   ['http://example_.com'],
//   ['http://example.c'],
//   ['a'.repeat(2001) + '.com'],
// ])(
//   'Create a post with invalid cover photo URL %s',
//   async (coverPhotoUrl) => {
//     const user = await User.create({});
//     await expect(
//       Post.create({
//         customerId: user._id,
//         title: 'Invalid Post',
//         coverPhotoUrl,
//         date: new Date(),
//       }),
//     ).rejects.toThrow();
//   },
// );

// //valid cover photo URL
// it.each([
//   ['http://example.com'],
//   ['https://example.com'],
//   ['http://www.example.com'],
//   ['https://www.example.com'],
//   ['http://sub.example.com'],
//   ['google.com'],
//   ['www.google.com'],
// ])('Create a post with valid cover photo URL %s', async (coverPhotoUrl) => {
//   const user = await User.create({});
//   const post = await Post.create({
//     customerId: user._id,
//     title: 'Valid Post',
//     coverPhotoUrl,
//     date: new Date(),
//   });
//   expect(post).toBeTruthy();
//   expect(post.coverPhotoUrl).toBe(coverPhotoUrl);
// });

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
  ['+66012345678'],
  ['025274'],
  [null],
])('Create a post with invalid telephone number %s', async (telNumber) => {
  const user = await User.create({});
  await expect(
    Post.create({
      customerId: user._id,
      title: 'Invalid Post',
      telNumber,
      date: new Date(),
    }),
  ).rejects.toThrow();
});

//valid telephone number
it.each([
  ['0123456789'],
  ['0987654321'],
  ['0123465789'],
  ['000000000'],
  ['025731352'],
])('Create a post with valid telephone number %s', async (telNumber) => {
  const user = await User.create({});
  const post = await Post.create({
    customerId: user._id,
    title: 'Valid Post',
    telNumber,
    date: new Date(),
  });
  expect(post).toBeTruthy();
  expect(post.telNumber).toBe(telNumber);
});

//invalid tags
it.each([
  ['horseCleaning'],
  ['horseRepair'],
  ['jumping'],
  ['electron'],
  ['hVAc'],
  ['panting'],
  ['landsliding'],
  ['otherPost'],
])('Create a post with invalid tags %s', async (tags) => {
  const user = await User.create({});
  await expect(
    Post.create({
      customerId: user._id,
      title: 'Invalid Post',
      tags,
      date: new Date(),
    }),
  ).rejects.toThrow();
});

//invalid multiple tags
it.each([
  [['houseCleaning', 'landsliding']],
  [['houseRepair', 'electron']],
  [['plumbing', 'jumping', 'otherPost']],
])('Create a post with invalid multiple tags %s', async (tags) => {
  const user = await User.create({});
  await expect(
    Post.create({
      customerId: user._id,
      title: 'Invalid Post',
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
])('Create a post with valid tags %s', async (tags) => {
  const user = await User.create({});
  const post = await Post.create({
    customerId: user._id,
    title: 'Valid Post',
    tags,
    date: new Date(),
  });
  expect(post).toBeTruthy();
  expect(post.tags).toEqual(expect.arrayContaining(tags));
});

//valid multiple tags
it.each([
  [['houseCleaning', 'houseRepair']],
  [['plumbing', 'electrical']],
  [['hvac', 'painting', 'landscaping']],
  [['others']],
])('Create a post with valid multiple tags %s', async (tags) => {
  const user = await User.create({});
  const post = await Post.create({
    customerId: user._id,
    title: 'Valid Post',
    tags,
    date: new Date(),
  });
  expect(post).toBeTruthy();
  expect(post.tags).toEqual(expect.arrayContaining(tags));
});

//title value exceeds
it('Create a post with title value exceeds the limit', async () => {
  const user = await User.create({});
  await expect(
    Post.create({
      customerId: user._id,
      title: 'a'.repeat(201),
      date: new Date(),
    }),
  ).rejects.toThrow();
});

//description value exceeds
it('Create a post with description value exceeds the limit', async () => {
  const user = await User.create({});
  await expect(
    Post.create({
      customerId: user._id,
      title: 'Valid Post',
      description: 'a'.repeat(2001),
      date: new Date(),
    }),
  ).rejects.toThrow();
});

//telephone value exceeds
it('Create a post with telephone value exceeds the limit', async () => {
  const user = await User.create({});
  await expect(
    Post.create({
      customerId: user._id,
      title: 'Valid Post',
      telNumber: '1234567890123456',
      date: new Date(),
    }),
  ).rejects.toThrow();
});

//location value exceeds
it('Create a post with location value exceeds the limit', async () => {
  const user = await User.create({});
  await expect(
    Post.create({
      customerId: user._id,
      title: 'Valid Post',
      location: 'a'.repeat(2001),
      date: new Date(),
    }),
  ).rejects.toThrow();
});
