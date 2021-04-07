const database=require("../../database/connect")
const ApiError=require("../../shared/error/apiError")
const bcrypt=require('bcrypt')
const {verifyToken,getToken}=require('../../shared/services/jwt')
const {sendUserResetPassword} =require('../../shared/services/SepmEmail')

exports.createUser=async ({email,password})=>{
    try{
        const result=await (await database()).collection('User').findOne({email: email})
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

exports.handelTokenForgot=async ({email})=>{
    try{
       const data= await (await database()).collection('User').findOne({email: email})
       if(!data) throw({message: "User with this Email does not exists"})
       const token=await getToken({email: email})
       var URL= `http://localhost:3000/users/setPassword/${token}`
       sendUserResetPassword({Email: data.email,URL: URL})
    }catch(error){
        console.log(error.message)
        throw({message: error.message})
    }
}


exports.setUserPassword=async (obj,email)=>{
    try{
           const updatedPassword=await bcrypt.hash(obj.password,10)
           await (await database()).collection('User').findOneAndUpdate({email: email},{$set: {password: updatedPassword}})
    }catch(error){
        console.log(error)
         throw({message: 'Some Error Occured Try again'})
    }
}

