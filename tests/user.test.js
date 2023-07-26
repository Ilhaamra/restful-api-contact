import supertest from 'supertest';
import { web } from '../src/application/web.js';
import { prismaClient } from '../src/application/connection.js';
import { createTestUser, removeTestUser } from './util-test.js';
import { logger } from '../src/application/logging.js';

describe('POST /api/users', function () {
  afterEach(async () => {
    await removeTestUser();
  });
  it('sould can register new user', async () => {
    const result = await supertest(web).post('/api/users').send({
      username: 'test',
      password: 'rahasia',
      name: 'test'
    });

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe('test');
    expect(result.body.data.name).toBe('test');
    expect(result.body.data.password).toBeUndefined();
  });

  it('should reject if request is invalid', async () => {
    const result = await supertest(web).post('/api/users').send({
      username: '',
      password: '',
      name: ''
    });

    logger.info(result.body);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});

describe('POST /api/users/login', function () {
  beforeEach(async () => {
    await createTestUser();
  });
  afterEach(async () => {
    await removeTestUser();
  });
  it('sould can login user', async () => {
    const result = await supertest(web).post('/api/users/login').send({
      username: 'test',
      password: 'rahasia'
    });
    expect(result.status).toBe(200);
    expect(result.body.data.token).toBeDefined();
    expect(result.body.data.token).not.toBe('test');
  });
});

describe('GET /api/users/current', function () {
  beforeEach(async () => {
    await createTestUser();
  });
  afterEach(async () => {
    await removeTestUser();
  });
  it('should can get current user', async () => {
    const result = await supertest(web).get('/api/users/current').set('Authorization', 'test');

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe('test');
    expect(result.body.data.name).toBe('test');
  });
});
