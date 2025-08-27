import { Profile } from "passport";
import { VerifyCallback } from "passport-google-oauth20";
import User from "../models/User";

const findOrCreateUser = async (
    social: String, 
    profile: Profile,
    done: VerifyCallback
) => {
    try {
        const userId = `${social}_${profile.id}`;
        /*
        Use custom userId instead of MongoDB's auto-generated _id
        for social login identification
        */
        let user = await User.findOne({ userId: userId });

        if (user) {
            // User exists, return existing user
            return done(null, user);
        }

        // User doesn't exist, create new user
        user = new User({
            userId: userId,
            name: profile.displayName,
            email: profile.emails?.[0]?.value,
            profileUrl: profile.photos?.[0]?.value,
        });

        await user.save();
        return done(null, user);
    } 
    catch (error) {
        return done(error, false);
    }
}

const socialVerify = (social: String) => {
    return async (
        accessToken: String, 
        refreshToken: String, 
        profile: Profile,
        done: VerifyCallback
    ) => {
        await findOrCreateUser(social, profile, done);
    }
}

export default socialVerify;