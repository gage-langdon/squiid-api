const Invoice = require('../models/invoice');
const Contribution = require('../models/contribution');

const getById = async (id) => {
    try {
        if (!id) throw ('Undefined invoice id');
        let foundInvoice = await Invoice.findById(id);
        if (!foundInvoice) throw ("Invalid invoice ID");
        let foundContributions = await Contribution.find({ invoice: id }).populate('user');
        foundContributions = foundContributions.map(item => ({
            username: item.user.username,
            thumbnail: item.user.thumbnail,
            amount: item.amount,
            dateCreated: item.dateCreated
        }));
        return {
            invoice: foundInvoice,
            contributions: foundContributions
        }
    } catch (e) {
        throw (e);
    }
}

module.exports = { getById }