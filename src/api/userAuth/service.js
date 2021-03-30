const database=require("../../database/connect")
const ApiError=require("../../shared/error/apiError")
const bcrypt=require('bcrypt')
const {verifyToken,getToken}=require('../../shared/services/jwt')

exports.createUser=async ({email,password})=>{
    try{
        const result=await (await database()).collection('User').findOne({email: email})
        console.log("HIi I am here")
        if(result) throw Error('User Already Exists')
        const hashedPassword=await bcrypt.hash(password,10);
        const userID=Date.now()
        await (await database()).collection('User').insertOne({email: email,password: hashedPassword,userID: userID})
    }catch(error){
        console.log(error)
        if(error.message==='User Already Exists') throw {code : 409,message: 'User Already exists in the database'}
        throw {code : 500, message: error.message}
    }
}

exports.findUser=async ({email,password})=>{
    try{
        console.log("Hii")
        const result= await(await database()).collection('User').findOne({email: email})
        if(!result) throw Error('No User Found') 
        const match=await bcrypt.compare(password,result.password) 
        if(!match) throw Error('Wrong Password')
        const token=await getToken({email: email})
        return token
    }catch(error)
    {
        throw {code : '401' ,message: 'User is not Authorized'}
    }
}

