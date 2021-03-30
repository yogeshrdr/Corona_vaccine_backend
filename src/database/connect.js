const {MongoClient} =require('mongodb')
const config=require('../config')


let DB
const connectBD=async ()=>{
    const connection=await MongoClient.connect(config.mongoURL,{
        useNewUrlParser: true,
         useUnifiedTopology: true
    })
    try{
        return  connection.db();
    }catch(err)
    {
        console.log(err)
    }
}

const Database=async ()=>{
    if(!DB)
        DB=await connectBD()
    return DB
}

module.exports=Database