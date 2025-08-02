import dotenv from "dotenv";
import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile as GoogleProfile,
} from "passport-google-oauth20";
// import { Strategy as GitHubStrategy } from "passport-github2";

import UserModel, { User } from "./models/User";

dotenv.config();

// using promises instead of async await explicitly
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },

    (
      accessToken: string,
      refreshToken: string,
      profile: GoogleProfile,
      done: (err: any, user?: User) => void
    ) => {
      UserModel.findOne({ googleId: profile.id })
        .then((user) => {
          if (user) {
            return done(null, user);
          }

          const newUser = new UserModel({
            googleId: profile.id,
            displayName: profile.displayName,
            email: profile.emails[0]?.value,
            photo: profile.photos[0]?.value,
            // come back and look at other options for these tokens if needed
            // or to make more secure
            accessToken,
            refreshToken,
          });
          return newUser.save();
        })
        .then((user) => done(null, user))
        .catch((error) => done(error));
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id); // just use MongoDB _id
});

passport.deserializeUser((id, done) => {
  UserModel.findById(id)
    .then((user) => done(null, user))
    .catch((err) => done(err));
});

