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
  
  
  app.use(bodyParser.urlencoded({ extended: false })); 
  app.use(bodyParser.json());
  
  app.set('view engine', 'ejs');
  app.use(express.static('public'));

  app.get("/",(req,res)=>{
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

  app.get("/login",(req,res)=>{
    res.render("login.ejs")
  })

  app.get("/register",(req,res)=>{
    res.render("register.ejs")
  })

  app.listen(4000,()=>{
    console.log("Server Started")
  })