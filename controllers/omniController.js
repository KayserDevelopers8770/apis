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
    const id_almacen = '01'
    const id_owner = 'KAYS'
    const nom_pedido = 'PEDIDO_OMNI'
    const tip_pedido = 'TRF'
    // console.dir(sale);

    //1° - VERIFICAR QUE EL PEDIDO NO HAYA SIDO GUARDADO CON ANTERIORIDAD
    //    const instance = sale.instance.name // POR AHORA ESTO SERA MANUAL
    const instance = 'LIAM\\SQLEXPRESS'
    const query_verificar_venta = `
      SELECT id FROM Venta WHERE codigo_cliente='${sale.cliente.codigo}' AND numero_documento='${sale.tienda.numero}' AND 
      codigo_tienda='${sale.tienda.codigo}' AND instance_database='${instance}'
    `
    const result_verify_sale = await pool.request().query(query_verificar_venta)
    if (result_verify_sale.rowsAffected[0]===1){ // SI EXISTE YA UN REGISTRO CON ESTOS PARAMETROS...
      sql.close();
      return res.status(200).json({ success: false, detail : 'ESTA VENTA YA EXISTE' }) 
    }
    
    //2° - OBTENER EL ULTIMO O 1ER COD_PEDIDO DE LA TABLA DOCUMENTO_SALIDA
    const result_correlativo = await pool.request()
      .execute('SP_OMNI_obtener_correlativo_pedido')
    const correlativo = result_correlativo.recordset[0].codigo_pedido

    //3° - INGRESAMOS EL PEDIDO OMNI
      //agregamos el tiempo maximo de entrega para crear una fecha_entrega maxima
      const date_sale = req.body.documento.fecha + ' ' + req.body.documento.hora
      const date_despatch = moment(date_sale).add(time_max_despatch, 'd').format("YYYY-MM-DD hh:mm:ss")

    const query_insert_pedido = `
      INSERT INTO [OMNI_KAYSER].dbo.DocumentoSalida VALUES ( 
		  '${id_almacen}','${id_owner}','${correlativo}','${nom_pedido}','${req.body.cliente.rut}','${tip_pedido}','${date_sale}','','${date_despatch}','${req.body.tienda.codigo}',
      '${req.body.tienda.codigo}','${req.body.tienda.region}','','',0,0,'','${date_sale}','${req.body.documento.numero}',
      '','','','','C','','','')
    `
    const result_insert_pedido = await pool.request().query(query_insert_pedido)
    if (result_insert_pedido.rowsAffected[0]!==1){ // SI NO SE INSERTO EL PEDIDO OMNI
      sql.close();
      return res.status(200).json({ success: false, detail : 'NO SE PUDO GUARDAR EL PEDIDO OMNI' }) 
    }

    //4° - INGRESAMOS LOS SKUS DEL PEDIDO
    let posicion = 0
    sale.skus.forEach(element => { 
      const query_insert_skus = `
        INSERT INTO [OMNI_KAYSER].dbo.DetalleSalida VALUES ( '${id_almacen}','${id_owner}','${correlativo}','${element.codigo}','${posicion}',${element.cantidad} )
      `
      posicion++
    });



    //FINALMENTE -  Enviamos la respuesta al servidor
    console.log("filas afectadas",result_insert_pedido.rowsAffected[0]);  
    // console.log("resultado insert completo",result_insert_pedido);
    // console.log("resultado recorset indice 0 ",result_insert_pedido.recorset[0]); 
    res.status(200).json({ success: true, codigo_pedido: correlativo  })
    sql.close();
    } catch(e){
      console.log(e);
      sql.close();
    }
  }
}
//${req.body.}