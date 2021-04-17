import { describe, test, expect, afterAll } from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';

import app from '../src/server';
import { User } from '../src/models/user';

afterAll(async () => {
	await mongoose.connection.close();
});

// Signup API tests
describe('POST /signup', () => {
	const name = 'Anonymous';
	const email = 'example@gmail.com';
	const password = 'strongPassword';

	test('Should return success response', async (done) => {
		const res = await request(app)
			.post('/signup')
			.send({ name, email, password })
			.expect(201)
			.expect('Content-Type', 'application/json; charset=utf-8');

		expect(res.body).toHaveProperty('message', 'Signup successful');
		expect(res.body).toHaveProperty('data.isSignedUp', true);

		await User.deleteOne({ email });
		if (done) {
			done();
		}
	});

	test('Should return error response for the duplicate email entry in the database', async (done) => {
		const user = await User.create({
			name,
			email,
			password
		});

		const res = await request(app)
			.post('/signup')
			.send({ name, email, password })
			.expect(400)
			.expect('Content-Type', 'application/json; charset=utf-8');

		expect(res.body).toHaveProperty(
			'message',
			'Email is already registered'
		);

		await user.deleteOne();

		if (done) {
			done();
		}
	});

	test('Should return error response for invalid name', async (done) => {
		const res = await request(app)
			.post('/signup')
			.send({ name: '', email, password })
			.expect(400)
			.expect('Content-Type', 'application/json; charset=utf-8');

		expect(res.body).toHaveProperty(
			'message',
			'name must be min 1 and max 30 characters long'
		);

		if (done) {
			done();
		}
	});

	test('Should return error response for invalid email', async (done) => {
		const res = await request(app)
			.post('/signup')
			.send({ name, email: '', password })
			.expect(400)
			.expect('Content-Type', 'application/json; charset=utf-8');

		expect(res.body).toHaveProperty('message', 'Invalid email');

		if (done) {
			done();
		}
	});

	test('Should return error response for invalid password', async (done) => {
		const res = await request(app)
			.post('/signup')
			.send({ name, email, password: '' })
			.expect(400)
			.expect('Content-Type', 'application/json; charset=utf-8');

		expect(res.body).toHaveProperty(
			'message',
			'Password must be min 8 characters long'
		);

		if (done) {
			done();
		}
	});
});

// Login API tests
describe('POST /login', () => {
	const email = 'ethan.hunt@gmail.com';
	const password = 'password123';

	test('Should return success response', async (done) => {
		const res = await request(app)
			.post('/login')
			.send({ email, password })
			.expect(200)
			.expect('Content-Type', 'application/json; charset=utf-8');

		expect(res.body).toHaveProperty('message', 'Login successful');
		expect(res.body).toHaveProperty('data.isLoggedIn', true);
		expect(res.headers).toHaveProperty('set-cookie');
		expect(res.headers).toHaveProperty('authorization');

		if (done) {
			done();
		}
	});

	test('Should return error response for invalid email', async (done) => {
		const res = await request(app)
			.post('/login')
			.send({ email: '', password })
			.expect(400)
			.expect('Content-Type', 'application/json; charset=utf-8');

		expect(res.body).toHaveProperty('message', 'Invalid email');

		if (done) {
			done();
		}
	});

	test('Should return error response for invalid password', async (done) => {
		const res = await request(app)
			.post('/login')
			.send({ email, password: '' })
			.expect(400)
			.expect('Content-Type', 'application/json; charset=utf-8');

		expect(res.body).toHaveProperty(
			'message',
			'Password must be atleast 8 characters long'
		);

		if (done) {
			done();
		}
	});

	test('Should return error response for email not found in the database', async (done) => {
		const res = await request(app)
			.post('/login')
			.send({ email: 'example@gmail.com', password })
			.expect(404)
			.expect('Content-Type', 'application/json; charset=utf-8');

		expect(res.body).toHaveProperty('message', 'Email not registered');

		if (done) {
			done();
		}
	});

	test('Should return error response for password does not match', async (done) => {
		const res = await request(app)
			.post('/login')
			.send({ email, password: 'passwordDoesNotMatch' })
			.expect(400)
			.expect('Content-Type', 'application/json; charset=utf-8');

		expect(res.body).toHaveProperty('message', 'Password does not match');

		if (done) {
			done();
		}
	});
});

