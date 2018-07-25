const sql = require('mssql')
const moment = require('moment'); //PARA MANEJO DE FECHAS
moment().format()
const stringConnection = 'mssql://sa:sa@192.168.0.33/SBO_KAYSER'

module.exports = { 
  getStoresStatus : async (req,res) => {
    
    try{
      const query_get_status = `
      SELECT T1.U_GSP_FILWAREHOUSE AS code, T1.U_GSP_DESC AS name, T1.U_GSP_AUTOEXEC AS status, T2.U_GSP_TIPOINTEGRCP AS sync, T2.U_GSP_TIPOINTEGR, CONVERT(VARCHAR(10),T1.U_GSP_DATEMOD) AS date
      FROM [@GSP_TPVWCD] AS T1 
      INNER JOIN [@GSP_TPVSHOP] AS T2 ON T1.U_GSP_FILWAREHOUSE=T2.U_GSP_SHOP 
      INNER JOIN OWHS AS T3 ON  T1.U_GSP_FILWAREHOUSE=T3.WhsCode
      WHERE T3.U_GSP_SENDTPV='Y'
      ORDER BY T1.U_GSP_FILWAREHOUSE
      `
      const pool = await sql.connect(stringConnection)
      const result = await pool.request().query(query_get_status)  
      // console.log(result.recordset);  
      res.status(200).json(result.recordset);
      sql.close();
    } catch (err) {
      sql.close();
    }
  },
  
  changeStoreStatus : async (req,res) => {
    try {
      const { codStore, status } = req.params
      console.log("Impresion de parametros: ",codStore,status);
      let query_change_status_1=''
      let query_change_status_2=''
      if(status=="true"){
        query_change_status_1 = `update [@GSP_TPVSHOP] set U_GSP_TIPOINTEGR='FACT+COBRO', U_GSP_TIPOINTEGRCP='INTEGRAR' WHERE U_GSP_SHOP= '${codStore}'`
        query_change_status_2 = `update [@GSP_TPVWCD] set U_GSP_AUTOEXEC='Y', U_GSP_FILDATEEND='2099-12-31' WHERE U_GSP_FILWAREHOUSE='${codStore}'`
      } else {
        query_change_status_1 = `update [@GSP_TPVSHOP] set U_GSP_TIPOINTEGR='NO_INTEG', U_GSP_TIPOINTEGRCP='NO_INTEG' WHERE U_GSP_SHOP= '${codStore}'`
        query_change_status_2 = `update [@GSP_TPVWCD] set U_GSP_AUTOEXEC='N', U_GSP_FILDATEEND=getdate()-1 WHERE U_GSP_FILWAREHOUSE='${codStore}'`
      }

      const pool = await sql.connect(stringConnection)
      const result1 = await pool.request().query(query_change_status_1)  
      console.log('result1',result1);
      if (result1 && result1.rowsAffected[0] == 0) { // SI NO SE ACTUALIZO EN LA TABLA U_GSP_TIPOINTEGR
          console.log('ERROR AL ACTUALIZAR EN TABLA GSP_TPVSHOP');
          sql.close();
          return res.status(200).json({ success: false, detail: 'ERROR AL ACTUALIZAR EN TABLA GSP_TPVSHOP' })
      }

      const result2 = await pool.request().query(query_change_status_2)  

      if (result2 && result2.rowsAffected[0] == 0) { // SI NO SE ACTUALIZO EN LA TABLA U_GSP_TIPOINTEGR
          console.log('ERROR AL ACTUALIZAR EN TABLA GSP_TPVWCD, AUNQUE LA TABLA GSP_TPVSHOP SI SE ACTUALIZO, POSIBLEMENTE AHORA SEA INDETERMINADO');
          sql.close();
          return res.status(200).json({ success: false, detail: 'ERROR AL ACTUALIZAR EN TABLA GSP_TPVWCD, AUNQUE LA TABLA GSP_TPVSHOP SI SE ACTUALIZO, POSIBLEMENTE AHORA SEA INDETERMINADO' })
      }
      const resp = 'ACTUALIZACION DE TIENDA ' + codStore + ' A ESTADO: ' + status + ' SATISFACTORIA'
      console.log(resp);
      res.status(200).json({ success : true, detail : resp })
      sql.close();
    } catch(err) {
      console.log('error producido: ',err);
      sql.close();
    }
  }
}




