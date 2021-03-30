const database=require('../../database/connect')
const bcrypt=require('bcrypt')
const {getToken}=require('../../shared/services/jwt')

exports.handelLogin=({email,password})=>{
    try{
        const res=await (await database()).collection('Hospitals').findOne({email: email})
        if(!res) Error ({error: '401', message: "No Hospital is Registered with that ID"})
        const hashedPassword=await bcrypt.compare(password,res.password);
        if(!match) Error({error: '401',message: "Wrong Password"})
        const token=await getToken({email: email})
        return token
    }catch(error)
    {
         throw ({code: '401',message: error.message})
    }
}