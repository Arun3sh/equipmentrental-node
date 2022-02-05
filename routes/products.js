import express, { request, response } from 'express';

const router = express.Router();

router.get('/', async (request, response) => {
	const getData = await client.db('mern').collection('products');
	response.send(getData);
});

router.post('/', async (request, response) => {
	const data = request.body;
	const result = await client.db('mern').collection('products').insertMany(data);
	response.send(result);
});

export const productsRouter = router;
