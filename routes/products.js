import express, { request, response } from 'express';
import { client } from './../index.js';

const router = express.Router();

router.get('/', async (request, response) => {
	const filter = request.query;
	if (filter.id) {
		filter.id = +filter.id;
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

router.post('/', express.json(), async (request, response) => {
	const data = request.body;
	const result = await client.db('mern').collection('products').insertMany(data);
	response.send(result);
});

export const productsRouter = router;
