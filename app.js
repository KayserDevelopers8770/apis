const morgan = require('morgan')
const bodyParser = require('body-parser')
const express = require('express')
const app = express()


const skusRoute = require("./routes/skusRoute")

//SETTINGS
app.set('port', process.env.PORT || 3000);

//middleware
app.use(morgan('dev'))
app.use(bodyParser.json());
app.use(function (req, res, next) {
  //Enabling CORS 
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
  next();
});


//routes
app.use("/skus", skusRoute)


//start the server
app.listen(app.get('port'), () => {
  console.log('SEVER ON PORT ' + app.get('port'));
})
