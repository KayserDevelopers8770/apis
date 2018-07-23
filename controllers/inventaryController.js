const sql = require('mssql')
const moment = require('moment'); //PARA MANEJO DE FECHAS
moment().format()
const stringConnection = 'mssql://sa:sa@192.168.0.33/SBO_KAYSER'

module.exports = { 
  getStoresStatus : async (req,res) => {
    
    try{
      const query_get_status = `
      SELECT T1.U_GSP_FILWAREHOUSE AS code, T1.U_GSP_DESC AS name, T1.U_GSP_AUTOEXEC AS status, T2.U_GSP_TIPOINTEGRCP AS sync, CONVERT(DATE,T1.U_GSP_DATEMOD) AS date
      FROM [@GSP_TPVWCD] AS T1 
      INNER JOIN [@GSP_TPVSHOP] AS T2 ON T1.U_GSP_NAME=T2.U_GSP_DFLTCARD 
      INNER JOIN OWHS AS T3 ON  T1.U_GSP_FILWAREHOUSE=T3.WhsCode
      WHERE T3.U_GSP_SENDTPV='Y'
      `
      const pool = await sql.connect(stringConnection)
      const result = await pool.request().query(query_get_status)  
      console.log(result.recordset);  
      res.status(200).json(result.recordset);
      sql.close();
    } catch (err) {
      sql.close();
    }
  },
  changeStoreStatus : async (req,res) => {
    try {
      const { codStore, status } = req.params
      // console.log("Impresion de parametros: ",codStore,status);
      const query_change_status_1 = ` `      
      if(status==true){
        const query_change_status_1 = ` `
        const query_change_status_2 = ` `
      }else{
        const query_change_status_1 = ` `
        const query_change_status_2 = ` `
      }
      // const pool1 = await sql.connect(stringConnection)
      // const result1 = await pool.request().query(query_change_status_1)  
      // res.status(200).json({ code : codStore, status : status });
      res.status(200).json({ success : true })
      sql.close();
    } catch {
      sql.close();
    }
  }
}

