import dotenv from "dotenv";
import passport from "passport";
// Import the GoogleStrategy using require rather than ES module to avoid
// type mismatches in the @types definitions.  Casting to any suppresses
// strict type checking for unsupported options like accessType and prompt.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const GoogleStrategy: any = require("passport-google-oauth20").Strategy;
// import { Strategy as GitHubStrategy } from "passport-github2";

// The GoogleProfile type isn't provided when we import GoogleStrategy via require.
// Define a minimal profile interface for the fields we use.
interface GoogleProfile {
  id: string;
  displayName: string;
  emails?: { value: string }[];
  photos?: { value: string }[];
}

import UserModel, { User } from "./models/User";

dotenv.config();

// using promises instead of async await explicitly
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "http://localhost:3000/auth/google/callback",
      // Cast the strategy options to any because passport-google-oauth20's type
      // definitions do not include accessType and prompt, but they are supported
      // by Google's OAuth implementation.
      accessType: "offline",
      prompt: "consent",
    } as any,

    async (
      accessToken: string,
      refreshToken: string,
      profile: GoogleProfile,
      done: (err: any, user?: any) => void
    ) => {
      try {
        // Try to find an existing user by their Google ID
        let user = await UserModel.findOne({ googleId: profile.id });
        if (!user) {
          // Extract optional fields from the Google profile
          const email = profile.emails?.[0]?.value || "";
          const photo = profile.photos?.[0]?.value || "";
          const newUser = new UserModel({
            googleId: profile.id,
            displayName: profile.displayName,
            email,
            photo,
            accessToken: accessToken || "",
            ...(refreshToken && { refreshToken }),
          });
          console.log("🔍 Google profile:", profile);
          user = await newUser.save();
        }
        done(null, user);
      } catch (error) {
        done(error);
      }
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
