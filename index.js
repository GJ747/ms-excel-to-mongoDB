const express = require("express");
const app = express();
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
const User = require("./dataBase/user");
const { findOne } = require("./dataBase/user");

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/shareMarket');
    console.log("dataBase Started")
  }
  
  
  app.use(bodyParser.urlencoded({ extended: true })); 
  app.use(bodyParser.json());
  
  app.set('view engine', 'ejs');
  app.use(express.static('public'));

//----------------- Auth --------------------

  app.get("/",(req,res)=>{
    res.render("login.ejs",{error:"none"})
  })


  app.post("/login",(req,res)=>{
    const {userId,password} = req.body
    if(userId === "admin" && password === "admin"){
      res.render("upload.ejs")
    }else{
      res.render("login.ejs",{error:"block"})
    }
  })

//------------ Upload xlxs --------------

app.get("/upload",(req,res)=>{
  res.render("upload.ejs")
})

  app.post("/post",async(req,res)=>{
    const data = req.body
   for(let y = 0;y<data[0].length;y++){
    const array = data[0][y]
      const {PartyCode} = array
      delete array.PartyCode
      console.log(array)
  
    const find = await User.findOne({PartyCode})
    if(find){
        console.log("if")
            const user = await User.findOneAndUpdate({PartyCode},{$push:{tradeDatails:array}},{ new: true })
    }else{
     
        const user = new User({PartyCode})
        await user.save()
        console.log("else")
  
            const user1 = await User.findOneAndUpdate({PartyCode},{$push:{tradeDatails:array}},{ new: true })
       
    }
  }
  })

 //------------- Registration -------------

  app.get("/register",(req,res)=>{
    res.render("register.ejs")
  })

  app.post("/register",async(req,res)=>{
    const newUser = new User(req.body)
    await newUser.save()
  })

//--------------User Details send API ----------

app.get("/api",async(req,res)=>{
  const {PartyCode} = req.query
  const tradData = await User.findOne({PartyCode})
  if(tradData){
  console.log(tradData.tradeDatails)
  res.json(tradData.tradeDatails)
  }else{
    res.json("User Not Find")
  }
})

//----------- SERVER ------------------
  app.listen(4000,()=>{
    console.log("Server Started")
  })