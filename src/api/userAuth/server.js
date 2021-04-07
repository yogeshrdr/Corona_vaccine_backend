const {Router}=require('express')
const database=require('../../database/connect')
const { createUser,findUser,handelTokenForgot,setUserPassword} =require('./service')
const validateSchema=require('../../shared/middlewares/validateSchema')
const userSchema=require('./schema')
const {Auth} = require('../../shared/middlewares/checkAuth')
const ApiError=require('../../shared/error/apiError')


const handelUserAuth=()=>{
     const app=Router()
     app.post("/SignUp",validateSchema(userSchema),handelSignUp)
     app.post("/Login",handelLogin)
     app.get("/authCheck",Auth,handelAuthCheck)
     app.post("/forgotPassword",handelForgot)
     app.post("/setUserPassword",Auth,handelForgotPassword)
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
         console.log(req.body)
         const token=await findUser({email: req.body.email, password: req.body.password})
         res.json({success: true, token: token})  
    }catch(err){
         res.json({success: false,message : err.message})
    }
}

const handelAuthCheck=async (req,res)=>{
      try{
             res.json({success: true, message: 'Successfully Authenticated'})
      }catch(err)
      {
           res.json({success: false,message: err})
      }
}

const handelForgot=async (req,res)=>{
      try{
            await handelTokenForgot(req.body)
            res.json({success: true})
      }catch(err){
            res.json({success: false,message: error.message})
      }
}

const handelForgotPassword=async (req,res)=>{
      try{
            await setUserPassword(req.body,req.user.email)
            res.json({success: true,message: "Password Changes"})
      }catch(err){
            res.json({success: false,message: err.message})
      }
}



module.exports=handelUserAuth




