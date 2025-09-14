import { Profile } from 'passport';
import { VerifyCallback } from 'passport-google-oauth20';
import User from '../models/User';

const findOrCreateNewUser = async (
  social: string,
  profile: Profile,
  done: VerifyCallback,
) => {
  try {
    /*
        Use custom userId instead of mongodb's auto-generated _id
        for social login identification
        */
    const userId = `${social}_${profile.id}`;
    let user = await User.findOne({ userId: userId });

    // User exists, return existing user
    if (user != null) {
      user.lastLoginAt = new Date();
      await user.save();
      return done(null, user);
    }

    // User doesn't exist, create new user
    user = new User({
      userId: userId,
      name: profile.displayName,
      email: profile.emails?.[0]?.value,
      avatarUrl: profile.photos?.[0]?.value,
    });

    await user.save();
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
};

const socialVerify = (social: string) => {
  return async (
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) => {
    await findOrCreateNewUser(social, profile, done);
  };
};

export default socialVerify;
