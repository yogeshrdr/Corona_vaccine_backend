const yup=require('yup')
const { string } = require('yup/lib/locale')

exports.hospitalSchema=yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email().required(),
    hospitalID: yup.string().required(),
    districtCode: yup.string().required(),
    stateCode: yup.string().required(),
    vaccinationStatus: yup.boolean().default(true)
})