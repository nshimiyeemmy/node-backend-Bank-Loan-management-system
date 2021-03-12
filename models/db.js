const mongoose = require('mongoose');
const path = "mongodb://localhost:27017/LMS";

mongoose.connect(path,{
    useUnifiedTopology:true,
    useNewUrlParser:true,
    useFindAndModify:false,
    useCreateIndex:true
}).then(response =>console.log("Connected to DB Successfully.")).catch(error=>console.log("Failed to connect to DB"));



