const sql = require('mssql')
const moment = require('moment'); //PARA MANEJO DE FECHAS
moment().format()

module.exports = { 
  getStockSens: async (req,res) => {    
    try{
      const stringConnection = 'mssql://wms:pjc3l1@192.168.0.17/WMSTEK_KAYSER'
      const query_get_sens_stock = `
      SELECT S.itemCode, CASE WHEN STOCK.Cant IS NULL THEN 0 ELSE STOCK.Cant END AS cantidad
      FROM  (SELECT t0.IdArticulo as sku, CAST(SUM(t0.Cantidad)-30 AS int) as cant 
          FROM Existencia as t0 
          INNER JOIN Ubicacion as t1 ON t0.IdUbicacion=t1.IdUbicacion
          WHERE t0.IdAlmacen = '01' AND t0.IdUbicacion LIKE '01%' and t1.Nivel in ('1','2')
          GROUP BY IdArticulo HAVING SUM(Cantidad)>30 ) AS STOCK
      RIGHT JOIN [192.168.0.13].[Stock].[dbo].[Kayser_OITM] as S ON STOCK.sku = S.itemCode COLLATE SQL_Latin1_General_CP1_CI_AS
      WHERE S.U_Marca='SENS' 
      ORDER BY S.itemCode
      `
      const pool = await sql.connect(stringConnection)
      const result = await pool.request().query(query_get_sens_stock)   
      
      res.status(200).json(result.recordset);
      sql.close();

    } catch (err) {
        console.log('Errores encontrados: ', err);
        sql.close();
    }
  }

}

