import express from "express";
import session from "express-session";
import cors from "cors";
import passport from "passport";
import dotenv from "dotenv";

import { connectDB } from "./db";
connectDB();

import "./strategies";

const PORT = process.env.PORT || 3000;

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // change to true in production with HTTPS
      sameSite: "lax", // or 'none' if using HTTPS + different domain
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (_, res) => {
  res.json({ status: "OAuth server is live" });
});

// Current user session
app.get("/me", (req, res) => {
  if (!req.user) return res.json({ user: null });
  res.json({ user: req.user });
});

// Google OAuth routes
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (_req, res) => {
    res.redirect("http://localhost:5173/auth/success");
  }
);

// // GitHub OAuth routes
// app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));
// app.get('/auth/github/callback',
//   passport.authenticate('github', { failureRedirect: '/' }),
//   (_req, res) => {
//     res.redirect('http://localhost:5173');
//   }
// );

// Logout
app.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: "Logout failed" });
    res.json({ success: true });
  });
});

app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
