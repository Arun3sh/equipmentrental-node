import express, { request, response } from 'express';
import { addUsers, findUsername, genPassword } from '../helper.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { client } from './../index.js';
import { auth } from './auth.js';

const router = express.Router();

router.get('/', auth, async (request, response) => {
	const filter = request.query;
	if (filter.id) {
		filter.id = +filter.id;
	}
	const getData = await client.db('mern').collection('users').find(filter).toArray();
	response.send(getData);
});

// Post method to signup the user
router.post('/signup', async (request, response) => {
	const { username, password, email } = request.body;

	const checkUsername = await findUsername({ email: email });

	// To check password strength
	const passwordTester = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})');
	const strength = passwordTester.test(password);

	if (checkUsername) {
		response.status(400).send('Username already taken');
		return;
	}

	if (!strength) {
		response
			.status(400)
			.send(
				'Please make sure password contains a Uppercase, a lowercase, a special character and a number with a minimum of 8 characters'
			);
		return;
	}

	const hashedPassword = await genPassword(password);
	const result = await addUsers({ username: username, password: hashedPassword, email: email });

	response.send(result);
});

router.post('/login', async (request, response) => {
	const { username, password } = request.body;

	const checkUsername = await findUsername({ username: username });

	if (checkUsername === null) {
		// 401 is for unauthorized
		response.status(401).send('Username / Password incorrect');
		return;
	}

	const checkPassword = await bcrypt.compare(password, checkUsername.password);

	if (checkPassword) {
		const token = jwt.sign({ id: checkUsername._id }, process.env.SECRET_KEY);

		response.header('x-auth-token', token).send({ token: token });
	} else {
		// 401 is for unauthorized
		response.status(401).send('Username/Password incorrect');
		return;
	}
});

export const usersRouter = router;
