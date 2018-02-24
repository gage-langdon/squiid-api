const routes = require('../config/routes');
const Invoice = require('../models/invoice');
const Contribution = require('../models/contribution');
const qrcode = require('../utilities/qrcode');
const middleware = require('../utilities/middleware');

module.exports = (app, express) => {
	const router = express.Router();

	/*
		Create Invoice and save to locations account
	*/
	router.post('/', async (req, res) => {
		try {
			let location = await middleware.location(req);
			if (!req.body.total) throw 'Invalid invoice data supplied';

			// Create Invoice
			let data = {
				total: req.body.total,
				location: location._id.toString(),
				dateCreated: new Date()
			};
			let newInvoice = await Invoice.create(data);

			// Create QR code
			let QR = await qrcode.create(newInvoice._id.toString());

			res.send({ invoice: newInvoice, qrcode: QR });
		} catch (e) {
			res.status(400).send({ error: e.toString() });
		}
	});

	/*
		Get Invoices for authenticated location
	*/
	router.get('/', async (req, res) => {
		try {
			let location = await middleware.location(req);
			let foundInvoices = await Invoice.find({ location: location._id });
			res.send({ invoices: foundInvoices });
		} catch (e) {
			res.status(400).send({ error: e.toString() });
		}
	});

	/*
		Get Specific Invoice
	*/
	router.get('/:id', async (req, res) => {
		try {
			// retrieve invoice
			let foundInvoice = await Invoice.findById(req.params.id);
			if (!foundInvoice) throw 'Invalid invoice ID';

			// retrieve invoice's contributions
			let foundContributions = await Contribution.find({ invoice: req.params.id }).populate('user');

			foundContributions = foundContributions.map(item => ({
				username: item.user.username,
				thumbnail: item.user.thumbnail,
				amount: item.amount,
				dateCreated: item.dateCreated
			}));

			// create qr code for invoice
			let QR = await qrcode.create(foundInvoice._id.toString());
			res.send({ invoice: foundInvoice, qrcode: QR, contributions: foundContributions });
		} catch (e) {
			res.status(400).send({ error: e.toString() });
		}
	});

	app.use(routes.invoice, router);
};
