const mongoose = require('mongoose');

const UserDetails = new mongoose.Schema({

    userId : String,
    tradeDatails:[{
        PartyCode : String,
        EXCHANGE : String,
        'Trade Date' : String,
        'Scrip CD' : String,
        'Scrip Name' : String,
        ISIN : String,
        Series : String,
        'Buy Qty' : String,
        'Buy Rate' : String,
        'Buy Amount' : String,
        'Sell Qty' : String,
        'Sell Rate' : String,
        "Sell Amount" : String,
        "Net Qty" : String,
        'Net Amount' : String,
    }]
});

module.exports = mongoose.model('UserDetails', UserDetails);