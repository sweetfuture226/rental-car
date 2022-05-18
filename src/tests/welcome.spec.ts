import supertest from 'supertest';
import { app } from '../server';

const server = supertest(app);

describe('GET Welcome message /', () => {
	test('should send a welcome message on root route', async () => {
		const res = await server.get('/');

		expect(res.status).toBe(200);
		expect(res.body.message).toEqual('Welcome to crm');
	});

	test('should return a 404 status on a route that does not exist', async () => {
		const res = await server.get('/api/invalid');

		expect(res.status).toBe(404);
		expect(res.body.error).toEqual('Route /api/invalid Not found');
	});
});
