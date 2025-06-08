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

const data = {
    titulo:" ",
    mensaje:" ",
    productos:" ",
}


const generarLista = (items) => {
    if (!items.length) return '<h2>No se encontraron resultados</h2>';
 
 
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
    res.send("Encontra tus productos favoritos");
});

app.get("/productos", async (req,res) => {
    const client = await connectToMongoDB();
    const db = client.db("super");
    const productosSuper = await db.collection("super").find().toArray();

    await disconnectFromMongoDB();

    console.log(productosSuper);

    const listaProductos = generarLista(productosSuper)
    
    res.render("productos", {titulo: "Productos", mensaje: "Encontra tus productos favoritos", productos: listaProductos});
});


app.listen(3000, () => {
    console.log("Servidor iniciado en el puerto 3000")
});