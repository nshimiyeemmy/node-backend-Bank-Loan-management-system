const mongoose = require("mongoose");
const Joi = require('joi');
const bcrypt = require('bcrypt');
const crypto = require("crypto");
const jwt = require('jsonwebtoken');
const config = require('config');
const customerSchema = mongoose.Schema({
    fullname: {
        type:String,
        max:30,
        min:5,
        required:true,
    },
    country: {
        type:String,
        required:true,
    },
    email: {
        type:String,
        unique: true,
        required:true,
    },
    password: {
        type:String,
        required:true,
    },
    AccountNumber: {
        type:String,
    },
    Bankname: {
        ref: 'Banks',
        type: mongoose.Schema.Types.ObjectId
    }
})
customerSchema.methods.generateAuthToken = function () {
    return jwt.sign({
        id:this._id,
         AccountNumber: this.AccountNumber ,     
         fullname: this.fullname,
         email: this.email        
    }, config.get("KEY"));
}
const Customers = new mongoose.model("Customers",customerSchema);

customerSchema.pre('save',async function(next){
    try {
    const salt = await bcrypt.genSalt(10);
    const hashedPasswaord = await bcrypt.hash(this.password,salt);
    this.password = hashedPasswaord;
    next();
    } catch (error) {
        next(error)
    }   
})
//creating a function to validate data from the user
function validate(data) {
    const Schema = Joi.object({
        fullname: Joi.string().min(5).max(30).required() ,
         email:Joi.string().email().required(),
         country:Joi.string().required(),
         password:Joi.string().required(),
         AccountNumber:Joi.string(),
         Bankname:Joi.string().required()

    });
    return Schema.validate(data);
    
}
const randomAccounts = function randomAccountNumber() {
    var pass = ''; 
            var str = '123456789'   
                    + 'ABCDE@#$'; 
              
            for (i = 1; i <= 10; i++) { 
                var char = Math.floor(Math.random() 
                            * str.length + 1); 
                pass += str.charAt(char) 
            }   
            return pass;  
}
module.exports.validate = validate;
module.exports.Customers = Customers;
module.exports.randomAccounts = randomAccounts;

