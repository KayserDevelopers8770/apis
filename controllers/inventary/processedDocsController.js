const sql = require('mssql')
const moment = require('moment'); //PARA MANEJO DE FECHAS
moment().format()
const stringConnection = 'mssql://sa:sa@192.168.0.33/SBO_KAYSER'

module.exports = { 
  getProcessedDocs: async (req,res) => {    
    try{
      const { codStore, docState } = req.params
      let nulleable = ''
      console.log('parametros de documentos procesados',codStore, docState)
      docState == 'errors' ? nulleable = 'IS NOT NULL'  : nulleable = 'IS NULL'
      const query_get_docs = `
        SELECT DISTINCT U_GSP_CABOTI as cod_tienda, convert(varchar(10), U_GSP_CADATA,101) as fecha, U_GSP_ERROR as error
        FROM [SBO_KAYSER].[dbo].[@GSP_TPVCAP]
        WHERE U_GSP_CADOCU<>'VRG' AND U_GSP_CAESTA<>'x' AND convert(varchar(10), U_GSP_CADATA,101)<>convert(varchar(10), GETDATE(),101) 
        AND U_GSP_ERROR ${nulleable} AND U_GSP_CABOTI='${codStore}'
        ORDER by U_GSP_CABOTI
      `
      const pool = await sql.connect(stringConnection)
      const result = await pool.request().query(query_get_docs)  
      // console.log(result.recordset);  
      res.status(200).json(result.recordset);


      sql.close();
    } catch (err) {
      console.log(err);
        sql.close();
    }
  }
}




