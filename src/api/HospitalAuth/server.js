const {Router} = require('express');
const {hospitalSchema}=require('./schema')
const validateSchema=require('../../shared/middlewares/validateSchema')
const {handelLogin}= require('./service')

const app=Router();

const handelHospital=()=>{
    app.get("/login",validateSchema(hospitalSchema),handelHospitalLogin);
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