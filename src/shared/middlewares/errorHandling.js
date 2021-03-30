const ApiError=require('../error/apiError')

const apiErrorHandler=(err,req,res,next)=>{
    //IN PRODUCTION NEVER USE CONSOLE LOG BECAUSE CONSOLE LOG IS SYNCHRONOUS AND IT BLOCKS THE MAIN THREAD
    console.log(err)

    if(err instanceof ApiError)
    {
        return res.status(err.code).json({success: false,message: err.message})
    }
    return res.status(500).json({success: false,message: 'Something Went Wrong'})
}

module.exports=apiErrorHandler