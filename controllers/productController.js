const { PRENDASENDB } = require('../models/product')

// 1. Obtener todos los productos
exports.todasLasPrendas = (req, res) => {
    PRENDASENDB.find({})
    .then((prendas) => {
        if(!prendas || prendas.length === 0){
            console.log('\x1b[31m No se pudo acceder a las prendas para mostralas! \x1b[0m')
          return  res.status(500).json({ mensaje: 'No se pudo acceder a las prendas para mostralas!' })
        }
       
        const obtengoPrendas = prendas.map((prenda) => {
            return {
                codigo: prenda.codigo,
                nombre: prenda.nombre,
                precio: prenda.precio,
                categoria: prenda.categoria
            }
        })
        console.log(`\x1b[102m Productos encontrados -> \x1b[0m`)
        console.table(obtengoPrendas)
        console.log('\x1b[102m -------------------------------------------------------------------- \x1b[0m')
        
        
        return res.status(200).json(prendas)
    })
    .catch((ERROR) => {
        console.log('\x1b[31m No se pudo acceder a las prendas para mostralas! -> ->  \x1b[0m', ERROR)
        return res.status(500).json({ mensaje: 'No se pudo acceder a las prendas para mostralas! ', error: ERROR })
    })
}

//////////////////////////////////////////////////////////////////////////////////////////

// 2. Obtener un producto por su código
// 2.1 Obtener un producto con un código inexistente (debería dar 404)

exports.prendasPorCodigo = (req, res) => {
    const codigoSP = req.params.codigo
    const codigoParseado = parseInt(codigoSP)
    if(isNaN(codigoParseado)){
            console.log('\x1b[31m El código ingresado no es numérico! \x1b[0m')
            return res.status(400).json({ mensaje: 'El código ingresado no es numérico!'})
        }
    PRENDASENDB.find({ codigo: codigoParseado})
    .then((prenda) => {
        if(!prenda || prenda.length === 0){
            console.log('\x1b[31m No existe un producto con ese código! \x1b[0m')
            return res.status(404).json({ mensaje: 'No existe un producto con ese código!'})
        }
        // --- MAPEO + Console.table para mostrar x consola el producto en la Base de datos ----
        
        const existePrenda = prenda.map((prendita) => {
            return {
                codigo: prendita.codigo,
                nombre: prendita.nombre,
                precio: prendita.precio,
                categoria: prendita.categoria
            }
        })
    
        console.log(`\x1b[103m Producto encontrado con el código -> ${codigoParseado} <- : \x1b[0m`)
        console.table(existePrenda)
        console.log('\x1b[103m -------------------------------------------------------------------- \x1b[0m')
        //---------------------------
        return res.status(200).json(prenda)
    })
    .catch((ERROR) => {
        console.log('\x1b[31m No se pudo acceder a la prenda con ese código! -> \x1b[0m', ERROR)
        return res.status(500).json({ mensaje: 'No se pudo acceder a la prenda con ese código!', error: ERROR })
    })
}

//////////////////////////////////////////////////////////////////////////////////////////

// 3. Crear un nuevo producto
exports.agregarProducto = (req, res) => {
    const nuevaPrenda = new PRENDASENDB({ ...req.body })

    PRENDASENDB.findOne({ codigo: nuevaPrenda.codigo })
        .then((prendaExistente) => {
            if (prendaExistente) {
                console.log('\x1b[33m Ya existe una prenda con ese código! \x1b[0m')
                return res.status(409).json({ mensaje: 'Ya existe una prenda con ese código!' })
            }

            nuevaPrenda.save()

            const agregadaPrenda = {
                    codigo: nuevaPrenda.codigo,
                    nombre: nuevaPrenda.nombre,
                    precio: nuevaPrenda.precio,
                    categoria: nuevaPrenda.categoria
                }
            console.log(`\x1b[102m Se agregó un nuevo producto a la base de datos con el código ${agregadaPrenda.codigo}  \x1b[0m`)
            console.table(agregadaPrenda)
            console.log('\x1b[102m -------------------------------------------------------------------- \x1b[0m')
            return res.status(201).json({ mensaje: ['Nuevo producto agregado a la Base de Datos', nuevaPrenda] })
        })
       
        .catch((ERROR) => {
            console.log('\x1b[31m No se pudo agregar el producto a la base de datos! ->  \x1b[0m', ERROR)
            return res.status(500).json({ mensaje: 'Error en el servidor al agregar el producto.', error: ERROR })
        })
}

////////////////////////////////////////////////////////

