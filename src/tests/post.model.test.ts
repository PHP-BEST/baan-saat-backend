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
    expect(post.tag).toEqual('');
    expect(post.others).toBe('');
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
      tag: 'houseCleaning',
      date: new Date(),
    });
    expect(post._id).toBeTruthy();
    expect(post.customerId).toEqual(user._id);
    expect(post.title).toBe('Custom Post');
    expect(post.description).toBe('This is a custom post.');
    expect(post.budget).toBe(100);
    expect(post.telNumber).toBe('0123456789');
    expect(post.location).toBe('Custom Location');
    expect(post.tag).toEqual('houseCleaning');
    expect(post.others).toBe('');
    expect(post.date).toBeInstanceOf(Date);
    expect(Number.isNaN(post.date.getTime())).toBe(false);
    expect(post.createdAt).toBeInstanceOf(Date);
    expect(Number.isNaN(post.createdAt.getTime())).toBe(false);
    expect(post.updatedAt).toBeInstanceOf(Date);
    expect(Number.isNaN(post.updatedAt.getTime())).toBe(false);
  });

  it('Create a post with others tag and non-empty others field', async () => {
    const user = await User.create({});
    const post = await Post.create({
      customerId: user._id,
      title: 'Other Tag Post',
      tag: 'others',
      others: 'Custom Tag',
      date: new Date(),
    });
    expect(post._id).toBeTruthy();
    expect(post.customerId).toEqual(user._id);
    expect(post.title).toBe('Other Tag Post');
    expect(post.tag).toEqual('others');
    expect(post.others).toBe('Custom Tag');
  });

  it('Create a post with non-others tag and non-empty others field', async () => {
    const user = await User.create({});
    const post = await Post.create({
      customerId: user._id,
      title: 'Invalid other Tag Post',
      tag: 'plumbing',
      others: 'Custom Tag',
      date: new Date(),
    });
    expect(post._id).toBeTruthy();
    expect(post.customerId).toEqual(user._id);
    expect(post.title).toBe('Invalid other Tag Post');
    expect(post.tag).toEqual('plumbing');
    expect(post.others).toBe(''); // others field should be cleared
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

//invalid tag
it.each([
  ['horseCleaning'],
  ['horseRepair'],
  ['jumping'],
  ['electron'],
  ['hVAc'],
  ['panting'],
  ['landsliding'],
  ['otherPost'],
])('Create a post with invalid tag %s', async (tag) => {
  const user = await User.create({});
  await expect(
    Post.create({
      customerId: user._id,
      title: 'Invalid Post',
      tag,
      date: new Date(),
    }),
  ).rejects.toThrow();
});

//valid tag
it.each([
  ['houseCleaning'],
  ['houseRepair'],
  ['plumbing'],
  ['electrical'],
  ['hvac'],
  ['painting'],
  ['landscaping'],
  ['others'],
])('Create a post with valid tag %s', async (tag) => {
  const user = await User.create({});
  const post = await Post.create({
    customerId: user._id,
    title: 'Valid Post',
    tag,
    date: new Date(),
  });
  expect(post).toBeTruthy();
  expect(post.tag).toBe(tag);
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
