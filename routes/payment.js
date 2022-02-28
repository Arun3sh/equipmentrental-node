import express, { request, response } from 'express';
import Razorpay from 'razorpay';
import { auth } from './auth.js';
import crypto from 'crypto';
import { updateUserOrder } from '../helper.js';

const router = express.Router();

// For creating order
router.post('/order', auth, async (request, response) => {
	try {
		const { amount, currency } = request.body;
		const myinstance = new Razorpay({
			key_id: process.env.RAZORPAY_KEY_ID,
			key_secret: process.env.RAZORPAY_SECRET,
		});

		const options = {
			amount: amount * 100, // amount in smallest currency unit
			currency: currency,
		};

		myinstance.orders.create(options, (err, order) => {
			if (!err) {
				response.json(order);
			} else {
				response.send(err);
			}
		});
	} catch (error) {
		response.status(500).send(error);
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
			return res.status(400).json({ msg: 'Transaction not legit!' });
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
