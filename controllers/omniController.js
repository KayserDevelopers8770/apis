const sql = require('mssql')
const moment = require('moment');
moment().format();
// const stringConnection = 'mssql://wms:pjc3l1@192.168.0.17/WMSTEK_KAYSER'

//CONSTANTE CON LA CANTIDAD DE DIAS MAXIMOS PARA DESPACHAR UN PRODUCTO
const time_max_despatch = 2




module.exports = { 
  getStockSkus : async (req,res) => {
    const stringConnection = 'mssql://wms:pjc3l1@192.168.0.17/WMSTEK_KAYSER'
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
    try{

    const stringConnection = 'mssql://wms:pjc3l1@192.168.0.17/OMNI_KAYSER'
    const sale = req.body
    const pool = await sql.connect(stringConnection)
    console.dir(sale);

    //1° - VERIFICAR QUE EL PEDIDO NO HAYA SIDO GUARDADO CON ANTERIORIDAD
    //    ...

    //2° - OBTENER EL ULTIMO O 1ER COD_PEDIDO DE LA TABLA DOCUMENTO_SALIDA
    const result_correlativo = await pool.request()
      .execute('SP_OMNI_obtener_correlativo_pedido')
    const correlativo = result_correlativo.recordset[0].codigo_pedido
    //3° - INGRESAMOS EL PEDIDO OMNI
      //agregamos el tiempo maximo de entrega para crear una fecha_entrega maxima
      const date_sale = req.body.documento.fecha + ' ' + req.body.documento.hora
      const date_despatch = moment(date_sale).add(time_max_despatch, 'd').format("YYYY-MM-DD hh:mm:ss")

    const query_insert_pedido = `
      INSERT INTO [OMNI_KAYSER].[dbo].[DocumentoSalida] VALUES ( 
		  '01','KAYS','${correlativo}','PEDIDO_OMNI','${req.body.cliente.rut}','TRF','${date_sale}','','${date_despatch}','${req.body.tienda.codigo}',
      '${req.body.tienda.codigo}','${req.body.tienda.region}','${req.body.tienda.direccion}','','',0,0,'','${date_sale}','${req.body.documento.numero}',
      '','','','','','C','','',''
    `
    console.log(query_insert_pedido);
    const result_insert_pedido = await pool.request().query(query_insert_pedido)
    //FINALMENTE -  Enviamos la respuesta al servidor
      console.log(result_insert_pedido.recordset[0]);   
    res.status(200).json({ success: true, codigo_pedido: correlativo  })
    sql.close();
    } catch(e){
      console.log(e);
      sql.close();
    }
  }
}
//${req.body.}