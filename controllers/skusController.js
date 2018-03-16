const sql = require('mssql')

const query = "select t0.IdArticulo as sku, CAST(SUM(t0.Cantidad)-30 AS int) as cantidad  from   Existencia as t0 inner join Ubicacion as t1 on t0.IdUbicacion=t1.IdUbicacion where  t0.IdAlmacen = '01' AND t0.IdUbicacion LIKE '01%' and t1.Nivel in ('1','2') GROUP BY IdArticulo HAVING SUM(Cantidad)>30 ORDER BY IdArticulo";
// const config = {
//   user: 'wms',
//   password: 'pjc3l1',
//   server: '192.168.0.17',
//   database: 'WMSTEK_KAYSER'
// }
const stringConnection = 'mssql://wms:pjc3l1@192.168.0.17/WMSTEK_KAYSER'

module.exports = { 
  callback: (req, res) => {
    sql.connect(stringConnection, err => {
      new sql.Request().query(query, (err, result) => {
        let cont = 0;
        let tabla = '<table border=1px>'
        result.recordset.forEach(reg => {
          cont++;
          tabla += '<tr><td>' + cont + '</td></td><td>' + reg['sku'] + '</td><td>' + reg['cantidad'] + '</td></tr>'
        })
        tabla += '</table>'
        //dado que el request a la base de datos es ASINCRONO, la unica forma de mostrar el resultado despues de cargar la pagina es enviando la respuesta en este callback
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(tabla)
        res.end()
      })
    })
  },

  promise: (req,res) => {
    var tabla = '<table border=1px>'
    sql.connect(stringConnection).then(pool => { return pool.request().query(query)
    }).then(result => {
      let cont = 0;
      result.recordset.forEach(reg => {
        cont++;
        tabla += '<tr><td>' + cont + '</td></td><td>' + reg['sku'] + '</td><td>' + reg['cantidad'] + '</td></tr>'
      })
      tabla += '</table>'
      //dado que el request a la base de datos es ASINCRONO, la unica forma de mostrar el resultado despues de cargar la pagina es enviando la respuesta en este callback
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(tabla)
      res.end()
    }).catch(err => {
      console.log("Error",err);
    })
  },

  asynawait: async (req,res) => {    
    let pool = await sql.connect(stringConnection)
    let result = await pool.request().query(query)         // .input('input_parameter', sql.Int, value)      
    let cont = 0;
    let tabla = '<table border=1px>'
    result.recordset.forEach(reg => {
      cont++;
      tabla += '<tr><td>' + cont + '</td></td><td>' + reg['sku'] + '</td><td>' + reg['cantidad'] + '</td></tr>'
    })
    tabla += '</table>'    
    //dado que el request a la base de datos es ASINCRONO, la unica forma de mostrar el resultado despues de cargar la pagina es enviando la respuesta en este callback
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(tabla)
    res.end()
    // pool.close()
    
    // sql.on('error', err => {
    //  console.log('ESTE ERROR SI SE CAPTURO DEEBE VERSE',err);
    // })       
  },

  getStockSkus : async (req,res) => {
    const { substrSku } = req.params
    const pool = await sql.connect(stringConnection)
    const queryStock = "select t0.IdArticulo as sku, CAST(SUM(t0.Cantidad) - 30 AS int) as cantidad  from   Existencia as t0 inner join Ubicacion as t1 on t0.IdUbicacion = t1.IdUbicacion where  t0.IdAlmacen = '01' AND t0.IdUbicacion LIKE '01%' and t1.Nivel in ('1', '2') AND t0.IdArticulo LIKE '" + substrSku + "%' GROUP BY IdArticulo HAVING SUM(Cantidad) > 30 ORDER BY IdArticulo"
    const result = await pool.request() // .input('input_parameter', sql.VarChar, substrSku)   
      .query(queryStock)
    res.status(200).json(result.recordset);  
    sql.close();
  }
}