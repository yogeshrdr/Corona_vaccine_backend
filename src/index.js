const express=require('express')
const app=express()
const Routes=require("./api/index")
const apiErrorHandler = require('./shared/middlewares/errorHandling')



app.use(express.json())
app.use("/api",Routes())
app.use(apiErrorHandler)


app.listen(6000,()=>console.log("Runnning the project"))