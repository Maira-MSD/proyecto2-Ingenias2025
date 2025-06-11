const express = require("express");
const app = express();
const path = require("path");

//importar archivo conexion/desconexion de mongo

const {connectToMongoDB , disconnectFromMongoDB} = require("./src/mongodb");

//configuracion EJS

app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));


//archivos estaticos

app.use(express.static(path.join(__dirname, 'public')));

//Middleware

app.use((req,res,next) => {
    res.header("Content-Type", "application/json; charset=utf-8");
    next();
});

app.use(express.json());

const data = {
    titulo:" ",
    mensaje:" ",
    productos:" ",
}


app.get("/", (req,res) => {
  res.send("Los mejores productos, al mejor precio");
  });

app.get("/productos", async (req,res) => {
  
//conexion a Mongo y control de error
try {
    client = await connectToMongoDB();
    if (!client) {
    return res.status(500).send("Error al conectarse a mongoDB");
  }
  
 //acceso a la bbdd
    
const db = client.db("super");
const productosSuper = await db.collection("super").find().toArray();

console.log(productosSuper);

//error si no genera la lista
} catch (error) {
    console.error("Error en /productos:", error);
    res.status(500).send("Error al obtener los productos");
  
  //desconexion de mongo
  
}  finally {
    if (client) {
      await disconnectFromMongoDB(); 
    }}
});


//funcion para busqueda de productos por nombre

app.get("/productos/:nombre", async (req, res) => {
  
  try {
    const nombreProducto = req.params.nombre;

    client = await connectToMongoDB();
    if (!client) {
      return res.status(500).send("Error al conectarse a MongoDB");
    }

    const db = client.db("super");

    const nombreEncontrado = await db.collection("super").findOne({ nombre: nombreProducto });

    if (!nombreEncontrado) {
      return res.status(404).send(`No se encontró el producto ${nombreProducto}`);
    }

    console.log(nombreEncontrado);

  } catch (error) {
    console.error("Error en /productos/:nombre:", error);
    res.status(500).send("Error al buscar producto por nombre");
  } finally {
    if (client) {
      await disconnectFromMongoDB();
    }
  }
});

//funcion para agregar nuevos productos a la bbdd

app.post("/productos", async( req,res) => {

const nuevoProducto = req.body;

//control de error en el formato

if (
  !nuevoProducto ||
  !nuevoProducto.codigo ||
  !nuevoProducto.nombre ||
  !nuevoProducto.categoria ||
  nuevoProducto.precio === undefined
) {
  return res.status(400).send("Faltan campos requeridos: codigo, nombre o precio");
}

if (!nuevoProducto || nuevoProducto === undefined){
    return res.status(400).send("Error en el formato crear");
}

//conexion con mongo
try {
 client = await connectToMongoDB();
    if (!client) {
      return res.status(500).send("Error al conectarse a MongoDB");
    };

//creacion del recurso

const collection = client.db("super").collection("super");
await collection.insertOne(nuevoProducto);

console.log("Nuevo producto agregado");
return res.status(201).send("Nuevo Producto");

} catch (error) {
  console.log("Error al crear el producto", error);
  return res.status(500).send("Error del servidor al crear el producto");

} finally {
    if (client) {
         await disconnectFromMongoDB();
    }
}

});

//busqueda por codigo

app.get("/productos/:codigo", async (req, res) => {
  
  try {
    const codigoProducto = parseInt(req.params.codigo);

    client = await connectToMongoDB();
    if (!client) {
      return res.status(500).send("Error al conectarse a MongoDB");
    }

    const db = client.db("super").collection("super");

    const productoEncontrado = await db.collection("super").findOne({ codigo: codigoProducto });

    if (!productoEncontrado) {
      return res.status(404).send(`No se encontró el producto ${codigoProducto}`);
    }

    console.log(productoEncontrado);
    return res.status(200).json(productoEncontrado)


  } catch (error) {
    console.error("Error en /productos/:codigo", error);
    res.status(500).send("Error al buscar producto por codigo");
  } finally {
    if (client) {
      await disconnectFromMongoDB();
    }
  }
});


//funcion para poder modificar los precios de la bbdd del super

app.put("/productos/:codigo", async(req,res) => {
  const codigo = parseInt(req.params.codigo);
  const {nuevoPrecio} = req.body;

  if (
    isNaN(codigo) ||
    nuevoPrecio === undefined ||
    typeof nuevoPrecio !== "number"
  ){
    return res.status(400).send("Error en el formato de datos");
  }

  //conexion con mongo
try {
 client = await connectToMongoDB();
    if (!client) {
      return res.status(500).send("Error al conectarse a MongoDB");
    };

//busqueda del producto por codigo

const productoBuscado = await collection.findOne({ codigo: codigo });
console.log("Producto encontrado:", productoBuscado);

//modificacion del precio

const collection = client.db("super").collection("super");
const resultado = await collection.updateOne(
    {codigo: codigo},
    {$set:{precio: precio}}
);

//control de busqueda del producto a modificar
  if (resultado.matchedCount === 0) {
      return res.status(404).send("Producto no encontrado");
    }

console.log("Precio modificado");
return res.status(200).send(nuevoPrecio);

} catch (error) {
  console.log("Error al modificar el precio", error);
  return res.status(500).send("Error del servidor al modificar el precio");

} finally {
    if (client) {
         await disconnectFromMongoDB();
    }
}

});

//funcionamiento del puerto
app.listen(3000, () => {
    console.log("Servidor iniciado en el puerto 3000")
});