const express=require('express')
const cors=require('cors')
const bodyParser=require('body-parser')
const app=express()
const Routes=require("./api/index")
const apiErrorHandler = require('./shared/middlewares/errorHandling')
require('./shared/scheduler')()

app.use(bodyParser.json())
app.use(express.json())

app.use(cors())
app.use("/api",Routes())
app.use(apiErrorHandler)


app.listen(4000,()=>console.log("Runnning the project"))