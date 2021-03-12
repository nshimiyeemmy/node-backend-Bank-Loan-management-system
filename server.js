const express = require('express');
const mongoose = require('mongoose');
require('./models/db');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended:true
}))
app.use(bodyParser.json());

const customerController = require("./controllers/Customers/customers.controller");
const bankController = require("./controllers/Banks/Banks.controller");
const loansController = require('./controllers/Loans/requestLoan.controller');

app.use('/api/Customers', customerController);
app.use('/api/Banks', bankController);
app.use('/api/loans', loansController);

app.listen(3000,()=>console.log("Bank Loan Management System running on Port 3000"));