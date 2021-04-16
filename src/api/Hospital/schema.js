const yup = require('yup')

exports.hospitalSchema=yup.object().shape({
       email: yup.string().email().required(),
       password: yup.string().required()
})

exports.orderSchema=yup.object().shape({
       orderID: yup.string().required(),
       required: yup.number().required(),
       orderStatus: yup.string().default('Active')
})