import express, { request, response } from 'express';
import {
	findAllUsers,
	findUserWithId,
	findUserEmail,
	addUsers,
	genPassword,
	updateUserOrder,
} from '../helper.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { auth } from './auth.js';

const router = express.Router();

router.get('/', auth, async (request, response) => {
	const filter = request.query;

	const getData = await findAllUsers(filter);
	response.send(getData);
});

router.get('/:id', auth, async (request, response) => {
	const { id } = request.params;

	const getData = await findUserWithId(id);

	response.send(getData);
});

// Post method to signup the user
router.post('/signup', async (request, response) => {
	const { username, password, email, orders, cart } = request.body;

	const checkUsername = await findUserEmail({ email: email });

	// To check password strength
	const passwordTester = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})');
	const strength = passwordTester.test(password);

	if (checkUsername) {
		response.status(400).send('User Email exists');
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
	const result = await addUsers({
		username: username,
		password: hashedPassword,
		email: email,
		orders: orders,
		cart: cart,
	});

	response.send(result);
});

router.post('/login', async (request, response) => {
	const { email, password } = request.body;

	const checkUsername = await findUserEmail({ email: email });

	if (checkUsername === null) {
		// 401 is for unauthorized
		response.status(401).send('Email / Password incorrect');
		return;
	}

	const checkPassword = await bcrypt.compare(password, checkUsername.password);

	if (checkPassword) {
		const token = jwt.sign({ id: checkUsername._id }, process.env.SECRET_KEY);

		response.header('x-auth-token', token).send({ token: token, id: checkUsername._id });
	} else {
		// 401 is for unauthorized
		response.status(401).send('Email/Password incorrect');
		return;
	}
});

router.put('/user-order/:id', auth, async (request, response) => {
	const { id } = request.params;
	const updateOrder = request.body;

	const result = await updateUserOrder(id, updateOrder);

	response.send(result);
});

router.get('/user-order/:id', async (request, response) => {
	const { id } = request.params;

	const result = await findUserWithId(id);
	response.send(result);
});

export const usersRouter = router;
