const { response } = require('express');
const database=require('../../database/connect')



exports.createHospital=async (obj)=>{
    try{
        obj.dailyLimit='60';
        await (await database()).collection('Hospitals').insertOne(obj);
    }catch(err)
    {
       throw {code : 501, message: 'Some Error has occured in adding Hospital'}
    }
}