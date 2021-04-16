const {Router} =require('express')
const {hospitalSchema,getSchema,changeStatusSchema,acceptSchema}=require('./schema')
const validateSchema=require('../../shared/middlewares/validateSchema')
const {createHospital,getHospitals,getOneHospital,changeStatus,getOverAllData,getOrders,getLogin,acceptOrder,rejectOrder} = require('./service')
const { getUserData } = require('../Hospital/service')
const {Auth} =require('../../shared/middlewares/checkAuth')

const app=Router()

const handelAdminRoute=()=>{
    app.post("/adminLogin",handelLogin)
    app.post("/addHospital",Auth,validateSchema(hospitalSchema),handelAddition);
    app.post("/getHospital",Auth,validateSchema(getSchema),handelGet)
    app.post("/getOneHospital",handeOneGet)
    app.post("/changeStatus",validateSchema(changeStatusSchema),handelChangeStatus)
    app.get("/getAdminData",handelDataSend)
    app.get("/getOrders",handelOrders)
    app.post("/acceptOrder",validateSchema(acceptSchema),handelAccept)
    app.post("/rejectOrder",validateSchema(acceptSchema),handelReject)
    return app;
}


const handelAddition=async (req,res)=>{
    try{
      
         await createHospital(req.body)
        res.json({status: 'true', message: "Hospital Successfully added"})
    }catch(error){
          res.json({status: 'false',message: error.message})
    }
}

const handelGet=async (req,res)=>{
    try{
        
        const data=await getHospitals(req.body);
        res.json({status: 'true',data: data})
    }catch(error){
         res.json({status: 'false',message: error.message})
    }
}

const handeOneGet=async (req,res)=>{
    try{ 
  
      const data=await getOneHospital(req.body.hospitalID)
     
      res.json({status: 'true',data: data})
    }catch(error){
        res.json({status: 'false',message: error.message})
    }
}

const handelChangeStatus=async (req,res)=>{
    try{
      
       const data=await changeStatus(req.body.hospitalID,req.body.vaccinationStatus)
       res.json({status: 'true',data: data})
    }catch(error){
        res.json({status: 'false',message: error.message})
    }
}

const handelDataSend=async (req,res)=>{
    try{
       const data=await getOverAllData()
       res.json({status: 'true',data: data})
    }catch(error){
        res.json({status: 'false',message: error.message})
    }
}

const handelOrders=async (req,res)=>{
    try{
        const data=await getOrders()
        res.json({status: 'true',data: data})
    }catch(error){
        res.json({status: 'false',message: error.message})
    }
}

const handelLogin=async (req,res)=>{
     try{
         const token=await getLogin(req.body)
         res.json({success: true,token: token})
    }catch(error){
        res.json({success: false,message: error.message})
    }
}

const handelAccept=async (req,res)=>{
    try{
        await acceptOrder(req.body)
        res.json({success: true,message: "Successfully Accepted the Order"})
    }catch(error){
        res.json({success: false,message: error.message})
    }
}

const handelReject=async (req,res)=>{
    try{
        await rejectOrder(req.body)
        res.json({success: true,message: "Successfully Rejected the Order"})
    }catch(error){
        res.json({success: false,message: error.message})
    }
}
module.exports=handelAdminRoute