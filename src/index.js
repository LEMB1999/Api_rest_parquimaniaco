//importar modulos a utilizar
const express = require("express");
const app = express();

// Configuracion del Servidor
app.set( "port" , process.env.PORT || 3000);

//Middlewares
app.use(express.json());

//Rutas
app.use(require("./routes/parquimetros"));

//Iniciar el Servidor
app.listen(3000,() => {
    console.log("Server on port ",app.get("port"))
});