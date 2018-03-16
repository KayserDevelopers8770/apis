var http = require('http');

let servidor = http.createServer( (req,res) => { console.log("hola mundo"); res.end("Hola mundo en el navegador") }).listen(80)