const sql = require('mssql')
const moment = require('moment'); //PARA MANEJO DE FECHAS
moment().format()

module.exports = { 
  getStoresStatus : async (req,res) => {
    const stringConnection = 'mssql://wms:pjc3l1@192.168.0.33/SBO_KAYSER'
    try{
      const query_get_status = `
        SELECT T1.U_GSP_DFLTCARD, T1.U_GSP_TIPOINTEGR, T1.U_GSP_TIPOINTEGRCP, T2.U_GSP_AUTOEXEC, T2.U_GSP_AUTOEXEC FROM [@GSP_TPVSHOP] AS T1 INNER JOIN [@GSP_TPVWCD] AS T2   ON T1.U_GSP_DFLTCARD=T2.U_GSP_NAME
      `
      const pool = await sql.connect(stringConnection)
      const result = await pool.request().query(query_get_status)     
      res.status(200).json(result.recordset);
      sql.close();
    } catch (err) {
      sql.close();
    }
  }
}
