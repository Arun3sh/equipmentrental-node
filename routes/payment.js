import express, { request, response } from 'express';
import Razorpay from 'razorpay';
import { auth } from './auth.js';
import crypto from 'crypto';
import { updateUserOrder } from '../helper.js';

const router = express.Router();

// For creating order
router.post('/order', auth, async (request, response) => {
	try {
		const { amount } = request.body;
		const myinstance = new Razorpay({
			key_id: process.env.RAZORPAY_KEY_ID,
			key_secret: process.env.RAZORPAY_SECRET,
		});
		console.log(amount);
		const options = {
			amount: amount * 100, // amount in smallest currency unit
			currency: 'INR',
			receipt: 'receipt#1',
			payment_capture: 0, //1
		};

		myinstance.orders.create(options, function (err, order) {
			// res.status(200).json(order);
			console.log(order, '1');
			response.send(order);
		});
	} catch (err) {
		response.status(500).send({ error: err });
	}
});

router.post('/success', auth, async (req, res) => {
	try {
		// getting the details back from our font-end
		const { orderCreationId, razorpayPaymentId, razorpayOrderId, userCart, userId } = req.body;
		const razorpay_signature = req.headers['x-razorpay-signature'];

		// Creating our own digest
		// The format should be like this:
		// digest = hmac_sha256(orderCreationId + "|" + razorpayPaymentId, secret);

		const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET);

		hmac.update(`${orderCreationId}|${razorpayPaymentId}`);

		const digested = hmac.digest('hex');

		// comaparing our digest with the actual signature
		if (digested !== razorpay_signature) {
			return res.status(400).json({ emsg: 'Transaction not legit!' });
		}

		const result = await updateUserOrder(userId, userCart);

		res.json({
			msg: 'Payment Received Successfully',
			orderId: razorpayOrderId,
			paymentId: razorpayPaymentId,
			result: result,
		});
	} catch (error) {
		res.status(500).json({ error: error });
	}
});

export const paymentRouter = router;
