const Contribution = require('../models/contribution');
const Invoice = require('../models/invoice');
const middleware = require('../utilities/middleware');

const isFullfilled = async (invoiceID) => {
    try {
        let invoice = await Invoice.findById(invoiceID);
        if (!invoice) throw ("invalid invoice id");
        let contributions = await Contribution.find({ invoice: invoiceID });
        if (!contributions || contributions.length < 1) return false;
        let totalContributed = 0;
        contributions.forEach(x => totalContributed += x.amount);
        if (totalContributed >= invoice.total) return true;
        else return false;
    } catch (e) {
        throw (e);
    }
};
const add = async (invoiceID, amount, userID) => {
    try {
        let foundInvoice = await Invoice.findById(invoiceID);
        if (!foundInvoice) throw ("Invalid invoice id");
        if (await isFullfilled(invoiceID)) throw ("Invoice already fulfulled");
        let data = {
            amount: amount,
            invoice: foundInvoice._id,
            user: userID,
            dateCreated: new Date()
        }
        let newContribution = await Contribution.create(data);
        newContribution = newContribution.populate('user')
        return newContribution;
    } catch (e) {
        throw (e);
    }
}
module.exports = { isFullfilled, add }