// Weather API tests
describe('GET /weather', () => {
	test('Should return 5 day weather forecast', async (done) => {
		const res = await request(app)
			.get('/weather')
			.expect(200)
			.expect('Content-Type', 'application/json; charset=utf-8');

		expect(res.body).toHaveProperty('data.count', 5);
		expect(res.body).toHaveProperty('data.unit', 'metric');
		expect(res.body).toHaveProperty('data.location', 'Pune');
		expect(res.body).toHaveProperty('data.latitude', '18.524766');
		expect(res.body).toHaveProperty('data.longitude', '73.792927');
		if (done) {
			done();
		}
	});
});

// News API tests
describe('GET /news', () => {
	const searchQuery = 'bitcoin';
	const cookie =
		'rt=s%3Aa622429a-548f-4ef2-a6a8-8b1a5309ca62.6jR%2B8tg8YLDXYbiCSoUp9tmPeXTIiZLBUTKpB9GEBcE; Path=/; HttpOnly';
	const jwt =
		'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwNzZiMDg5NTlhNWU1YzU5MWNjYjZjMyIsImlhdCI6MTYxODU5MzIyMywiZXhwIjoxNjI4NTk2ODIzfQ.NfUcJT4jvwcGYhTDOmIqg2Cn6OBz98Bf_0GGDUgpHRQqunEz8p12F6F_0_p6L-8hsTkJaCwVJNDTYZF3x1F_1Q';

	test('Should return bitcoin related news', async (done) => {
		const res = await request(app)
			.get(`/news?search=${searchQuery}`)
			.set('Cookie', [cookie])
			.set('Authorization', `Bearer ${jwt}`)
			.expect(200)
			.expect('Content-Type', 'application/json; charset=utf-8');

		expect(res.body).toHaveProperty(
			'message',
			'Showing results from 1 to 20'
		);
		expect(res.body).toHaveProperty('data.searchQuery', searchQuery);
		expect(res.body).toHaveProperty('data.page', 1);
		expect(res.body).toHaveProperty('data.data.length', 20);
		if (done) {
			done();
		}
	});

	test('Should return error for no search query', async (done) => {
		const res = await request(app)
			.get(`/news?search`)
			.set('Cookie', [cookie])
			.set('Authorization', `Bearer ${jwt}`)
			.expect(400)
			.expect('Content-Type', 'application/json; charset=utf-8');

		expect(res.body).toHaveProperty(
			'message',
			'Please enter a search query'
		);
		if (done) {
			done();
		}
	});

	test('Should return error for non integer page value', async (done) => {
		const page = '1.2';

		const res = await request(app)
			.get(`/news?search=${searchQuery}&page=${page}`)
			.set('Cookie', [cookie])
			.set('Authorization', `Bearer ${jwt}`)
			.expect(400)
			.expect('Content-Type', 'application/json; charset=utf-8');

		expect(res.body).toHaveProperty(
			'message',
			'Page number should be an integer'
		);
		if (done) {
			done();
		}
	});

	test('Should return error for the page value less than 1', async (done) => {
		const page = '0';

		const res = await request(app)
			.get(`/news?search=${searchQuery}&page=${page}`)
			.set('Cookie', [cookie])
			.set('Authorization', `Bearer ${jwt}`)
			.expect(400)
			.expect('Content-Type', 'application/json; charset=utf-8');

		expect(res.body).toHaveProperty('message', 'Page number starts from 1');
		if (done) {
			done();
		}
	});

	test('Should return error for the page value greater than 5', async (done) => {
		const page = '6';

		const res = await request(app)
			.get(`/news?search=${searchQuery}&page=${page}`)
			.set('Cookie', [cookie])
			.set('Authorization', `Bearer ${jwt}`)
			.expect(403)
			.expect('Content-Type', 'application/json; charset=utf-8');

		expect(res.body).toHaveProperty(
			'message',
			'You have requested too many results. Free accounts are limited to a max of 100 results. You are trying to request results from 101 to 120.'
		);
		if (done) {
			done();
		}
	});
});
