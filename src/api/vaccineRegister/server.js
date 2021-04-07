const {Router} =require('express')
const {RegSchema,appointSchema}= require('./schema')
const validateSchema=require("../../shared/middlewares/validateSchema")
const {Auth}=require("../../shared/middlewares/checkAuth")
const {createReg,scheduleAppoint,getDistrictData,getHospitalData,getStateData,getAllRegUser}=require("./service")
const app=Router()

const handelVaccineReg=()=>{
     app.post("/register",Auth,validateSchema(RegSchema),handelReg)
     app.post("/schedule",Auth,validateSchema(appointSchema),handelSched)
     app.post("/getData/:ID",handelSendData)
     app.get("/register",Auth,handelSendingRegData)
     return app;
}


const handelReg=async (req,res)=>{
    try{
        console.log("I am")
        await createReg(req.body,req.user.email)
        res.json({success: true,msg: 'Successfully Registered User'})
    }catch(error)
    {
        res.json({success: false,msg: error.message})
    }
}

const handelSched=async (req,res)=>{
    try{
        await scheduleAppoint(req.body,req.user.email)
        res.json({success: true,msg: 'Successfully Appointed'})
    }catch(error){
         res.json({success: false,msg: error.message})
    }
}

const handelSendingRegData=async (req,res)=>{
    try{
        console.log("HII DEBESH")
        const Data=await getAllRegUser(req.user.email)
        if(Data) return res.json({success: true, data: Data})
        else  res.json({success: true,data: []})
    }catch(error){
          res.json({success: true,message: error.message})
    }
}

const handelSendData=async (req,res)=>{
    try{
       if(req.params.ID==='state') 
       {
           const states=await getStateData();
           return res.json({success: true,data: states})
       }else if(req.params.ID==='district')
       {
           const Districts=await getDistrictData(req.body)
           return res.json({success: true,data: Districts})
       }else{
           const Hospitals=await getHospitalData(req.body)
           return res.json({success: true,data: Hospitals})
       }
    }catch(error){
         res.json({success: false,message: error})
    }
}


module.exports=handelVaccineReg