//importar modulo mysql
const mysql = require("mysql");

//Crear conexión a la base de datos
const mysqlConnection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"&Root.312",
    database: "parquimetro"
});

//realizar la conexion a la base de datos
mysqlConnection.connect(function(err){
    if(err){
        console.log(err);
    } else { 
        console.log("Connected to DB");
    }
});

//exportar modulo
module.exports = mysqlConnection;