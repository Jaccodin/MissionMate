const request = require('supertest');
const app = require('../app');

test('GET /goals returns 200', async () => {
  const response = await request(app).get('/goals');
  expect(response.statusCode).toBe(200);
});
