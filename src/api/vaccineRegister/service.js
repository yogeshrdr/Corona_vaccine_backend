const { ObjectSchema } = require('yup')
const database=require('../../database/connect')

exports.createReg=async (obj)=>{
    try{
        console.log(obj)
        const Response=await(await database()).collection('Identity').findOne({ID: obj.ID})
        if(Response===null) throw Error('Aadhar Number is not Valid')
        if(Response.Name!==obj.Name || Response.DOB !==obj.DOB || Response.Gender!==obj.Gender) throw Error('Enter Correct Details')
        const res=await (await database()).collection('User').findOne({"Registered" : {"ID": obj.ID}})
        if(res) throw Error('User With this Aadhar is Already Registered')
        await (await database()).collection('User').findOneAndUpdate({email : 'devesh.teotia12@gmail.com'},{$push: {Registered: obj}})
    }catch(error)
    {
        throw({code : '401', message: error.message})
    }
}


exports.scheduleAppoint=async (obj)=>{
    try{
        await (await database()).collection('Identity').updateOne({ID: obj.ID},{$set : {scheduled: true,scheduleDate: obj.scheduleDate,hospitalID: obj.hospitalID,stateID: obj.stateID,districtID: obj.districtID}})
        await (await database()).collection('Hospitals').findOneAndUpdate({hospitalID: obj.hospitalID},{$push: {userList: {scheduleDate: obj.scheduleDate,userID: obj.ID}}})
    }catch(error){
        throw({code : '501',message: error.message})
    }
}

exports.getStateData=async ()=>{
    try{
      const stateData =await (await database()).collection('States').find({})
      return stateData;
    }catch(error){
        throw({code: '501',message: error.message})
    }
}

exports.getDistrictData=async (obj)=>{
    try{
      const districtData =await (await database()).collection('Districts').find({stateID: obj.stateID})
      return districtsData;
    }catch(error){
        throw({code: '501',message: error.message})
    }
}

exports.getHospitalData=async (obj)=>{
    try{
      const hospitalData =await (await database()).collection('Hospitals').find({districtID: obj.districtID})
      return hospitalData;
    }catch(error){
        throw({code: '501',message: error.message})
    }
}