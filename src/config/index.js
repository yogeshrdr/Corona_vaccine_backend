require('dotenv').config()


module.exports={
     //MONGODB ATLAS URL
     mongoURL: process.env.MONGOURL,

     //JWT SECRET
     jwtSecret: process.env.JWT_SECRET
}