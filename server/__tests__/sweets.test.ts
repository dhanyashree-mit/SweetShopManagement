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

describe('Sweets API', () => {
  describe('POST /api/sweets', () => {
    it('should allow admin to create a sweet', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Chocolate Truffles',
          category: 'Chocolate',
          price: 12.99,
          quantity: 50,
        });

      expect(response.status).toBe(201);
      expect(response.body.name).toBe('Chocolate Truffles');
      expect(response.body.price).toBe(12.99);
      expect(response.body).toHaveProperty('id');
    });

    it('should reject non-admin user from creating sweets', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Gummy Bears',
          category: 'Gummies',
          price: 5.99,
          quantity: 100,
        });

      expect(response.status).toBe(403);
    });

    it('should reject unauthenticated requests', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .send({
          name: 'Lollipops',
          category: 'Lollipops',
          price: 3.99,
          quantity: 75,
        });

      expect(response.status).toBe(401);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Incomplete',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/sweets', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Chocolate',
          category: 'Chocolate',
          price: 10.00,
          quantity: 50,
        });

      await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Gummies',
          category: 'Gummies',
          price: 5.00,
          quantity: 100,
        });
    });

    it('should return all sweets for authenticated users', async () => {
      const response = await request(app)
        .get('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
    });

    it('should reject unauthenticated requests', async () => {
      const response = await request(app).get('/api/sweets');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/sweets/search', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Dark Chocolate',
          category: 'Chocolate',
          price: 15.00,
          quantity: 30,
        });

      await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Milk Chocolate',
          category: 'Chocolate',
          price: 10.00,
          quantity: 50,
        });

      await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Gummy Bears',
          category: 'Gummies',
          price: 5.00,
          quantity: 100,
        });
    });

    it('should search by name', async () => {
      const response = await request(app)
        .get('/api/sweets/search?name=chocolate')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
    });

    it('should search by category', async () => {
      const response = await request(app)
        .get('/api/sweets/search?category=Gummies')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].name).toBe('Gummy Bears');
    });

    it('should search by price range', async () => {
      const response = await request(app)
        .get('/api/sweets/search?minPrice=10&maxPrice=20')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
    });
  });

  describe('PUT /api/sweets/:id', () => {
    let sweetId: number;

    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Original',
          category: 'Chocolate',
          price: 10.00,
          quantity: 50,
        });
      sweetId = createResponse.body.id;
    });

    it('should allow admin to update sweet', async () => {
      const response = await request(app)
        .put(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Updated',
          price: 12.00,
        });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated');
      expect(response.body.price).toBe(12.00);
      expect(response.body.category).toBe('Chocolate');
    });

    it('should reject non-admin update attempts', async () => {
      const response = await request(app)
        .put(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          price: 15.00,
        });

      expect(response.status).toBe(403);
    });

    it('should return 404 for non-existent sweet', async () => {
      const response = await request(app)
        .put('/api/sweets/9999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          price: 20.00,
        });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/sweets/:id', () => {
    let sweetId: number;

    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'To Delete',
          category: 'Chocolate',
          price: 10.00,
          quantity: 50,
        });
      sweetId = createResponse.body.id;
    });

    it('should allow admin to delete sweet', async () => {
      const response = await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(204);

      const getResponse = await request(app)
        .get(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(getResponse.status).toBe(404);
    });

    it('should reject non-admin delete attempts', async () => {
      const response = await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
    });
  });
});
