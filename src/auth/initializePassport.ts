import passport  from "passport";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import { googleConfig } from "./authConfig";
import User from "../models/User";
import socialVerify from "./socialVerify";


const initializePassport = (
    passport: passport.PassportStatic
)
: void => {
    passport.use(new GoogleStrategy(googleConfig, socialVerify("google")))

    passport.serializeUser((user: any, done) => done(null, user.id))
    passport.deserializeUser((id, done) => done(null, User.findById({ id: id })))
};

export default initializePassport;