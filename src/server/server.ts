// server.ts

import express from 'express';
import session from 'express-session';
import cors from 'cors';
import { MongoClient } from 'mongodb';

import { createUserController } from './userController';
import { createAppController } from './appController';

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
let collectionApplications: any;
let devicesCollection: any;

APP.listen(PORT, async () => {
  await clientDB.connect();
  const db = clientDB.db('users');
  collectionUsers = db.collection('users');
  collectionApplications = db.collection('applications');
  devicesCollection = db.collection('devices');
  console.log(`Server running on port ${PORT}`);
});

// Роуты
APP.post('/api/login', (req, res) => {
  if (!collectionUsers) {
    return res.status(503).json({ message: 'Database not connected yet' });
  }

  const userController = createUserController(collectionUsers, devicesCollection);
  userController.login(req, res);
});

APP.get('/api/devices', (req, res) => {
  if (!collectionUsers) {
    return res.status(503).json({ message: 'Database not connected yet' });
  }

  const userController = createUserController(collectionUsers, devicesCollection);
  userController.getDevicesByUser(req, res);
});

APP.get('/api/applications', (req, res) => {
  if (!collectionApplications) {
    return res.status(503).json({ message: 'Database not connected yet' });
  }

  const appController = createAppController(collectionApplications, collectionUsers);
  appController.getApplicationsByUser(req, res);
});

APP.post('/api/application', (req, res) => {
  if (!collectionApplications) {
    return res.status(503).json({ message: 'Database not connected yet' });
  }

  const appController = createAppController(collectionApplications, collectionUsers);
  appController.createApplication(req, res);
});

APP.get('/api/applicationsAdmin', (req, res) => {
  if (!collectionApplications) {
    return res.status(503).json({ message: 'Database not connected yet' });
  }

  const appController = createAppController(collectionApplications, collectionUsers);
  appController.getApplicationsByAdmin(req, res);
});

APP.patch('/api/applications/:id', (req, res) => {
  if (!collectionApplications) {
    return res.status(503).json({ message: 'Database not connected yet' });
  }

  const appController = createAppController(collectionApplications, collectionUsers);
  appController.updateApplicationStatus(req, res);
});

APP.get('/api/applicationsAll', (req, res) => {
  if (!collectionApplications) {
    return res.status(503).json({ message: 'Database not connected yet' });
  }

  const appController = createAppController(collectionApplications, collectionUsers);
  appController.getApplicationsAll(req, res);
});

APP.patch('/api/applications/set/:id', (req, res) => {
  if (!collectionApplications) {
    return res.status(503).json({ message: 'Database not connected yet' });
  }

  const appController = createAppController(collectionApplications, collectionUsers);
  appController.updateApplication(req, res);
});
