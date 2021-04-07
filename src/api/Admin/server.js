const {Router} =require('express')
const {hospitalSchema,getSchema}=require('./schema')
const validateSchema=require('../../shared/middlewares/validateSchema')
const {createHospital,getHospitals} = require('./service')


const app=Router()

const handelAdminRoute=()=>{
    app.post("/addHospital",validateSchema(hospitalSchema),handelAddition);
    app.post("/getHospital",validateSchema(getSchema),handelGet)
    return app;
}


const handelAddition=async (req,res)=>{
    try{
        console.log(req.body)
         await createHospital(req.body)
          res.json({status: 'true', message: "Hospital Successfully added"})
    }catch(error){
          res.json({status: 'false',message: error.message})
    }
}

const handelGet=async (req,res)=>{
    try{
        console.log("WHUUU")
        const data=await getHospitals(req.body);
        res.json({status: 'true',data: data})
    }catch(error){
         res.json({status: 'false',message: error.message})
    }
}

module.exports=handelAdminRoute