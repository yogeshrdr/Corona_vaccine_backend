const {Router} =require('express')
const {hospitalSchema}=require('./schema')
const validateSchema=require('../../shared/middlewares/validateSchema')
const {createHospital} = require('./service')
const app=Router()

const handelAdminRoute=()=>{
    app.post("/addHospital",validateSchema(hospitalSchema),handelAddition);
    return app;
}

const handelAddition=async (req,res)=>{
    try{
          await createHospital(req.body);
          res.json({status: 'true', message: "Hospital Successfully added"})
    }catch(error){
          res.json({status: 'false',message: error.message})
    }
}

module.exports=handelAdminRoute