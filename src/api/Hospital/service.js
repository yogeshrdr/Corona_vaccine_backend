const database=require('../../database/connect')
const bcrypt=require('bcrypt')
const {getToken}=require('../../shared/services/jwt')

exports.handelLogin=async ({email,password})=>{
    try{
        const res=await (await database()).collection('Hospitals').findOne({email: email})
        if(!res) throw({message: 'User does not exists'})
        const match=await bcrypt.compare(password,res.password);
        if(!match) throw({message: 'Password is wrong'})
        const token=await getToken({email: email})
        return token;
    }catch(error)
    {
        console.log(error)
         throw ({code: '401',message: error.message})
    }
}

exports.getUserData=async (email)=>{
    try{
        const data=await (await database()).collection('Hospitals').findOne({email: email})
        return data.userList
    }catch(error){
        throw(error)
    }
}

exports.vaccinateUser=async (obj,email)=>{
    try{
        console.log(obj)
        await (await database()).collection('User').updateOne({email: obj.email, "Registered.ID": obj.userID},{$set : {"Registered.$.vaccinated": true}})
        var data=await (await database()).collection('Hospitals').findOneAndUpdate({email: email},{$pull : {userList: {userID: obj.userID}},$inc : {totalVaccinated: 1,totalVaccineStock: -1}})
        console.log(data)
        data=data.value
        const updated=data.userList.filter((e)=> e.userID===obj.userID)
        await (await database()).collection('Hospitals').findOneAndUpdate({email: email},{$push : {vaccinatedList: updated[0]}})
    }catch(error){
        console.log(error)
        throw {message: 'Error in Updating data'}
    }
}

exports.getAllDetails=async (email)=>{
    try{
        var data=await (await database()).collection('Hospitals').findOne({email: email})
        const date=getdate(0);
        const updatedData=data.availableDates.filter((e)=> e.Date===date)
        var count=0
        data.availableDates.map((e)=>{
              count+=e.total
              return e;
        })
        const obj={
            stock: data.totalVaccineStock,
            Vaccinated: data.totalVaccinated,
            todayAppointment: updatedData.length ? updatedData[0].total : 0,
            totalAppointment: count ? count : 0
        }
        return obj
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