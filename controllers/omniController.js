const sql = require('mssql')
const stringConnection = 'mssql://wms:pjc3l1@192.168.0.17/WMSTEK_KAYSER'

module.exports = { 
  getStockSkus : async (req,res) => {
    try{
      const { substrSku } = req.params
      const pool = await sql.connect(stringConnection)
      const result = await pool.request()
        .input('input', sql.VarChar(30), substrSku)
        .execute('SP_OMNI_select_skus')        
      res.status(200).json(result.recordset);  
      sql.close();
    }catch(err){
      sql.close();
    }
  },
  setSale : async (req,res) => {
    const sale = req.body
    console.dir(sale);
    res.status(200).json({ success : true })
  }
}