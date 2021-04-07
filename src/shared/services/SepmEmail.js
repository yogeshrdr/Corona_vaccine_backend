const sgMail = require('@sendgrid/mail')
const config=require('../../config/index')

sgMail.setApiKey(config.SENDGRID_API_KEY)

exports.sendCredentials=(obj)=>{
    
    const msg = {
        to: obj.Email,
        from: 'devesh.teotia12@gmail.com',
        fromname: 'COVID_PORTAL',
        templateId: 'd-82da64a5e5c24b8d83ab4f3af62a9e32',
        dynamic_template_data: {
            Email: obj.Email,
            Password: obj.Password
        }
    }
    sgMail.send(msg).then(() => console.log("Email Sent"))
        .catch((error) => {
            throw ({message: error.response.body})
            console.log(error.response.body)})
    
}

exports.sendUserResetPassword=(obj)=>{
    const msg = {
        to: obj.Email,
        from: 'devesh.teotia12@gmail.com',
        fromname: 'COVID_PORTAL',
        templateId: 'd-7a43a9b9d81643d8a97c19bc7afd8c87',
        dynamic_template_data: {
           Link: obj.URL
        }
    }
    sgMail.send(msg).then(() => console.log("Email Sent"))
        .catch((error) => {
            throw ({message: error.response.body})
            console.log(error.response.body)})
}
