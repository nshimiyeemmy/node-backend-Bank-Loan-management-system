const mongoose = require("mongoose");
const Joi = require("joi");
const loanSchema = mongoose.Schema({
    amountRequested: {
        type:Number,
        required:true
    },
    amountToPay: {
        type:Number,
        default:( this.amountRequested * 0.18) + this.amountRequested,        
        required:true
    },
    amountUnpaid: {
        type:Number,
        default:this.amountToPay,
        required:true
    },
    AccountNumber: {
        ref: 'Customers',
        type: mongoose.Schema.Types.ObjectId
    },
    loanStatus:{
        type:String,
        default:"ONGOING",
        required:true
    }
    
});
const Loans = new mongoose.model("Loans",loanSchema);
//creating a function to validate data from the user
function validate(data) {
    const Schema = Joi.object({
        amountRequested: Joi.number().required(),
        amountToPay: Joi.number(),
        amountUnpaid: Joi.number(),
        AccountNumber:Joi.string().required(),
    });
    return Schema.validate(data);  
}

module.exports.validate = validate;
module.exports.Loans = Loans;


