import express, { request, response } from 'express';
import { client } from './../index.js';
import { auth } from './auth.js';

const router = express.Router();

router.get('/', async (request, response) => {
	let filter = request.query;

	try {
		if (filter.name.length >= 4) {
			filter = { name: { $regex: `${filter.name}`, $options: 'i' } };
		} else {
			filter = {};
		}
	} catch (err) {
		console.log(err.message);
	}

	const getData = await client.db('mern').collection('products').find(filter).toArray();
	response.send(getData);
});

router.get('/:id', async (request, response) => {
	const { id } = request.params;

	const getData = await client
		.db('mern')
		.collection('products')
		.find({ id: +id })
		.toArray();
	response.send(getData);
});

router.post('/', async (request, response) => {
	const data = request.body;
	const result = await client.db('mern').collection('products').insertMany(data);
	response.send(result);
});

router.delete('/:id', auth, async (request, response) => {
	const { id } = request.params;
	const products = await client.db('mern').collection('products').deleteOne({ id: id });

	response.send(products);
});

export const productsRouter = router;
