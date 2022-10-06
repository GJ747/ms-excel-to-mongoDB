const express = require("express");
const app = express();
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
const User = require("./dataBase/user");
const { findOne, findOneAndUpdate } = require("./dataBase/user");
const user = require("./dataBase/user");

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

  app.post("/upload",async(req,res)=>{
    const data = req.body

    if(data[1]==="trading"){
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
                const data = {PartyCode , password :PartyCode, firstLogin : 0}
                const user = new User(data)
                await user.save()
                console.log("else")
          
                    const user1 = await User.findOneAndUpdate({PartyCode},{$push:{tradeDatails:array}},{ new: true })
              
            }
  }}


  if(data[1]==="userDetails"){
    for(let y = 0;y<data[0].length;y++){
             const array = data[0][y]
               console.log("userDetails")
               console.log(array)
           
             const find = await User.findOne({PartyCode:array.PartyCode})
             if(find){
                 console.log(find)
                     
             }else{
                 const data = {
                  PartyCode : array.PartyCode, 
                  userName : array.PartyName,
                  password :array.PartyCode, 
                  firstLogin : 0
                }
                 const user = new User(data)
                 await user.save()
                 console.log("else")
                
             }
   }}
 
   res.json("ok")
  })

 //------------- Registration -------------

  app.get("/register",(req,res)=>{
    res.render("register.ejs",{popup:"none"})
  })

  app.post("/register",async(req,res)=>{
    const data = req.body
    data.firstLogin = 0
    const newUser = new User(data)
    await newUser.save()
    res.render("register.ejs",{popup:"block"})
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
//------------Change Password-------------


app.get("/changePassword",(req,res)=>{
  res.render("changePassword.ejs",{error:"none"})
})

app.post("/changePassword",async(req,res)=>{
  const{PartyCode,prePassword,newPassword}= req.body
  const user = await User.findOne({PartyCode})
  if(prePassword === user.password){
    console.log("if")
    const user1 = await User.findOneAndUpdate({PartyCode},{$set:{password :newPassword}},{ new: true })
    res.render("changePassword.ejs",{error:"none"})
  }else{
    console.log("else")
    res.render("changePassword.ejs",{error:"block"})
  }
})

app.post("/change_Password",async(req,res)=>{
  const{PartyCode,prePassword,newPassword}= req.body
  const user = await User.findOne({PartyCode})
  if(user){
      if(prePassword === user.password){
        console.log("if")
        const user1 = await User.findOneAndUpdate({PartyCode},{$set:{password :newPassword,firstLogin: 1}},{ new: true })
        res.json("Password Changed Succesfull")
      }else{
        console.log("else")
        res.json("Previous Password is wrong")
      }
  }else{
    res.json("User Id not found")
  }
})

//----------logIn API -------------
app.post("/login-api",async(req,res)=>{
  const {partyCode,password} = req.body
  const user = await User.findOne({partyCode})
  if(user){
      if(partyCode === user.PartyCode && password === user.password){
      const data = { partyCode : user.PartyCode, flg:user.firstLogin}
      res.json(data)
      }else{
        res.json("wrong credentials")
      }
  }else{
  res.json("Data not found")
}
})
//----------- SERVER ------------------
  app.listen(4000,()=>{
    console.log("Server Started")
  })