// 4. Modificar un producto existente
exports.modificarProducto = (req, res) => {
    const codigoSP = req.params.codigo
    const codigoParseado = parseInt(codigoSP)
    let prendas
    if(isNaN(codigoParseado)){
            console.log('\x1b[31m El código ingresado no es numérico! \x1b[0m')
            return res.status(400).json({ mensaje: 'El código ingresado no es numérico!'})
        }
    if(codigoParseado < 0){
        console.log('\x1b[31m El código ingresado no es numérico POSITIVO! \x1b[0m')
        return res.status(400).json({ mensaje: 'El código ingresado no es numérico POSITIVO!'})
    }
        PRENDASENDB.findOneAndUpdate({ codigo: codigoParseado }, { ...req.body })
        .then((prenda) => {
            if(!prenda){
                console.log('\x1b[31m No existe un producto con ese código! \x1b[0m')
                return res.status(404).json({ mensaje: 'No existe un producto con ese código!'})
            }
            
            const existePrenda = {
                    codigo: codigoParseado,
                    ...req.body
                }
            
            console.log(`\x1b[103m Producto modificado con el código -> ${codigoParseado} <- : \x1b[0m`)
            console.log('\x1b[32m Se modificó un producto en la base de datos con el código -> \x1b[0m', codigoParseado)
            console.table(existePrenda)
            console.log('\x1b[103m -------------------------------------------------------------------- \x1b[0m')
            return res.status(200).json({ mensaje: ['Producto modificado en la Base de Datos', existePrenda] })
            
        })
    
        .catch((ERROR) => {
            console.log('\x1b[31m No se pudo modificar el producto en la base de datos! -> \x1b[0m', ERROR)
            return res.status(500).json({ mensaje: 'Error en el servidor al modificar el producto.', error: ERROR })
        })
}

/////////////////////////////////////////////////////////////////

// 5. Eliminar un producto
exports.eliminarProducto = (req, res) => {
    const codigoSP = req.params.codigo
    const codigoParseado = parseInt(codigoSP)
    if(isNaN(codigoParseado)){
            console.log('\x1b[31m El código ingresado no es numérico! \x1b[0m')
            return res.status(400).json({ mensaje: 'El código ingresado no es numérico!'})
        }
    if(codigoParseado < 0){
        console.log('\x1b[31m El código ingresado no es numérico POSITIVO! \x1b[0m')
        return res.status(400).json({ mensaje: 'El código ingresado no es numérico POSITIVO!'})
    }
        PRENDASENDB.findOneAndDelete({ codigo: codigoParseado })
        .then((prenda) => {
            if(!prenda){
                console.log('\x1b[31m No existe un producto con ese código! \x1b[0m')
                return res.status(404).json({ mensaje: 'No existe un producto con ese código!'})
            }
            
            const eliminadaPrenda = {
                    codigo: codigoParseado,
                    nombre: prenda.nombre,
                    precio: prenda.precio,
                    categoria: prenda.categoria
                }
            
            console.log(`\x1b[102m Producto eliminado con el código -> ${codigoParseado} <- : \x1b[0m`)
            console.log('\x1b[32m Se eliminó un producto en la base de datos con el código -> \x1b[0m', codigoParseado)
            console.table(eliminadaPrenda)
            console.log('\x1b[102m -------------------------------------------------------------------- \x1b[0m')
            return res.status(200).json({ mensaje: ['Producto eliminado en la Base de Datos', eliminadaPrenda] })
            
        })
    
        .catch((ERROR) => {
            console.log('\x1b[31m No se pudo eliminar el producto en la base de datos! -> \x1b[0m', ERROR)
            return res.status(500).json({ mensaje: 'Error en el servidor al eliminar el producto.', error: ERROR })
        })
}
/////////////////////////////////////////////////////////////////////////////////

// 6. Buscar productos por término

exports.buscarProductoPorCoincidenciaEnNombre = (req, res) => {
    const { q } = req.query
    
    if (!q) {
        console.log('\x1b[31m No se ingresó el parámetro q! \x1b[0m')
        return res.status(400).json({ mensaje: 'No se ingresó el parámetro q!' })
    }

    PRENDASENDB.aggregate([
        {
            $match: {
                nombre: { 
                    $regex: q, 
                    $options: 'i' 
                }
            }
        }
    ])
    .then((prenda) => {
        if (!prenda || prenda.length === 0) {
            console.log('\x1b[31m No existe un producto con ese nombre! \x1b[0m')
            return res.status(404).json({ mensaje: 'No existe un producto con ese nombre!' })
        }

        const existePrenda = prenda.map((prendita) => {
            return {
                codigo: prendita.codigo,
                nombre: prendita.nombre,
                precio: prendita.precio,
                categoria: prendita.categoria
            };
        });

        console.log(`\x1b[103m Productos encontrados -> \x1b[0m`)
        console.table(existePrenda)
        console.log('\x1b[103m -------------------------------------------------------------------- \x1b[0m')

        return res.status(200).json(prenda)
    })
    .catch((ERROR) => {
        console.log('\x1b[31m No se pudo acceder a las prendas con ese nombre! -> \x1b[0m', ERROR)
        return res.status(500).json({ mensaje: 'No se pudo acceder a las prendas con ese nombre!', error: ERROR })
    })
}
////////////////////////////////////////////////////////////////////////////////

