const express = require("express")
const {AUTH_MIDDLEWARE} = require('../../middlewares/auth')
//const {validate,randomAccounts, Customers} = require("../../models/Customers/customers.model");
const {validate,Loans,amountToPay,amountUnpaid,loanStatus} = require("../../models/Loan/requestLoan.model");
const { Banks } = require("../../models/Banks/banks.model");
const router = express.Router();

//getting all the users
router.get('/', async (req,res)=>{
    try {
        const loans = await Loans.find();
        //if there is no user found in the table users return below
        if(loans.length<1) return res.send("No Loan found!!");
        return res.status(200).send(loans);

    } catch (error) {
        console.log(error);
    }
});

//getting the user by id
router.get('/:id',  async (req,res)=>{
    try {
        const loans = await Loans.findById(req.params.id);
        if (!loans) 
        return res.status(404).send('Loan not found')
        return res.status(200).send(loans);

    } catch (error) {
        console.log(error);
    }
});

//posting the loans in the database;
router.post('/',[AUTH_MIDDLEWARE],async(req,res) =>{
    try {
        const {error} = validate(req.body); 
        if (error) return res.send(error.details[0].message);

        //finding if the account number is already registered with a loan
        const alreadyHaveLoan = await Loans.findOne({AccountNumber:req.body.AccountNumber,
            amountUnpaid  : {$ne : 0}
        })

        if(alreadyHaveLoan) return res.send("You must pay the first loan to get new loan")
        
        const newLoanRequest = new Loans(
            {
                AccountNumber:req.body.AccountNumber,
                amountRequested: req.body.amountRequested
            });
        
        newLoanRequest.amountToPay = parseFloat(( req.body.amountRequested * 0.18) + req.body.amountRequested)
        newLoanRequest.amountUnpaid = newLoanRequest.amountToPay

        const saved = await newLoanRequest.save();

       return res.send(saved);
    } catch (error) {
        console.log(error);
    }
});
module.exports = router