const { response } = require('express');
const database=require('../../database/connect')
const {hospitalDates}=require("../../shared/constants")
const bcrypt=require('bcrypt')
const passwordGenerator=require('generate-password')
const { sendCredentials } = require('../../shared/services/SepmEmail')
const config=require('../../config/index')
const {getToken}=require('../../shared/services/jwt')


exports.createHospital=async (obj)=>{
    try{
       const password=passwordGenerator.generate({
            length: 20,
            numbers: true,
            symbols: true
        })
        obj.password= await bcrypt.hash(password,10);
       
        await (await database()).collection('Hospitals').insertOne(obj);
        await (await database()).collection('Hospitals').findOneAndUpdate({hospitalID: obj.hospitalID},{$set: {availableDates : hospitalDates}})
        sendCredentials({Email: obj.email,Password: password})
    }catch(err)
    {
       throw {code : 501, message: 'Some Error has occured in adding Hospital'}
    }
}

exports.getHospitals=async (obj)=>{
    try{
       const Data= await (await database()).collection('Hospitals').find({stateCode: obj.stateID,districtCode: obj.districtID}).toArray()
       return Data
    }catch(err){
        throw{message: err}
    }
}


exports.getOneHospital=async (hospitalID)=>{
    try{
        if(!hospitalID) throw({message: "Hospital ID not provided"})
        const data= await (await database()).collection('Hospitals').findOne({hospitalID: hospitalID})
        if(data){
            const date=getdate(0);
            const updatedData=data.availableDates.filter((e)=> e.Date===date)
            var count=0
            data.availableDates.map((e)=>{
                  count+=e.total
                  return e;
            })

           return {
               ...data,
               totalAppointment: count ? count : 0,
               todayAppointment: updatedData.length ? updatedData[0].total : 0
           }
        }
        throw({message: "Hospital Doesn't Exists"})
    }catch(error){
       throw({message: error.message})
    }
}

exports.changeStatus=async (hospitalID,status)=>{
    try{
        if(!hospitalID) throw({message: "Hospital ID not provided"})
        var data=await (await database()).collection('Hospitals').findOneAndUpdate({hospitalID: hospitalID},{$set: {vaccinationStatus: !status}},{returnNewDocument: true})
        
        data=data.value
        if(data){
            const date=getdate(0);
            const updatedData=data.availableDates.filter((e)=> e.Date===date)
            var count=0
            data.availableDates.map((e)=>{
                  count+=e.total
                  return e;
            })

           return {
               ...data,
               totalAppointment: count ? count : 0,
               todayAppointment: updatedData.length ? updatedData[0].total : 0
           }
        }
        throw({message: "Hospital Doesn't Exists"})
    }catch(error){
        throw({message: error.message})
    }
}

exports.getOverAllData=async ()=>{
    try{
        const data=await (await database()).collection('Hospitals').find({}).toArray()
        var totalRegistered=0;
        var totalVaccinated=0;
        var hospitals=data.length
        data.map((a)=>{
            a.availableDates.map((e)=>{
                totalRegistered+=e.total
            })
            totalVaccinated+=a.totalVaccinated;
        })
        return {
            totalRegistered,
            totalVaccinated,
            hospitals
        }
    }catch(error){
        throw({message: error.message})
    }
}

exports.getOrders=async ()=>{
    try{
        const data=await (await database()).collection('Hospitals').find({}).toArray()
        myData=[]
        
        data.map((e)=>{
            if(e.orders)
            {   
                console.log(e.orders)
                const updatedData =e.orders.map((a)=>{
                    if(a.orderStatus==="Active")
                    {
                        return {
                            ...a,
                            name:e.name,
                            districtCode: e.districtCode,
                            stateCode: e.stateCode,
                            hospitalID: e.hospitalID
                        }
                    }
                })
                 myData=[...updatedData]
                 console.log(updatedData)
            }
        })
        return myData
    }catch(error){
        throw({message: error.message})
    }
}

exports.getLogin=async (obj)=>{
    try{
        console.log("HII")
        if(obj.email!=='admin@gmail.com') throw({message: 'Email does not match'})
        const match=await bcrypt.compare(obj.password,config.ADMIN_PASS);
        if(!match) throw({message: 'Password is wrong'})
        const token=await getToken({email: 'admin@gmail.com'})
        return token;

    }catch(error){
       throw({message: error.message})
    }
}

exports.acceptOrder=async (obj)=>{
    try{
        await (await database()).collection('Hospitals').findOneAndUpdate({hospitalID : obj.hospitalID},{$inc : {totalVaccineStock: obj.orderedVaccine}})
        await (await database()).collection('Hospitals').updateOne({hospitalID: obj.hospitalID, "orders.orderID": obj.orderID},{$set : {"orders.$.orderStatus": 'Accepted'}})
    }catch(error){
          throw({message: error.message})
    }
}
exports.rejectOrder=async (obj)=>{
    try{
       // await (await database()).collection('Hospitals').findOneAndUpdate({hospitalID : obj.hospitalID},{$inc : {totalVaccineStock: obj.orderedVaccine}})
        await (await database()).collection('Hospitals').updateOne({hospitalID: obj.hospitalID, "orders.orderID": obj.orderID},{$set : {"orders.$.orderStatus": 'Rejected'}})
    }catch(error){
          throw({message: error.message})
    }
}

const getdate=(num)=>{
    var newDate= new Date()
    num==0 ? newDate.setDate(newDate.getDate()) : newDate.setDate(newDate.getDate()+num)
    newDate=newDate.toISOString().substr(0,10)
    return newDate
}