import express from 'express';
import session from 'express-session';
import cors from 'cors';
import passport from 'passport';
import dotenv from 'dotenv';
import './strategies';
import { db } from './db';

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev_secret',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/', (_, res) => res.send('OAuth server is live'));
app.get('/me', (req, res) => res.json(req.user || null));

app.listen(3000, () => console.log('✅ Server running on http://localhost:3000'));
