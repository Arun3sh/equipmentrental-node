// After updating type as module in package json using new import statements
import express, { request, response } from 'express';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { productsRouter } from './routes/products.js';
import { usersRouter } from './routes/users.js';
import { paymentRouter } from './routes/payment.js';
import cors from 'cors';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;

const MONGO_URL = process.env.MONGO_URL;

async function createConnection() {
	const client = new MongoClient(MONGO_URL);
	await client.connect();
	console.log('mongo');
	return client;
}

export const client = await createConnection();

app.get('/', (request, response) => {
	response.send('Hello 🌏 heroku');
});

app.use('/products', productsRouter);

app.use('/users', usersRouter);

app.use('/payment', paymentRouter);

app.listen(PORT, () => console.log('Server started', PORT));
