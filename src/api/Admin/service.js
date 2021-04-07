const { response } = require('express');
const database=require('../../database/connect')
const {hospitalDates}=require("../../shared/constants")
const bcrypt=require('bcrypt')
const passwordGenerator=require('generate-password')
const { sendCredentials } = require('../../shared/services/SepmEmail')

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
