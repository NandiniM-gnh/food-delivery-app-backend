//importing all required external modules after instalation
const express=require('express')
const mongoose=require('mongoose')
require('dotenv').config()
const User=require('./models/User')
const bcrypt=require('bcryptjs')
//Middleware
const PORT=3000
const app=express()
app.use(express.json())
//Connecting Mongodb Atlas
mongoose.connect(process.env.MONGO_URL).then(
    ()=>console.log("DB connected sucessfully...")
).catch(
    (err)=>console.log(err)
)

//API landing page http://locallhost:3000/register
app.get('/',async(req,res)=>{
    try{
        res.send("<h1 align=center>welcome to the home page</h1>")
    }
    catch(err)
    {
        console.log(err)
    }
})

//API registration page 

app.post('/register',async(req,res)=>{
    const {username,email,password,address}=req.body
    try{
        const hashPassword=await bcrypt.hash(password,10)
        const newUser=new User({
            username,
            email,
            password:hashPassword,
            address
        })
        await newUser.save()
        console.log("User registered successfully...")
        res.json({
            message:"User created..."})
    }
    catch(err)
    {
        console.log(err)
    }
})
//API login page
app.post('/login',async(req,res)=>{
    const {email,password}=req.body
    try{
        const username = await User.findOne({email});
        if(!username || !(await bcrypt.compare(password,username.password)))
            {
            return res.status(400).json({message:"User not found"})
            }
          res.json({
            message:"User logged in successfully...",
            user:{
                username:username.username,
            }})
    }
    catch(err)
    {
        console.log(err)
    }
})
//Server running and testing
app.listen(PORT,(err)=>{
    if(err){
        console.log(err)
    }
    console.log("Server is running on port:"+PORT)
})