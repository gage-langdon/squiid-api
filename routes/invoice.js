const routes = require('../config/routes');
const Invoice = require('../models/invoice');
const Contribution = require('../models/contribution');
const qrcode = require('../utilities/qrcode');

module.exports = (app, express, middleware) => {
    const router = express.Router();

    router.post('/', async (req, res) => {
        try {
            if (!req.body.total) throw ("Invalid invoice data supplied");
            let data = {
                total: req.body.total,
                // location: req.location._id
            }
            let newInvoice = await Invoice.create(data);
            let QR = await qrcode.create(newInvoice._id.toString());
            res.send({ invoice: newInvoice, qrcode: QR });
        } catch (e) {
            console.log(e);
            res.status(400).send();
        }
    });
    router.get('/:id', async (req, res) => {
        try {
            let foundInvoice = await Invoice.findById(req.params.id);
            if (!foundInvoice) throw ("Invalid invoice ID");
            let foundContributions = await Contribution.find({ invoice: req.params.id });
            let QR = await qrcode.create(foundInvoice._id.toString());
            res.send({ invoice: foundInvoice, qrcode: QR, contributions: foundContributions });
        } catch (e) {
            console.log(e);
            res.status(400).send();
        }
    });

    app.use(routes.invoice, router);
}