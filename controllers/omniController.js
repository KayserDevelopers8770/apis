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
    console.dir(sale);

    //1° - VERIFICAR QUE EL PEDIDO NO HAYA SIDO GUARDADO CON ANTERIORIDAD
    const query_verificar_venta = `
      SELECT id FROM Venta WHERE codigo_cliente='${sale.cliente.codigo}' AND numero_documento='${sale.tienda.numero}' AND 
      codigo_tienda='${sale.tienda.codigo}' AND instance_database='${sale.instance}'
    `
    console.log(query_verificar_venta);
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
    const date_sale = sale.documento.fecha + ' ' + sale.documento.hora
    const date_despatch = moment(date_sale).add(time_max_despatch, 'd').format("YYYY-MM-DD hh:mm:ss")
    const query_insert_pedido = `
      INSERT INTO [OMNI_KAYSER].dbo.DocumentoSalida VALUES ( 
		  '${id_almacen}','${id_owner}','${correlativo}','${nom_pedido}','${sale.cliente.rut}','${tip_pedido}','${date_sale}','','${date_despatch}','${sale.tienda.codigo_simple}',
      '${sale.tienda.codigo}','${sale.tienda.region}','','',0,0,'','${date_sale}','${sale.documento.numero}',
      '','','','','C','','','')
    `
    const result_insert_pedido = await pool.request().query(query_insert_pedido)
    if (result_insert_pedido.rowsAffected[0]!==1){ // SI NO SE INSERTO EL PEDIDO OMNI
      sql.close();
      return res.status(200).json({ success: false, detail : 'NO SE PUDO GUARDAR EL PEDIDO OMNI' }) 
    }

    //4° - INGRESAMOS LOS SKUS DEL PEDIDO
    let posicion = 0
    var query_insert_skus_pedido = 'INSERT INTO [OMNI_KAYSER].dbo.DetalleSalida VALUES '
    sale.skus.forEach(element => { 
      query_insert_skus_pedido += `( '${id_almacen}','${id_owner}','${correlativo}','${element.codigo}','${posicion}',${element.cantidad} ),`
      posicion++
    });
    const result_insert_skus_pedido = await pool.request().query(query_insert_skus_pedido.slice(0,-1))
    let filas_afectadas = result_insert_skus_pedido.rowsAffected[0]
    if (filas_afectadas == 0) { // SI NO SE INSERTO EL PEDIDO OMNI
        sql.close();
        return res.status(200).json({ success: false, detail: 'NO SE GUARDO NINGUN PRODUCTO DEL PEDIDO' })
    }else{
      if (filas_afectadas != posicion){
        sql.close();
        return res.status(200).json({ success: false, detail: 'UNO O VARIOS PRODUCTOS DEL PEDIDO NO FUERON GUARDADOS' })        
      }
    }
    
    //5° INGRESAMOS LOS DATOS DEL CLIENTE
    let detalle = '' //por ahora el detalle de cliente será vacio
    const query_insert_cliente = `
      INSERT INTO [OMNI_KAYSER].dbo.Cliente VALUES ('${sale.cliente.codigo}','${sale.cliente.rut}','${sale.cliente.nombre}','${sale.cliente.direccion}','${sale.cliente.comuna}','${sale.cliente.ciudad}','${sale.cliente.email}',
      '${sale.cliente.telefono}','${sale.cliente.celular}','${sale.cliente.fecha_nacimiento}','${sale.cliente.fecha_registro}','${sale.cliente.tipo}','${detalle}')
    `
    const result_insert_cliente = await pool.request().query(query_insert_cliente)    
    if (result_insert_cliente.rowsAffected[0]!==1){ // SI NO SE INSERTO EL CLIENTE OMNI
      sql.close();
      return res.status(200).json({ success: false, detail : 'NO SE PUDO GUARDAR EL CLIENTE OMNI' }) 
    }

    //6º INSERTAMOS LOS DATOS DE LA VENTA
    const query_insert_venta = `
      INSERT INTO [OMNI_KAYSER].dbo.Venta VALUES ('${sale.cliente.codigo}','${sale.documento.numero}','${correlativo}','${sale.documento.fecha}','${sale.tienda.codigo_simple}','${sale.instance}')
    `
    const result_insert_venta = await pool.request().query(query_insert_venta)
    if (result_insert_venta.rowsAffected[0]!==1){ // SI NO SE INSERTO EL CLIENTE OMNI
      sql.close();
      return res.status(200).json({ success: false, detail : 'NO SE PUDO GUARDAR LA VENTA OMNI' }) 
    }
    //7° - INGRESAMOS LOS SKUS DE LA VENTA
    //PRIMERO OBTENEMOS EL ULTIMO VALOR AUTO INCREMEMENT INSERTADO EN LA TABLA VENTAS
    const result_last_venta = await pool.request().query("SELECT @@IDENTITY AS 'id'")  
    let last = result_last_venta.recordset[0]['id']
    var query_insert_skus_venta = 'INSERT INTO [OMNI_KAYSER].dbo.VentaDetalle VALUES '
    posicion=0 //RESETEAMOS EL VALOR PARA ITERARLO NUEVAMENTE
    sale.skus.forEach(element => { 
      query_insert_skus_venta += `('${last}','${element.codigo}',${element.cantidad},${element.precio}),`
      posicion++
    });
    const result_insert_skus_venta = await pool.request().query(query_insert_skus_venta.slice(0,-1))
    filas_afectadas = result_insert_skus_venta.rowsAffected[0]
    console.log("FILAS AFECTADAS:" + filas_afectadas, "POSICION: " +  posicion);
    if (filas_afectadas == 0) { // SI NO SE INSERTO EL VENTA OMNI
        sql.close();
        return res.status(200).json({ success: false, detail: 'NO SE GUARDO NINGUN PRODUCTO DE LA VENTA' })
    }else{
      if (filas_afectadas != posicion){
        sql.close();
        return res.status(200).json({ success: false, detail: 'UNO O VARIOS PRODUCTOS DE LA VENTA NO FUERON GUARDADOS' })        
      }
    }    

    //FINALMENTE -  Enviamos la respuesta al servidor
    // console.log("filas afectadas",result_insert_pedido.rowsAffected[0]);  
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