import request from 'supertest';
import express from 'express';
import { registerRoutes } from '../routes';
import Database from 'better-sqlite3';

let app: express.Express;
let server: any;
let userToken: string;
let adminToken: string;

beforeAll(async () => {
  app = express();
  app.use(express.json());
  server = await registerRoutes(app);
});

afterAll(() => {
  server.close();
});

beforeEach(async () => {
  // Clear database before each test
  const sqlite = new Database('sqlite.db');
  sqlite.exec('DELETE FROM users');
  sqlite.exec('DELETE FROM sweets');
  sqlite.close();

  // Create test users
  const userResponse = await request(app)
    .post('/api/auth/register')
    .send({
      username: 'user',
      password: 'password',
      isAdmin: false,
    });
  userToken = userResponse.body.token;

  const adminResponse = await request(app)
    .post('/api/auth/register')
    .send({
      username: 'admin',
      password: 'password',
      isAdmin: true,
    });
  adminToken = adminResponse.body.token;
});

describe('Inventory Management API', () => {
  describe('POST /api/sweets/:id/purchase', () => {
    let sweetId: number;

    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Sweet',
          category: 'Chocolate',
          price: 10.00,
          quantity: 50,
        });
      sweetId = createResponse.body.id;
    });

    it('should allow users to purchase sweets', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          quantity: 5,
        });

      expect(response.status).toBe(200);
      expect(response.body.quantity).toBe(45);
    });

    it('should prevent purchase when insufficient stock', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          quantity: 100,
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Insufficient stock');
    });

    it('should reject invalid quantity', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          quantity: 0,
        });

      expect(response.status).toBe(400);
    });

    it('should reject purchase of non-existent sweet', async () => {
      const response = await request(app)
        .post('/api/sweets/9999/purchase')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          quantity: 1,
        });

      expect(response.status).toBe(400);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .send({
          quantity: 5,
        });

      expect(response.status).toBe(401);
    });

    it('should handle multiple sequential purchases correctly', async () => {
      await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 10 });

      await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 15 });

      const response = await request(app)
        .get(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.body.quantity).toBe(25);
    });
  });

  describe('POST /api/sweets/:id/restock', () => {
    let sweetId: number;

    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Sweet',
          category: 'Chocolate',
          price: 10.00,
          quantity: 10,
        });
      sweetId = createResponse.body.id;
    });

    it('should allow admin to restock sweets', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          quantity: 50,
        });

      expect(response.status).toBe(200);
      expect(response.body.quantity).toBe(60);
    });

    it('should reject non-admin restock attempts', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          quantity: 50,
        });

      expect(response.status).toBe(403);
    });

    it('should reject invalid quantity', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          quantity: -10,
        });

      expect(response.status).toBe(400);
    });

    it('should return 404 for non-existent sweet', async () => {
      const response = await request(app)
        .post('/api/sweets/9999/restock')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          quantity: 50,
        });

      expect(response.status).toBe(404);
    });
  });

  describe('Integration: Purchase and Restock Flow', () => {
    let sweetId: number;

    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Sweet',
          category: 'Chocolate',
          price: 10.00,
          quantity: 20,
        });
      sweetId = createResponse.body.id;
    });

    it('should handle complete inventory lifecycle', async () => {
      // Initial purchase
      let response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 15 });
      expect(response.body.quantity).toBe(5);

      // Admin restocks
      response = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 100 });
      expect(response.body.quantity).toBe(105);

      // Another purchase
      response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 50 });
      expect(response.body.quantity).toBe(55);
    });
  });
});
