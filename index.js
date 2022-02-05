import express, { request, response } from 'express';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { productsRouter } from './routes/products.js';

// const { response } = require('express');
// const express = require('express');
// const { request } = require('http');
// const {MondoClient} = require("mongodb")
dotenv.config();
const app = express();
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

// app.post('/products', express.json(), async (request, response) => {
// 	const data = request.body;
// 	console.log('incoming', data);
// 	const result = await client.db('mern').collection('products').insertMany(data);

// 	response.send(result);
// });
app.use('/products', productsRouter);

app.listen(PORT, () => console.log('Server started', PORT));
