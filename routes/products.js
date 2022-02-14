import express, { request, response } from 'express';
import { client } from './../index.js';
import { auth } from './auth.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

// To send all the products
router.get('/', async (request, response) => {
	let filter = request.query;

	// Incase if product is searched in search bar and i to ignore case sensitivity
	try {
		if (filter.name && filter.name.length >= 4) {
			filter = { name: { $regex: `${filter.name}`, $options: 'i' } };
		} else if (!filter.category) {
			filter = {};
		}
	} catch (err) {
		console.log(err.message);
	}

	const getData = await client
		.db('mern')
		.collection('products')
		.find(filter)
		.sort({ name: 1 })
		.toArray();
	response.send(getData);
});

// To get products based on id
router.get('/:id', async (request, response) => {
	const { id } = request.params;

	const getData = await client
		.db('mern')
		.collection('products')
		.findOne({ _id: ObjectId(id) });

	response.send(getData);
});

// To add product, auth is provided so only valid person can add data
router.post('/add-product', auth, async (request, response) => {
	const data = request.body;
	console.log(data);
	const result = await client.db('mern').collection('products').insertMany([data]);
	response.send(result);
});

// To edit product, auth is provided so only valid person can add data
router.put('/edit-product/:id', auth, async (request, response) => {
	const { id } = request.params;
	const updatedProduct = request.body;
	const result = await client
		.db('mern')
		.collection('products')
		.updateOne({ _id: ObjectId(id) }, { $set: updatedProduct });
	response.send(result);
});

router.delete('/:id', auth, async (request, response) => {
	const { id } = request.params;
	const products = await client
		.db('mern')
		.collection('products')
		.deleteOne({ _id: ObjectId(id) });

	response.send(products);
});

export const productsRouter = router;
