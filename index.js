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
    const details = data[0]
    const id = data[1]
    const find = await User.findOne({userId:id})
    if(find){
        console.log("if")
        for(let x = 0; x<details.length;x++){
            const user = await User.findOneAndUpdate({userId:id},{$push:{tradeDatails:details[x]}},{ new: true })
        }
    }else{
     
        const user = new User({userId:id})
        await user.save()
        console.log("else")
        for(let x = 0; x<details.length;x++){
            const user = await User.findOneAndUpdate({userId:id},{$push:{tradeDatails:details[x]}},{ new: true })
        }
    }
  })

  app.listen(4000,()=>{
    console.log("Server Started")
  })