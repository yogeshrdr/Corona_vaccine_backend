const yup = require('yup')

exports.hospitalSchema=yup.object().shape({
       email: yup.string().email().required(),
       password: yup.string().required
})