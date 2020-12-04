const mysql = require("mysql");

const mysqlConnection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"&Root.312",
    database: "parquimetro"
});

mysqlConnection.connect(function(err){
    if(err){
        console.log(err);
    } else { 
        console.log("Connected to DB");
    }
});

module.exports = mysqlConnection;