const routes = require('../config/routes');
const Contribution = require('../models/contribution');
const Invoice = require('../models/invoice');

module.exports = (app, express, middleware) => {
    const router = express.Router();

    router.post('/', async (req, res) => {
        try {
            if (!req.body.amount || !req.body.invoiceID) throw ("Invalid contribution data supplied");
            let foundInvoice = await Invoice.findById(req.body.invoiceID);
            if (!foundInvoice) throw ("Invalid invoice id");
            let data = {
                amount: req.body.amount,
                invoice: foundInvoice._id
            }
            let newContribution = await Contribution.create(data);
            res.send({ contribution: newContribution });
        } catch (e) {
            console.log(e);
            res.status(400).send();
        }
    });
    router.get('/:id', async (req, res) => {
        try {
            let foundContribution = await Contribution.findById(req.params.id);
            if (!foundContribution) throw ("Invalid contribution ID");
            res.send({ contribution: foundContribution });
        } catch (e) {
            console.log(e);
            res.status(400).send();
        }
    });

    app.use(routes.contribution, router);
}