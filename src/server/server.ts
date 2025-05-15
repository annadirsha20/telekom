import express from 'express';
import session from 'express-session';
import cors from 'cors';
import { MongoClient } from 'mongodb';

import { createUserController } from './userController';

const APP = express();
const PORT = 5000;

// Middleware
APP.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
APP.use(express.json());
APP.use(express.urlencoded({ extended: true }));
APP.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}));

// Логирование запросов
APP.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.url}`, req.body);
  next();
});

// Подключение к MongoDB
const clientDB = new MongoClient('mongodb://127.0.0.1:27017/');
let collectionUsers: any;

APP.listen(PORT, async () => {
  await clientDB.connect();
  const db = clientDB.db('users');
  collectionUsers = db.collection('users');
  console.log(`Server running on port ${PORT}`);
});

// Роуты всегда доступны
APP.post('/api/login', (req, res) => {
  if (!collectionUsers) {
    return res.status(503).json({ message: 'Database not connected yet' });
  }

  const userController = createUserController(collectionUsers);
  userController.login(req, res);
});