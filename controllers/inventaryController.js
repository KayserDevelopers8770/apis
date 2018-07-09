const sql = require('mssql')
const moment = require('moment'); //PARA MANEJO DE FECHAS
moment().format()

module.exports = { 
  getStoresStatus : async (req,res) => {
    const stringConnection = 'mssql://sa:sa@192.168.0.33/SBO_KAYSER'
    try{
      const query_get_status = `
      SELECT T1.U_GSP_FILWAREHOUSE AS code, T1.U_GSP_DESC AS name, T1.U_GSP_AUTOEXEC AS status, T2.U_GSP_TIPOINTEGRCP AS sync
      FROM [@GSP_TPVWCD] AS T1 INNER JOIN [@GSP_TPVSHOP] AS T2 ON T1.U_GSP_NAME=T2.U_GSP_DFLTCARD
      `
      const pool = await sql.connect(stringConnection)
      const result = await pool.request().query(query_get_status)  
      // console.log(result.recordset);  
      res.status(200).json(result.recordset);
      sql.close();
    } catch (err) {
      sql.close();
    }
  }
}

