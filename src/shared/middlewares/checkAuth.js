const {verifyToken} = require('../services/jwt')

exports.Auth=async (req,res,next)=>{
    try{
        const authHeader=req.headers.authorization;
        const token=authHeader && authHeader.split(' ')[1]
        if(token==null) res.status(401).json({success: false,message: "User Not Authorized"})
        const payload=await verifyToken(token)
        console.log(payload)
        req.user=payload
        next()
    }catch(err){
        res.status(401).json({success: false,message: "User Not Authorized"})
    }
}