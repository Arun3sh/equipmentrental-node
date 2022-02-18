import { client } from './index.js';
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';

// Find all users
async function findAllUsers(filter) {
	return await client.db('mern').collection('users').find(filter).toArray();
}

// Find one user
async function findUserWithId(id) {
	return await client
		.db('mern')
		.collection('users')
		.findOne({ _id: ObjectId(id) });
}

// Add new user
async function addUsers(data) {
	return await client.db('mern').collection('users').insertOne(data);
}

// Find user email
async function findUserEmail(filter) {
	return client.db('mern').collection('users').findOne(filter);
}

async function genPassword(password) {
	const salt = await bcrypt.genSalt(10);

	const hashedPassword = await bcrypt.hash(password, salt);

	return hashedPassword;
}

async function updateUserOrder(id, updateOrder) {
	return await client
		.db('mern')
		.collection('users')
		.updateOne({ id: id }, { $push: { orders: updateOrder } });
}

export { findAllUsers, findUserWithId, findUserEmail, addUsers, genPassword, updateUserOrder };
