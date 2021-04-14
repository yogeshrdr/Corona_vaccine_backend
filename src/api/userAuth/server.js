const {Router}=require('express')
const database=require('../../database/connect')
const { createUser,findUser,handelTokenForgot,setUserPassword,getUserData} =require('./service')
const validateSchema=require('../../shared/middlewares/validateSchema')
const {userSchema,downloadSchema}=require('./schema')
const {Auth} = require('../../shared/middlewares/checkAuth')
const ApiError=require('../../shared/error/apiError')
const path=require('path')
const fs=require('fs')
const pdf=require('html-pdf')
const ejs=require('ejs')

const handelUserAuth=()=>{
     const app=Router()
     app.post("/SignUp",validateSchema(userSchema),handelSignUp)
     app.post("/Login",handelLogin)
     app.get("/authCheck",Auth,handelAuthCheck)
     app.post("/forgotPassword",handelForgot)
     app.post("/setUserPassword",Auth,handelForgotPassword)
     app.post("/getVaccineCertificate",Auth,validateSchema(downloadSchema),handelCertificate)
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

const handelCertificate=async (req,res)=>{
      try{
           
            const data=await getUserData(req.user.email,req.body)
            console.log(data)
            const filePathName = path.join(__dirname, '..', 'utils', 'certificate.ejs')
            const htmlString = fs.readFileSync(filePathName).toString();
            const html = ejs.render(htmlString, { myData: data })
           // const html = ejs.render(htmlString)
            pdf.create(html).toStream((err, stream) => {
                if (err) {
                    res.json({ success: 'false', error: 'Error in Generating pdf' })
                } else {
                    res.contentType('application/pdf')
                    res.attachment()
                    stream.pipe(res)
                }
            })
      }catch(err){
            res.json({success: false,message: err.message})
      }
}

module.exports=handelUserAuth




