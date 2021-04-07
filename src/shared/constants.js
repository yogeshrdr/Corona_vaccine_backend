
const getdate=(num)=>{
    var d=new Date()
    d.setDate(d.getDate()+num)
    d=d.toISOString().substr(0,10)
    return d;
}

exports.hospitalDates=[
     {
       Date: getdate(1),
       total: 0,
       status: true
     },
     {
       Date: getdate(2),
       total: 0,
       status: true
     },
     {
       Date: getdate(3),
       total: 0,
       status: true
     },
     {
       Date: getdate(4),
       total: 0,
       status: true
     },
     {
       Date: getdate(5),
       total: 0,
       status: true
     },
     {
       Date: getdate(6),
       total: 0,
       status: true
     }
]

