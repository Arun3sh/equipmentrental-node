import express, { request, response } from 'express';
import { auth } from './auth.js';
import {
	getAllProducts,
	getProductById,
	addProduct,
	editProduct,
	deleteProduct,
} from '../helper.js';

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

	const getData = await getAllProducts(filter);
	response.send(getData);
});

// To get products based on id
router.get('/:id', async (request, response) => {
	const { id } = request.params;

	const getData = await getProductById(id);

	response.send(getData);
});

// To add product, auth is provided so only valid person can add data
router.post('/add-product', auth, async (request, response) => {
	const data = request.body;

	const result = await addProduct(data);
	response.send(result);
});

// To edit product, auth is provided so only valid person can edit data
router.put('/edit-product/:id', auth, async (request, response) => {
	const { id } = request.params;
	const updatedProduct = request.body;
	const result = await editProduct(id, updatedProduct);
	response.send(result);
});

// To edit product, auth is provided so only valid person can delete data
router.delete('/:id', auth, async (request, response) => {
	const { id } = request.params;
	const products = await deleteProduct(id);

	response.send(products);
});

export const productsRouter = router;