// 7. Filtrar productos por categoria

exports.filtrarProductoPorCategoria = (req, res) => {
    const { categoria } = req.params
    if(!categoria){
        console.log('\x1b[31m No se ingresó el parámetro categoria! \x1b[0m')
        return res.status(400).json({ mensaje: 'No se ingresó el parámetro categoria!'})
    }
    PRENDASENDB.find({categoria : {"$regex": `(?i)^\\s*${categoria}\\s*$`}})
    .then((prenda) => {
        if(!prenda || prenda.length === 0){
            console.log('\x1b[31m No existe un producto con ese categoria! \x1b[0m')
            return res.status(404).json({ mensaje: 'No existe un producto con ese categoria!'})
        }
        // --- MAPEO + Console.table para mostrar x consola el producto en la Base de datos ----
        
        const existePrenda = prenda.map((prendita) => {
            return {
                codigo: prendita.codigo,
                nombre: prendita.nombre,
                precio: prendita.precio,
                categoria: prendita.categoria
            }
        })
    
        console.log(`\x1b[102m Productos encontrados -> \x1b[0m`)
        console.table(existePrenda)
        console.log('\x1b[102m -------------------------------------------------------------------- \x1b[0m')
        //---------------------------
        
        return res.status(200).json(prenda)
    })
    .catch((ERROR) => {
        console.log('\x1b[31m No se pudo acceder a las prendas con ese categoria! -> \x1b[0m', ERROR)
        return res.status(500).json({ mensaje: 'No se pudo acceder a las prendas con ese categoria!', error: ERROR })
    })
}
////////////////////////////////////////////////////////////////////////////////


// 8. Filtrar productos por rango de precio

exports.busquedaPorRangoDePrecio = (req, res) => {
    const { min } = req.params
    const { max } = req.params
    if(!min || !max){
        console.log('\x1b[31m No se ingresó el parámetro min o max! \x1b[0m')
        return res.status(400).json({ mensaje: 'No se ingresó el parámetro min o max!'})
    }
    PRENDASENDB.find({ precio: { $gte: min, $lte: max } })
    .then((prenda) => {
        if(!prenda || prenda.length === 0){
            console.log('\x1b[31m No existe un producto con ese rango de precio! \x1b[0m')
            return res.status(404).json({ mensaje: 'No existe un producto con ese rango de precio!'})
        }
        // --- MAPEO + Console.table para mostrar x consola el producto en la Base de datos ----
        
        const existePrenda = prenda.map((prendita) => {
            return {
                codigo: prendita.codigo,
                nombre: prendita.nombre,
                precio: prendita.precio,
                categoria: prendita.categoria
            }
        })
    
        console.log(`\x1b[103m Productos encontrados -> \x1b[0m`)
        console.table(existePrenda)
        console.log('\x1b[103m -------------------------------------------------------------------- \x1b[0m')
        //---------------------------
        
        return res.status(200).json(prenda)
    })
    .catch((ERROR) => {
        console.log('\x1b[31m No se pudo acceder a las prendas con ese rango de precio! -> \x1b[0m', ERROR)
        return res.status(500).json({ mensaje: 'No se pudo acceder a las prendas con ese rango de precio!', error: ERROR })
    })
}

////////////////////////////////////////////////////////////////////////////

// 9. Carga masiva de productos

exports.agregarProductosMasivos = (req, res) => {

  const prendas = Array.isArray(req.body) ? req.body : [req.body]

  const codigos = prendas.map(p => p.codigo)

  PRENDASENDB.find({ codigo: { $in: codigos } })
    .then(prendasExistentes => {
      if (prendasExistentes.length > 0) {
        const codigosExistentes = prendasExistentes.map(p => p.codigo)
        console.log('\x1b[33m Algunos códigos ya existen en la base de datos. \x1b[0m')
        return res.status(409).json({ mensaje: 'Algunos códigos ya existen', codigos: codigosExistentes })
      }

      PRENDASENDB.insertMany(prendas)
        .then(prendasAgregadas => {
          console.log(`\x1b[102m Se agregaron ${prendasAgregadas.length} prendas a la base de datos \x1b[0m`)
          prendasAgregadas.forEach(p => console.table({ codigo: p.codigo, nombre: p.nombre, precio: p.precio }))
          return res.status(201).json({ mensaje: 'Prendas agregadas exitosamente', prendas: prendasAgregadas })
        })
        .catch(error => {
          console.log('\x1b[31m Error al guardar las prendas: \x1b[0m', error)
          return res.status(500).json({ mensaje: 'Error al guardar las prendas', error })
        })
    })
    .catch(error => {
      console.log('\x1b[31m Error al verificar duplicados: \x1b[0m', error);
      return res.status(500).json({ mensaje: 'Error al verificar códigos existentes', error })
    })

}

////////////////////////////////////////////////////////////////////////////////////////////

