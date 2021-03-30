const {sign,verify}=require('jsonwebtoken')
const config = require('../../config/index')


exports.getToken=async (payload)=>{
    return await sign(payload,config.jwtSecret);
}


exports.verifyToken=async (token)=>{
     return await verify(token,config.jwtSecret)
}