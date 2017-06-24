const Contribution = require('../models/contribution');
const Invoice = require('../models/invoice');

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

module.exports = { isFullfilled }