import mongoose from 'mongoose';
import User from '../models/User';

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

describe('Testing User Model ... ', () => {
  it('Create a user with default values', async () => {
    const user = await User.create({});
    expect(user._id).toBeTruthy();
    expect(user.role).toBe('customer');
    expect(user.name).toBe('');
    expect(user.email).toBe('');
    expect(user.avatarUrl).toBe('');
    expect(user.telNumber).toBe('');
    expect(user.address).toBe('');
    expect(user.lastLoginAt).toBeInstanceOf(Date);
    expect(Number.isNaN(user.lastLoginAt.getTime())).toBe(false);
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(Number.isNaN(user.createdAt.getTime())).toBe(false);
    expect(user.updatedAt).toBeInstanceOf(Date);
    expect(Number.isNaN(user.updatedAt.getTime())).toBe(false);
    expect(user.providerProfile).toBeUndefined();
  });

  it('Create a provider with default values', async () => {
    const user = await User.create({
      role: 'provider',
      providerProfile: {},
    });
    expect(user._id).toBeTruthy();
    expect(user.role).toBe('provider');
    expect(user.providerProfile).toBeDefined();
    expect(user.providerProfile?.title).toBe('');
    expect(user.providerProfile?.skills).toEqual([]);
    expect(user.providerProfile?.description).toBe('');
  });

  it('Reject a user with an invalid role', async () => {
    await expect(
      User.create({
        role: 'stranger',
      }),
    ).rejects.toThrow();
  });

  it.each([
    'Jim Smith@gmail.com',
    '.JimSmith@gmail.com',
    'Jim..Smith@gmail.com',
    'Jim12345@hotmail.com.',
    'Jim12345@hotmail@yahoo.com',
    'Jim12345@hotmail',
    '@live.com',
    'Jim.com',
    'Jim',
    null,
  ])('Reject an invalid email: %s', async (email) => {
    await expect(User.create({ email })).rejects.toThrow();
  });

  it.each([
    'สุดา_.-อยู่ดี123@live.com',
    'สมพร@contoso.onmicrosoft.com',
    "   Chanchai+Rukdee'@abc.ac.th      ",
  ])('Create a user with a valid email: %s', async (email) => {
    const user = await User.create({
      role: 'provider',
      email,
      providerProfile: {},
    });
    expect(user.email).toBe(email.toLowerCase().trim());
  });

  it.each([
    'http://localhost',
    'localhost',
    'url=//www.google.com',
    'gopher://google.com',
    '//abc.com/img.jpeg',
    'http://ab_c.com',
    'http://nohost',
    'http://google.com.',
    'google',
    null,
  ])('Reject an invalid avatar URL: %s', async (avatarUrl) => {
    await expect(User.create({ avatarUrl })).rejects.toThrow();
  });

  it.each([
    'google.com',
    'http://google.com',
    'https://google.com',
    'https://google.com/image.png',
    '  https://www.youtube.com/watch?v=blah&list=blah&index=1   ',
  ])('Create a user with a valid avatar URL: %s', async (avatarUrl) => {
    const user = await User.create({
      role: 'provider',
      avatarUrl,
      providerProfile: {},
    });
    expect(user.avatarUrl).toBe(avatarUrl.trim());
  });

  it.each(['012345678.', 'abc.defg', '+660123456', '1234567890', null])(
    'Reject an invalid phone number: %s',
    async (telNumber) => {
      await expect(User.create({ telNumber })).rejects.toThrow();
    },
  );

  it.each(['0812345678', '021234567'])(
    'Create a user with a valid phone numberl: %s',
    async (telNumber) => {
      const user = await User.create({
        telNumber,
      });
      expect(user.telNumber).toBe(telNumber.trim());
    },
  );

  it('Create a user with the value in the field exceeds the specified constraint.', async () => {
    const alphabetNormal = 'a';
    const nameExceed = alphabetNormal.repeat(151);
    await expect(
      User.create({
        name: nameExceed,
      }),
    ).rejects.toThrow();

    const emailExceed = alphabetNormal.repeat(250) + '@a.com';
    await expect(
      User.create({
        email: emailExceed,
      }),
    ).rejects.toThrow();

    const telNumberExceed = '01234567890';
    await expect(
      User.create({
        telNumber: telNumberExceed,
      }),
    ).rejects.toThrow();

    const addressExceed = alphabetNormal.repeat(2001);
    await expect(
      User.create({
        address: addressExceed,
      }),
    ).rejects.toThrow();

    const providerTitleExceed = alphabetNormal.repeat(201);
    await expect(
      User.create({
        role: 'provider',
        providerProfile: {
          title: providerTitleExceed,
        },
      }),
    ).rejects.toThrow();

    const providerDescriptionExceed = alphabetNormal.repeat(2001);
    await expect(
      User.create({
        role: 'provider',
        providerProfile: {
          description: providerDescriptionExceed,
        },
      }),
    ).rejects.toThrow();
  });

  it('Create a provider with multiple valid skills', async () => {
    const user = await User.create({
      role: 'provider',
      providerProfile: {
        skills: ['houseCleaning', 'houseRepair'],
      },
    });
    expect(user.providerProfile?.skills).toEqual([
      'houseCleaning',
      'houseRepair',
    ]);
  });

  it('Reject a provider with a valid skills', async () => {
    await expect(
      User.create({
        role: 'provider',
        providerProfile: {
          skills: ['houseCleaning', 'houseRepairs'],
        },
      }),
    ).rejects.toThrow();
  });
});
