import { client } from './index.js';
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';

// Users
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
	return await client.db('mern').collection('users').findOne(filter);
}

async function genPassword(password) {
	const salt = await bcrypt.genSalt(10);

	const hashedPassword = await bcrypt.hash(password, salt);

	return hashedPassword;
}

// To update user order
async function updateUserOrder(id, updateOrder) {
	return await client
		.db('mern')
		.collection('users')
		.updateOne({ _id: ObjectId(id) }, { $push: { orders: updateOrder } });
}

// ----- Products -----

// To get all products
async function getAllProducts(filter) {
	return await client.db('mern').collection('products').find(filter).sort({ name: 1 }).toArray();
}

// To get product by Id
async function getProductById(id) {
	return await client
		.db('mern')
		.collection('products')
		.findOne({ _id: ObjectId(id) });
}

//To add product
async function addProduct(data) {
	return await client.db('mern').collection('products').insertMany([data]);
}

// To edit product
async function editProduct(id, updatedProduct) {
	return await client
		.db('mern')
		.collection('products')
		.updateOne({ _id: ObjectId(id) }, { $set: updatedProduct });
}

// To delete product
async function deleteProduct(id) {
	return await client
		.db('mern')
		.collection('products')
		.deleteOne({ _id: ObjectId(id) });
}

export {
	findAllUsers,
	findUserWithId,
	findUserEmail,
	addUsers,
	genPassword,
	updateUserOrder,
	getAllProducts,
	getProductById,
	addProduct,
	editProduct,
	deleteProduct,
};
