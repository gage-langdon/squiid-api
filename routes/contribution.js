const routes = require('../config/routes');
const Contribution = require('../models/contribution');
const Invoice = require('../models/invoice');
const middleware = require('../utilities/middleware');
const util = require('../utilities/contribution');

module.exports = (app, express) => {
    const router = express.Router();

    router.post('/', async (req, res) => {
        try {
            let user = await middleware.user(req);
            if (!req.body.amount || !req.body.invoiceID) throw ("Invalid contribution data supplied");
            let foundInvoice = await Invoice.findById(req.body.invoiceID);
            if (!foundInvoice) throw ("Invalid invoice id");
            if (await util.isFullfilled(req.body.invoiceID)) throw ("Invoice already fulfulled");
            let data = {
                amount: req.body.amount,
                invoice: foundInvoice._id,
                user: user._id.toString()
            }
            let newContribution = await Contribution.create(data);
            res.send({ contribution: newContribution });
        } catch (e) {
            res.status(400).send({ error: e.toString() });
        }
    });
    router.get('/:id', async (req, res) => {
        try {
            let foundContribution = await Contribution.findById(req.params.id);
            if (!foundContribution) throw ("Invalid contribution ID");
            res.send({ contribution: foundContribution });
        } catch (e) {
            res.status(400).send({ error: e.toString() });
        }
    });

    app.use(routes.contribution, router);
}