const yup=require('yup')


exports.userSchema=yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required().min(8,'Password Should Be of length greater than 8')
})

exports.downloadSchema=yup.object().shape({
    userID: yup.string().required()
})


