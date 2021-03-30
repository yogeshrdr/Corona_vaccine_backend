
const { Router } = require('express')
const handelUserAuth=require('./userAuth/server')
const handelVaccineReg=require('./vaccineRegister/server')
const handelAdminRoute=require('./Admin/server')

const handelRoutes=()=>{
    const app=Router()
    app.use("/userAuth",handelUserAuth());
    app.use("/reg",handelVaccineReg());
    app.use("/admin",handelAdminRoute());
    return app;
}



module.exports=handelRoutes