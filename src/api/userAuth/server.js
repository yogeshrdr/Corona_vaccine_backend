const {Router}=require('express')
const database=require('../../database/connect')
const { createUser,findUser} =require('./service')
const validateSchema=require('../../shared/middlewares/validateSchema')
const userSchema=require('./schema')
const {Auth} = require('../../shared/middlewares/checkAuth')
const ApiError=require('../../shared/error/apiError')


const handelUserAuth=()=>{
     const app=Router()
     app.post("/SignUp",validateSchema(userSchema),handelSignUp)
     app.post("/Login",validateSchema(userSchema),handelLogin)
     return app;
}

const handelSignUp=async (req,res)=>{
      try{
            await createUser({email: req.body.email ,password: req.body.password})
            res.json({success: true,msg: 'User Successfully Signed Up'})
      }catch(err)
      {
            console.log(err)
            res.json({success: false,msg: err.message})
      }
}

const handelLogin=async (req,res)=>{
    try{
         const token=await findUser({email: req.body.email, password: req.body.password})
         res.json({success: true, token: token})  
    }catch(err){
         res.json({success: false,message : err.message})
    }
}

module.exports=handelUserAuth




