const cron = require('node-cron')
const database=require('../database/connect')

const Scheduler=async ()=>{
    cron.schedule('10 0 * * *',async ()=>{
       try{
           console.log("Scheduler")
           const obj={
             Date: getdate(1),
             total: 0,
             status: true
           }
         var dateToday=getdate(0);
        await(await database()).collection('Hospitals').updateMany({},{$push : {availableDates: obj}})
        const data=await (await database()).collection('Hospitals').find({}).toArray()
         data.map( (a)=>{
            if(a.userList)
            { a.userList.map(async (e)=>{
                if(e.scheduleDate<dateToday)
                {
                    await (await database()).collection('User').updateOne({email: e.email, "Registered.ID": e.userID},{$set : {"Registered.$.scheduled": false, "Registered.$.scheduleDate": obj.selectedDate,"Registered.$.hospitalID": obj.hospitalID}})  
                }
            })
           }
        })
        await (await database()).collection('Hospitals').updateMany({},{$pull: {availableDates: {Date : {$lt : dateToday}},userList: {scheduleDate : {$lt: dateToday}}}})
       }catch(err)
       {
           console.log(err)
       }
    })
}


const getdate=(num)=>{
       var newDate= new Date()
       num==0 ? newDate.setDate(newDate.getDate()) : newDate.setDate(newDate.getDate()+num)
       newDate=newDate.toISOString().substr(0,10)
       return newDate
}



module.exports=Scheduler