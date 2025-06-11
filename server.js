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

const generarLista = (items) => {
    if (!Array.isArray(items) || items.length === 0) return '<h2>No se encontraron resultados</h2>';
 
     return `
      <h3>Encontra tus productos favoritos</h3>
      <ul>
        ${items
          .map(item => `
            <li>
              <strong>Código</strong> ${item.codigo} <br>
              <strong>Nombre</strong> ${item.nombre} <br>
              <strong>Precio</strong> ${item.precio} <br>
              <strong>Categoría</strong> ${item.categoria} <br>
            </li>
          `)
          .join('')}
      </ul>
    `;
          };

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

const listaProductos = generarLista(productosSuper);
  
//renderizado de la vista

res.render("productos", 
   {titulo: "Productos", 
    mensaje: "Encontra tus productos favoritos",
   productos: listaProductos});

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

    res.render("productos", 
      {titulo: "Detalles del producto",
      mensaje: `Resultado para: ${nombreProducto}`,
      producto: nombreEncontrado,
    });

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

if (!nuevoProducto || nuevoProducto === undefined){
   res.status(400).send("Error en el formato crear");
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
res.status(201).send("Nuevo Producto");

} catch (error) {
  console.log("Error al crear el producto", error);
  res.status(500).send("Error del servidor al crear el producto");

  
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