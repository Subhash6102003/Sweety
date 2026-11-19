const request = require('supertest');
const app = require('../src/app');

// Mock supabase client module for fast, deterministic unit testing
jest.mock('../src/config/supabase', () => {
  const bcrypt = require('bcryptjs');
  const mockPasswordHash = bcrypt.hashSync('Password123!', 10);
  const mockReadings = [];

  const mockSupabase = {
    from: jest.fn((table) => {
      if (table === 'users') {
        return {
          select: jest.fn(() => ({
            eq: jest.fn((field, val) => ({
              maybeSingle: jest.fn(async () => {
                if (val === 'test@sweety.app') {
                  return {
                    data: {
                      id: 'user-test-123',
                      name: 'Test Patient',
                      email: 'test@sweety.app',
                      password_hash: mockPasswordHash
                    },
                    error: null
                  };
                }
                return { data: null, error: null };
              }),
              single: jest.fn(async () => ({
                data: {
                  id: 'user-test-123',
                  name: 'Test Patient',
                  email: 'test@sweety.app',
                  password_hash: mockPasswordHash
                },
                error: null
              }))
            }))
          }))
        };
      }

      if (table === 'readings') {
        return {
          select: jest.fn(() => ({
            eq: jest.fn((field1, val1) => ({
              eq: jest.fn(async (field2, val2) => ({
                data: mockReadings.filter(r => r.reading_date === val2),
                error: null
              }))
            }))
          })),
          insert: jest.fn((newRecord) => ({
            select: jest.fn(() => ({
              single: jest.fn(async () => {
                const item = { id: 'reading-' + (mockReadings.length + 1), ...newRecord };
                mockReadings.push(item);
                return { data: item, error: null };
              })
            }))
          }))
        };
      }

      return {};
    })
  };

  return { supabase: mockSupabase };
});

describe('Sweety Glucose Tracker API - Core Business Rules', () => {
  let authToken;

  beforeAll(async () => {
    // Generate valid auth token
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@sweety.app', password: 'Password123!' });

    authToken = res.body.token;
  }, 10000);

  test('Security: Rejects requests without Bearer token', async () => {
    const res = await request(app).get('/api/readings');
    expect(res.status).toBe(401);
    expect(res.body.error).toContain('Access denied');
  });

  test('Rule 1: Rejects missing value with "Please enter a glucose value."', async () => {
    const res = await request(app)
      .post('/api/readings')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        date: '2026-11-19',
        slot: 'Morning (fasting)',
        value: ''
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Please enter a glucose value.');
  });

  test('Rule 2a: Rejects value below 40 with "Value must be between 40 and 600 mg/dl."', async () => {
    const res = await request(app)
      .post('/api/readings')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        date: '2026-11-19',
        slot: 'Morning (fasting)',
        value: 35
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Value must be between 40 and 600 mg/dl.');
  });

  test('Rule 2b: Rejects value above 600 with "Value must be between 40 and 600 mg/dl."', async () => {
    const res = await request(app)
      .post('/api/readings')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        date: '2026-11-19',
        slot: 'Morning (fasting)',
        value: 650
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Value must be between 40 and 600 mg/dl.');
  });

  test('Rule 5: Rejects future date with "Date cannot be in the future."', async () => {
    const res = await request(app)
      .post('/api/readings')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        date: '2099-12-31',
        slot: 'Morning (fasting)',
        value: 110
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Date cannot be in the future.');
  });
});
