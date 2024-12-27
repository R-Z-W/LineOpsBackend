const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('./server');
const { User } = require('./models/UserModel');
const { MongoMemoryServer } = require('mongodb-memory-server');
let server;
let adminToken;
let userToken;
let testUserId;



let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  // ...rest of the setup
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  server.close();
});

describe('GET /api/health', () => {
  it('return backend is working message', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Backend is working!');
  });
});

describe('POST /signup', () => {
  it('successfully signup a new user', async () => {
    const res = await request(app)
      .post('/signup')
      .send({
        username: "newuser",
        password: "NewUser123"
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('jwt');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('username', 'newuser');

    // Clean up
    await User.deleteOne({ username: 'newuser' });
  });

  it('fail signup with missing fields', async () => {
    const res = await request(app)
      .post('/signup')
      .send({
        username: "incompleteuser"
        // Missing password
      });
    
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'Incorrect or missing sign-up credentials provided.');
  });

  it('fail signup with weak password', async () => {
    const res = await request(app)
      .post('/signup')
      .send({
        username: "weakpassworduser",
        password: "weak" // Does not meet password policy
      });
    
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'Password must be at least 8 characters long and contain at least one number.');

    // Ensure user was not created
    const user = await User.findOne({ username: 'weakpassworduser' });
    expect(user).toBeNull();
  });
});

describe('POST /api/login', () => {
  it('successfully login with correct credentials', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        username: "testuser",
        password: "UserPass123"
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('fail login with incorrect password', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        username: "testuser",
        password: "WrongPass123"
      });
    
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });

  it('fail login with non-existent user', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        username: "nonexistentuser",
        password: "SomePass123"
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

describe('GET /api/users', () => {
  it('deny access to non-admin user', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${userToken}`);
    
    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty('message', 'Admin access required');
  });

  it('allow access to admin user', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${adminToken}`);
    
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});