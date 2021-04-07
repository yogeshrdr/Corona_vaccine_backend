const { ObjectSchema } = require('yup')
const database=require('../../database/connect')

exports.createReg=async (obj,userEmail)=>{
    try{
        const Response=await(await database()).collection('Identity').findOne({ID: obj.ID})
        if(Response===null) throw Error('Aadhar Number is not Valid')
        if(Response.Registered || Response.vaccinated) throw Error('User with these details is already Registered or Vaccinated')
        if(Response.Name!==obj.Name || Response.Gender!==obj.Gender || Response.DOB!==obj.DOB) throw Error('Enter Correct Details')
        await (await database()).collection('Identity').findOneAndUpdate({ID: obj.ID},{$set: {Registered: true}})
        await (await database()).collection('User').findOneAndUpdate({email : userEmail},{$push: {Registered: obj}})
    }catch(error)
    {
        throw({code : '401', message: error.message})
    }
}


exports.scheduleAppoint=async (obj,email)=>{
    try{
        // await (await database()).collection('Identity').updateOne({ID: obj.ID},{$set : {scheduled: true,scheduleDate: obj.scheduleDate,hospitalID: obj.hospitalID,stateID: obj.stateID,districtID: obj.districtID}})
        // await (await database()).collection('Hospitals').findOneAndUpdate({hospitalID: obj.hospitalID},{$push: {userList: {scheduleDate: obj.scheduleDate,userID: obj.ID}}})
        await (await database()).collection('User').updateOne({email: email, "Registered.ID": obj.ID},{$set : {"Registered.$.scheduled": true, "Registered.$.scheduleDate": obj.selectedDate,"Registered.$.hospitalID": obj.hospitalID}})
        const data=await (await database()).collection('Identity').findOne({ID: obj.ID})
        await (await database()).collection('Hospitals').findOneAndUpdate({hospitalID: obj.hospitalID},{$push: {userList: {scheduleDate: obj.selectedDate,userID: obj.ID,email: email,Name: data.Name,Gender: data.Gender,DOB: data.DOB}}})
        await (await database()).collection('Hospitals').updateOne({hospitalID: obj.hospitalID,"availableDates.Date": obj.selectedDate},{$inc : {"availableDates.$.total": 1}})
    }catch(error){
        throw({code : '501',message: error.message})
    }
}

exports.getAllRegUser=async (userEmail)=>{
    try{
        console.log("I am here in this")
        const data=await (await database()).collection('User').findOne({email : userEmail})
        return data.Registered
    }catch(error){
         throw {code : '401',message: 'Unable to Fetch Registered Users'}
    }
}

exports.getStateData=async ()=>{
    try{
      const stateData =await (await database()).collection('States').find({}).toArray()
      console.log(stateData)
      return stateData;
    }catch(error){
        throw({code: '501',message: error.message})
    }
}

exports.getDistrictData=async (obj)=>{
    try{
      const districtData =await (await database()).collection('Districts').find({stateID: obj.stateID}).toArray()
      return districtData;
    }catch(error){
        throw({code: '501',message: error.message})
    }
}

exports.getHospitalData=async (obj)=>{
    try{
        console.log(obj)
      const hospitalData =await (await database()).collection('Hospitals').find({districtCode: obj.districtID}).toArray()
      return hospitalData;
    }catch(error){
        throw({code: '501',message: error.message})
    }
}