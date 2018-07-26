const sql = require('mssql')
const stringConnection = 'mssql://sa:sa@192.168.0.33/SBO_KAYSER'

module.exports = { 
  getAvalaibleStores: async (req,res) => {
    
    try{
      const query_get_available_stores = ` SELECT WhsCode, WhsName FROM OWHS WHERE U_GSP_SENDTPV='Y' `
      const pool = await sql.connect(stringConnection)
      const result = await pool.request().query(query_get_available_stores)  
      // console.log(result.recordset);  
      res.status(200).json(result.recordset);
      sql.close();
    } catch (err) {
      sql.close();
    }
  }
}




