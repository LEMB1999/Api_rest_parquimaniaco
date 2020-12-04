const express = require("express");
const route = express.Router();

const mysqlConnection = require("../database");
route.get("/",( req , res ) => {
    mysqlConnection.query("select * from parquimetros",(err,row,fields) => {
        if(!err){
            res.json(row);
        }else{
            console.log(err);
        }
    });
});


route.get("/actualizar", ( req , res ) =>{
    let id = req.query.id;
    let estado = req.query.estado;
    console.log("id:",id)
    console.log("estado:",estado)
    let valoresAceptados =  new RegExp("[0-9]+");
    if( id.match(valoresAceptados) ){
        if( estado == "1" || estado == "0"){
            mysqlConnection.query("update parquimetros set estado = ? where id_ubicacion = ?",[estado,id],
                (err) =>{
                    if(!err){
                         console.log("Actualizacion realizada");
                         res.send('Datos Almacenados');                         
                    }else{
                         console.log("Error al actualizar la informacion");
                   }
            });
        }
    }       
});

route.post("/usuarios", (req,res) =>{
    const {user,password,nombre,apellido,correo} = req.body;
    const query = ` 
        CALL registroUsuario(?,?,?,?,?)`;
        mysqlConnection.query(query,[user,password,nombre,apellido,correo],(err) =>{
             if(!err){
                 res.json({Status:"Usuario Registrado"});
             }else{
                 console.log(err);
             }
        });
});

route.post("/Login",(req,res) =>{
    let usuario  = req.body.usuario;
    let password  = req.body.password;
    console.log(usuario,password);
    const query =  `
        CALL loginUsuario(?,?)`;
    mysqlConnection.query(query,[usuario,password],(err,rows,fields) => {
        if(err)
          res.json({estado:"Datos Incorrectos"});
        else{
            //mandar el nombre y apellido del  usuario ingresado
           //console.log(rows[1][0].nombre,rows[1][1].apellido);
           res.json({"nombre":rows[1][0].nombre,
                     "apellido":rows[1][0].apellido
        });
          
        }
    })
});






module.exports = route;



