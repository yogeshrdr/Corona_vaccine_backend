const {verifyToken} = require('../services/jwt')

exports.Auth=async (req,res,next)=>{
    try{
        const authHeader=req.headers.authorization;
        console.log(req.headers)
        const token=authHeader && authHeader.split(' ')[1]
        if(token===null) return res.json({success: false,message: "User Not Authorized"})
        const payload=await verifyToken(token)
        console.log(payload)
        req.user=payload
        next()
    }catch(err){
        res.json({success: false,message: "User Not Authorized"})
    }
}
