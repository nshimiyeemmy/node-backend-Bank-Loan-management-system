const mongoose = require("mongoose");
const Joi = require("joi");
const bankSchema = mongoose.Schema({
    Bankname: {
        type:String,
        required:true,
        max:20,
        min:5,
    },
    Location: {
        type:String,
        required:true,
        max:15,
        min:5,
    }
});
const Banks = new mongoose.model("Banks",bankSchema);

//creating a function to validate data from the user
function validate(data) {
    const Schema = Joi.object({
        Bankname: Joi.string().min(5).max(20).required(),
        Location:Joi.string().min(5).max(15).required()
    });
    return Schema.validate(data);
    
}
module.exports.validate = validate;
module.exports.Banks = Banks;

