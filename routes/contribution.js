const routes = require('../config/routes');
const Contribution = require('../models/contribution');
const Invoice = require('../models/invoice');
const middleware = require('../utilities/middleware');
const util = require('../utilities/contribution');

module.exports = (app, express, socketIO) => {
	const router = express.Router();

	/*
		Add Contribution
	*/
	router.post('/', async (req, res) => {
		try {
			let user = await middleware.user(req.headers['authorization']);
			if (!req.body.amount || !req.body.invoiceID) throw 'Invalid contribution data supplied';

			// Verify invoice
			let foundInvoice = await Invoice.findById(req.body.invoiceID);
			if (!foundInvoice) throw 'Invalid invoice id';
			if (await util.isFullfilled(req.body.invoiceID)) throw 'Invoice already fulfulled';

			// Save Contribution
			let data = {
				amount: req.body.amount,
				invoice: foundInvoice._id,
				user: user._id.toString(),
				dateCreated: new Date()
			};
			let newContribution = await Contribution.create(data);

			// Update other contributors on the invoice
			let contributions = await util.get(req.body.invoiceID);
			await socketIO.to(req.body.invoiceID).emit('contribution', { contributions });

			res.send({ contributions });
		} catch (e) {
			res.status(400).send({ error: e.toString() });
		}
	});

	/*
		Retrive a specific contribution
	*/
	router.get('/:id', async (req, res) => {
		try {
			let foundContribution = await Contribution.findById(req.params.id);
			if (!foundContribution) throw 'Invalid contribution ID';
			res.send({ contribution: foundContribution });
		} catch (e) {
			res.status(400).send({ error: e.toString() });
		}
	});

	app.use(routes.contribution, router);
};
