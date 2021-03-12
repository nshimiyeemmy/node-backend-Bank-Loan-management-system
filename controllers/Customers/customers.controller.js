const express = require("express")
const {validate,randomAccounts, Customers} = require("../../models/Customers/customers.model");
const { Banks } = require("../../models/Banks/banks.model");
const bcrypt = require('bcrypt');
const router = express.Router();

//getting all the users
router.get('/', async (req,res)=>{
    try {
        const customers = await Customers.find();
        //if there is no user found in the table users return below
        if(customers.length<1) return res.send("No user found!!");
        return res.status(200).send(customers);

    } catch (error) {
        console.log(error);
    }
});

//getting the user by id
router.get('/:id',  async (req,res)=>{
    try {
        const customers = await Customers.findById(req.params.id);
        if (!customers) 
        return res.status(404).send('User not found')
        return res.status(200).send(customers);

    } catch (error) {
        console.log(error);
    }
});
//posting the customers in the database;
router.post('/',async(req,res) =>{
    try {
        const {error} = validate(req.body); 
        if (error) return res.send(error.details[0].message);
        //finding if the email exists
        const emailExists = await Customers.findOne({email: req.body.email});
        if(emailExists)return res.send("Email already exists");

        const banks = await Banks.findOne({ _id: req.body.Bankname });
        if (!banks) return res.send("Bank does not exist");

        const bankAccount = await randomAccounts();
        AccountNumber = bankAccount;
        const newCustomer = new Customers({fullname:req.body.fullname,country:req.body.country,email:req.body.email,password:req.body.password, 
        AccountNumber,Bankname: req.body.Bankname});
        const saved = await newCustomer.save();
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

        const Customer = await Customers.findById(req.params.id);
        if (!Customer) return res.send('User Not found!!!');
        const updated = await Customers.findByIdAndUpdate(req.params.id, req.body, {new: true});
        return res.send(updated);   
    } catch (error) {

        console.log(error)
        
    }
})
//api to delete user data;
router.delete('/:id',async(req,res)=>{
try {
    const Customer = await Customers.findById(req.params.id);
    if(!Customer) return res.send("User does not exists");
    const deleted = await User.findByIdAndDelete(req.params.id);
    return res.send("User Deleted Successfully.");
    
} catch (error) {
    console.log(error);   
}
});

//api to logg users into the system
router.post('/login', async (req,res) => {
    try {
    // const {error} = validate(req.body);
    // if(error) return res.send(error.details[0].message);
    // res.send(req.body)
    let customer = await Customers.findOne({email: req.body.email});
    if (!customer) return res.send('Invalid Email or Password.')
  
    const validPassword = await bcrypt.compare(req.body.password, customer.password);
    if (!validPassword) return res.send('Invalid Email or Password.')
    const token = customer.generateAuthToken();
    res.send({token});
} catch (error) {
        console.log(error);
}
  });
module.exports = router