const {Router}= require('express')
const {hospitalSchema}=require('./schema')
const validateSchema=require('../../shared/middlewares/validateSchema')
const {getUserData,vaccinateUser,handelLogin,getAllDetails}=require('../Hospital/service')
const {Auth} = require('../../shared/middlewares/checkAuth')
const app=Router()

const handelHospitalRoute=()=>{

    app.post("/login",validateSchema(hospitalSchema),handelHospitalLogin);
    app.get("/userList",Auth,handelUserRequest)
    app.post("/vaccinate",Auth,handelVaccinate)
    app.get("/getDetails",Auth,handelSendDetails)
    return app;
}

const handelHospitalLogin=async (req,res)=>{
    try{
         const token=await handelLogin(req.body)
         res.json({success: true,token: token})
    }catch(error)
    {
        res.json({success: false,message: error.message})
    }
}


const handelUserRequest=async (req,res)=>{
    try{

       const data= await ( getUserData(req.user.email));
       if(!data) data=[]
       res.json({success: true,data: data})
    }catch(error){
        console.log(error)
       res.json({success: false,message: error.message})
    }
}

const handelVaccinate=async (req,res)=>{
    try{
        await vaccinateUser(req.body,req.user.email)
        res.json({success: true})
    }catch(error){
         res.json({success: false, message: error.message})
    }
}

const handelSendDetails=async (req,res)=>{
    try{
        const data=await getAllDetails(req.user.email)
         res.json({success: true, data: data})
    }catch(error){
          res.json({success: false,message: error.message})
    }
}

module.exports=handelHospitalRoute