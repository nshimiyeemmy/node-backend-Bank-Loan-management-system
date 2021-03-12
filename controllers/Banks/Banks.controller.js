const express = require("express");
const Joi = require("joi");

const {validate, Banks} = require("../../models/Banks/banks.model")
const router = express.Router();

//getting all the users
router.get('/', async (req,res)=>{
    try {
        const banks = await Banks.find();
        //if there is no user found in the table users return below
        if(banks.length<1) return res.send("No Bank found!!");
        return res.status(200).send(banks);

    } catch (error) {
        console.log(error);
    }
});

//getting the bank by id
router.get('/:id',  async (req,res)=>{
    try {
        const banks = await Banks.findById(req.params.id);
        if (!banks) 
        return res.status(404).send('Bank not found')
        return res.status(200).send(banks);

    } catch (error) {
        console.log(error);
    }
});
//posting the users
router.post('/',async(req,res) =>{
    try {
        const {error} = validate(req.body); 
        if (error) return res.send(error.details[0].message);
        //finding if the email exists
        const BanknameExists = await Banks.findOne({Bankname: req.body.Bankname});
        if(BanknameExists)
        return res.send("The Bank you Entered already exists");
        //else do below
        const newBank = new Banks(req.body);
        const saved = await newBank.save();
       return res.send(saved);
    } catch (error) {
        console.log(error);
    }
});
//this is to update the entire user contents
router.put('/:id',async(req,res) =>{
    try {

        const{error} = validate(req.body);
        if(error) return res.send(error.details[0].message)

        const bank = await Banks.findById(req.params.id);
        if (!bank) return res.send('Bank Not found!!!');
        const updated = await Banks.findByIdAndUpdate(req.params.id, req.body, {new: true});
        return res.send(updated);   
    } catch (error) {

        console.log(error)
        
    }
});

router.delete('/',async(req,res)=>{
    try {
        const bank = await Banks.find();
        if(!bank) return res.send("Banks does not exists");
        const deleted = await Banks.deleteMany({});
        return res.send("Bank Deleted Successfully.");
        
    } catch (error) {
        console.log(error);   
    }
    });

//api to delete user data;
router.delete('/:id',async(req,res)=>{
try {
    const bank = await Banks.findById(req.params.id);
    if(!bank) return res.send("Bank does not exists");
    const deleted = await Banks.findByIdAndDelete(req.params.id);
    return res.send("Bank Deleted Successfully.");
    
} catch (error) {
    console.log(error);   
}
});
module.exports = router