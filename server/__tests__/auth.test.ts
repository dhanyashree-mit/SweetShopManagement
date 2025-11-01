import request from 'supertest';
import express from 'express';
import { registerRoutes } from '../routes';
import Database from 'better-sqlite3';
import { db } from '../db';

let app: express.Express;
let server: any;

beforeAll(async () => {
  app = express();
  app.use(express.json());
  server = await registerRoutes(app);
});

afterAll(() => {
  server.close();
});

beforeEach(() => {
  // Clear database before each test
  const sqlite = new Database('sqlite.db');
  sqlite.exec('DELETE FROM users');
  sqlite.exec('DELETE FROM sweets');
  sqlite.close();
});

describe('Authentication API', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          password: 'password123',
          isAdmin: false,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.username).toBe('testuser');
      expect(response.body.user.isAdmin).toBe(false);
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should register an admin user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'admin',
          password: 'adminpass',
          isAdmin: true,
        });

      expect(response.status).toBe(201);
      expect(response.body.user.isAdmin).toBe(true);
    });

    it('should reject duplicate usernames', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          password: 'password123',
          isAdmin: false,
        });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          password: 'differentpass',
          isAdmin: false,
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('already exists');
    });

    it('should reject invalid input', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: '',
          password: 'pass',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          password: 'password123',
          isAdmin: false,
        });
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.username).toBe('testuser');
    });

    it('should reject invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toContain('Invalid credentials');
    });

    it('should reject non-existent user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'nonexistent',
          password: 'password123',
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toContain('Invalid credentials');
    });

    it('should reject missing credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({});

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/auth/me', () => {
    let token: string;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          password: 'password123',
          isAdmin: false,
        });
      token = response.body.token;
    });

    it('should return current user info with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.username).toBe('testuser');
      expect(response.body).not.toHaveProperty('password');
    });

    it('should reject request without token', async () => {
      const response = await request(app).get('/api/auth/me');

      expect(response.status).toBe(401);
    });

    it('should reject request with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalidtoken');

      expect(response.status).toBe(403);
    });
  });
});
