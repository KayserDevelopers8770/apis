const moment = require('moment');
moment().format();

// console.log(moment('2018-05-10'));

// console.log(moment(String));
var dia = moment('2018-05-10 12:00:00')
var dia_mas_10 = dia.add(10,'d')
console.log(dia_mas_10);
console.log(dia_mas_10.format("YYYY-MM-DD hh:mm:ss"))

// console.log(moment("29-06-1995", ["MM-DD-YYYY", "DD-MM-YYYY"], true));

// console.log(moment([2012, 0, 31]).month(1));

