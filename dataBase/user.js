const mongoose = require('mongoose');

const UserDetails = new mongoose.Schema({
    userName : String,
    PartyCode : {type :String, unique : true},
    password : String,
    email : String,
    mobileNo : String,
    dateOfBirth : String,
    panNo : String,
    firstLogin : String,
    tradeDatails:[{
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