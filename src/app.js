require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const port = process.env.PORT || 3000;
require("./db/conn");
const Register = require("./models/register")
const hbs = require("hbs");
const cookieParser = require("cookie-parser")
app.use(cookieParser());
const auth = require("./middleware/auth")
// const staticPath = path.join(__dirname, "./public");
// app.use(express.static(staticPath));
// app.get("/",(req, res)=>{
    //     res.status(200).send("hi");
    // });
app.set("view engine", "hbs");
const tempaltePath = path.join(__dirname, "./templates/views");
const partialsPath = path.join(__dirname, "./templates/partials");

app.use(express.static(path.join(__dirname, "./public/css")));
app.set("views", tempaltePath);
hbs.registerPartials(partialsPath);
app.get("/",(req, res)=>{
    res.status(200).render("index");
});

app.get("/secret",auth,(req, res)=>{
    // console.log(`this is the cookie ${req.cookies.jwt}`);
    res.status(200).render("secret");
});

// app.get("/logout",auth,async(req, res)=>{
//     try{
//         console.log(req.user);
//         res.clearCookie("jwt");
//         console.log("logout succesfuly");
//         await req.user.save();
//         res.status(200).render("login");
//     }
//     catch(error){
//         res.status(500).send(error);
//     }
// });



app.get("/logout",auth,async(req, res)=>{
    try{
        console.log(req.user);
        res.clearCookie("jwt");

        // logout from single device
        // req.user.tokens = req.user.tokens.filter((currentElement)=>{
        //     return currentElement.token != req.token; 
        // })
        
        // logout from all devices
        req.user.tokens=[];

        console.log("logout succesfuly");
        await req.user.save();
        res.status(200).render("login");
    }
    catch(error){
        res.status(500).send(error);
    }
});

app.get("/register",(req, res)=>{
    res.status(200).render("register");
});


app.use(express.json())
app.use(express.urlencoded({extended:false}));

app.post("/register",async(req, res)=>{
    try{  
        const passward = req.body.passward;
        const cpassward = req.body.confirmpassward;
        if(passward === cpassward){
            const registerEmployee = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                gender: req.body.gender,
                age: req.body.age,
                phone: req.body.phone,
                email: req.body.email,
                passward: req.body.passward,
                confirmpassward: req.body.confirmpassward
            });

        const token = await registerEmployee.generateAuthToken();
        console.log("token part " + token);


        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 30000),
            httpOnly: true,
            // secure: true
        });
        console.log(res.cookie);

        const registered = await registerEmployee.save();
        console.log("register part " + registered);
        res.status(200).render("index");


        }
        else{
            res.send("password and confirm password is not same");
        }
    }
    catch(error){
        res.status(400).send(error);
    };
});

app.get("/login",(req, res)=>{
    res.status(200).render("login")
});

app.post("/login",async(req, res)=>{
    try{
        const email = req.body.email;
        const password = req.body.password;
        const userEmail = await Register.findOne({email: email});
        const passward = userEmail.passward;

        const token = await userEmail.generateAuthToken();
        console.log("token part " + token);

        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 90000),
            httpOnly: true,
            // secure: true
        });
        console.log(res.cookies);


        if(passward == password){
            res.status(201).render("index")
        }
        else{
            res.status(400).send("email and password are not matching");
        }
    }
    catch(error){
        res.status(400).send("Invalid Email")
    };
});

// const bcrypt = require("bcrypt");
// const securePassword = async(password)=>{
//     const passwordHash = await bcrypt.hash(password, 10);
//     const passwordMatch = await bcrypt.compare(password,passwordHash);
//     console.log(passwordMatch);
// }
// securePassword("thapa123");


const jwt = require("jsonwebtoken");
const createToken = async()=>{
    const token = await jwt.sign({_id: "hello"},"sakjhjhjkhjsdalkjhjhhhhhljhjhjk", {expiresIn: "2 seconds"});
    console.log(token);

    const user = await jwt.verify(token, "sakjhjhjkhjsdalkjhjhhhhhljhjhjk");
    console.log(user);
};
createToken();



app.listen(port,()=>{
    console.log("server started");
});