const cron = require('node-cron')
const database=require('../database/connect')

const Scheduler=async ()=>{
    cron.schedule('10 0 * * *',async ()=>{
       try{
           console.log("Scheduler")
           const obj={
             Date: getdate(6),
             total: 0,
             status: true
         }
         var dateToday=getdate(0);
        await(await database()).collection('Hospitals').updateMany({},{$push : {availableDates: obj}})
        //const data=await (await database()).collection('Hospitals').find({},{userList: 1,_id: 0}).toArray()
       // console.log(data)
        //await handelShift(data)
        await (await database()).collection('Hospitals').updateMany({},{$pull: {availableDates: {Date : {$lt : dateToday}}}})
       }catch(err)
       {
           console.log(err)
       }
    })
}

const handelShift=async (data)=>{
    
        const dateToday=getdate(5);
        const updatedData=data.map((e)=>{
            if(e.userList)
           { var temp=e.userList.filter((a)=>{
                return ((a.scheduleDate<dateToday))
            })
            return temp}
        })
        console.log("Bye"+updatedData)
    await updatedData.map(async e=>{
            await e.map(async (a)=>{
                await (await database()).collection('User').updateOne({email: email, "Registered.ID": a.userID},{$set : {"Registered.$.scheduled": false,"Registered.$.vaccinated": false},$unset : {"Registered.scheduleDate": 1}})
            })
        })
    
    
}

const getdate=(num)=>{
       var newDate= new Date()
       num==0 ? newDate.setDate(newDate.getDate()) : newDate.setDate(newDate.getDate()+num)
       newDate=newDate.toISOString().substr(0,10)
       return newDate
}



module.exports=Scheduler