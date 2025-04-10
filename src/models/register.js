const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const employeeSchema = new mongoose.Schema({
    firstname:{
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    gender : {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true,
    },
    passward: {
        type: String,
        required: true
    },
    confirmpassward: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true 
        }
    }]
});


employeeSchema.methods.generateAuthToken = async function(){
    try{
        const token = jwt.sign({_id: this._id.toString()}, "mynameismuhammadomais");
        this.tokens = this.tokens.concat({token: token});
        await this.save();
        return token;
    }
    catch(error){
        res.send(error);
        console.log(error);
    }
};


const bcrypt = require("bcrypt");

employeeSchema.pre("save", async function(next){
    if(this.isModified("passward")){
        console.log("Before hashing",this.passward);
        this.passward = String(this.passward);
        this.passward =  await bcrypt.hash(this.passward,10); 
        console.log("After hashing",this.passward);
        this.confirmpassward = undefined;
    }
    next();    
});

const Register = new mongoose.model("Register",employeeSchema);

module.exports = Register;
