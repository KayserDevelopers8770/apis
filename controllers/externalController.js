const sql = require('mssql')
const moment = require('moment'); //PARA MANEJO DE FECHAS
moment().format()
const stringConnection = 'mssql://sa:sa@192.168.0.33/SBO_KAYSER'

module.exports = { 
  getDetailedPurchasesPromoters : async (req,res) => {    
    try{
      const query_get_detailed_purchases = `
      select    t1.LicTradNum as numeroCedula, CONVERT(DATE, U_GSP_CADATA) FechaCompra, (CONVERT(date, getdate())) as FechaActualizacion, 
        case  
          when U_GSP_CADOCU IN ('vtd','vab') then CAST((U_GSP_CATOTA) * -1 AS Int)
          when U_GSP_CADOCU not IN ('vtd','vab') then CAST((U_GSP_CATOTA) AS Int)  end as  Total,
        case 
          when U_GSP_CADOCU IN ('vti','VTIM','VTD','VAB','VFA') then 'COMPRAS'  END  as Indicador
      from [@GSP_TPVCAP] t0  inner join OCRD t1 on t1.CardCode=t0.U_GSP_CACLIE 
      where U_GSP_CADOCU not in ('vti_ag','vtim_ag','vtd_ag') and t1.GroupCode='6' and  U_GSP_CADATA between DATEADD(DAY, -15 , GETDATE()) AND getdate()
      `
      const pool = await sql.connect(stringConnection)
      const result = await pool.request().query(query_get_detailed_purchases)  

      console.log(result.recordset);  
      
      res.status(200).json(result.recordset);
      sql.close();
    } catch (err) {
      sql.close();
    }
  }
}

