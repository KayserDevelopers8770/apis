const morgan = require('morgan')
const bodyParser = require('body-parser')
const express = require('express')
const app = express()

const externalRoute = require("./routes/externalRoute")

//SETTINGS
app.set('port', process.env.PORT || 3002);

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
app.use("/external", externalRoute)

//start the server
app.listen(app.get('port'), () => {
    console.log('Servidor en: http://localhost:' + app.get('port') + '/inventary/...');
})
