require('dotenv').config()


module.exports={
     //MONGODB ATLAS URL
     mongoURL: process.env.MONGOURL,

     //JWT SECRET
     jwtSecret: process.env.JWT_SECRET,

     //SENDGRID API KEY

     SENDGRID_API_KEY: process.env.SENDGRID_API
}