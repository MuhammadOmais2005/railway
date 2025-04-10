require("dotenv").config();
const mongoose = require("mongoose");
mongoose.connect(process.env.URL,{
    // useCreateIndex:true,
    // useNewUrlParser:true,
    // useUnifiedTopology:true
}).then(()=>{
    console.log("Connection is succesfull");
}).catch((e)=>{
    console.log("No conection")
});