const yup=require('yup')
const { string } = require('yup/lib/locale')

var n=new Date()

exports.hospitalSchema=yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email().required(),
    hospitalID: yup.string().default(String(Date.now())),
    districtCode: yup.string().required(),
    stateCode: yup.string().required(),
    vaccinationStatus: yup.boolean().default(true),
    dailyLimit: yup.string().default("60"),
    totalVaccineStock: yup.number().default(360),
    totalVaccinated: yup.number().default(0),
    nextWeekVaccine: yup.string().default("0"),
    availableDates: yup.array().of(
         yup.object().shape(
             {
                 Date: yup.string().required(),
                 total: yup.number().required()
             }
         )
     ).notRequired(),
     userList: yup.array().of(
         yup.object().shape(
             {
                 scheduleDate: yup.string().required(),
                 userID: yup.string().required(),
                 email: yup.string().email().required(),
                 vaccinated: yup.boolean().default(false)
             }
         )
     ).notRequired()
})

exports.getSchema=yup.object().shape({
    stateID: yup.string().required(),
    districtID: yup.string().required()
})

