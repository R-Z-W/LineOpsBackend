const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('./server');
const { User } = require('./models/UserModel');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bcrypt = require('bcryptjs');

let mongoServer;
let adminToken;
let userToken;
let adminUserId;
let regularUserId;
let server;

beforeAll(async () => {
  // Initialize MongoDB
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  
  // Connect MongoDB 
  await mongoose.connect(uri);
  
  // Create admin user
  const adminPassword = await bcrypt.hash('password123', 10);
  const adminUser = await User.create({
    username: 'admin',
    password: adminPassword,
    isAdmin: true,
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    phoneNumber: '555-000-1111',
    jobTitle: 'Administrator',
    department: 'Management',
    hireDate: new Date('2020-01-01'),
    salary: 80000,
    dateOfBirth: new Date('1980-01-01'),
    gender: 'Male',
    address: '123 Admin St',
    employmentStatus: 'Active',
  });
  adminUserId = adminUser._id;

  // Login as admin to get token
  const adminRes = await request(app)
    .post('/api/login')
    .send({
      username: 'admin',
      password: 'password123',
    });
  
  adminToken = adminRes.body.token || adminRes.body.jwt;

  // Create regular user
  const userPassword = await bcrypt.hash('password123', 10);
  const regularUser = await User.create({
    username: 'testuser',
    password: userPassword,
    isAdmin: false,
    firstName: 'Test',
    lastName: 'User',
    email: 'testuser@example.com',
    phoneNumber: '555-222-3333',
    jobTitle: 'Developer',
    department: 'Engineering',
    hireDate: new Date('2021-06-15'),
    salary: 60000,
    dateOfBirth: new Date('1990-05-20'),
    gender: 'Female',
    address: '456 User Ave',
    employmentStatus: 'Active',
  });
  regularUserId = regularUser._id;

  // Login as regular user to get token
  const userRes = await request(app)
    .post('/api/login')
    .send({
      username: 'testuser',
      password: 'password123',
    });
  
  userToken = userRes.body.token || userRes.body.jwt;

  // Create test user
  await request(app)
    .post('/api/register')
    .send({
      username: 'testuser',
      password: 'TestPass123', // Ensure this matches the expected password
    });
  
  // Login to get userToken
  const res = await request(app)
    .post('/api/login')
    .send({
      username: 'testuser',
      password: 'TestPass123',
    });
  
  userToken = res.body.token;

  server = app.listen(4000, () => {
    console.log('Test server running on port 4000');
  });
});

afterAll(async () => {
  // Clean up database
  await User.deleteMany({});
  
  // Disconnect and stop MongoDB
  await mongoose.disconnect();
  await mongoServer.stop();
  server.close();
});

describe('GET /api/health', () => {
  it(' return backend is working message', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Backend is working!');
  });
});

describe('POST /api/login', () => {
  it(' successfully login with correct credentials', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        username: 'testuser',
        password: 'TestPass123', // Correct password
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token'); // Ensure 'token' is used consistently
  });

  it(' fail login with incorrect password', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        username: 'testuser',
        password: 'WrongPass123',
      });
    
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });

  it(' fail login with non-existent user', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        username: 'nonexistentuser',
        password: 'SomePass123',
      });
    
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });
});

describe('GET /api/cars', () => {
    it('deny access without token', async () => {
      const res = await request(app).get('/api/cars');
      expect(res.statusCode).toEqual(403);
      expect(res.body).toHaveProperty('message', 'Sign in to view this content!');
    });
  
    it('allow access with valid token', async () => {
      const res = await request(app)
        .get('/api/cars')
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });