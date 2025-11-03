import request from 'supertest';
import app from '../src/main';
import { describe, it, expect } from 'vitest';

describe('GET /', () => {
  it('should return 200', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
  });
});
