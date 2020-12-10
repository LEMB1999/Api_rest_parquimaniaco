const { query } = require("express");
const express = require("express");
const route = express.Router();

const mysqlConnection = require("../database");
const crear_objeto = require("../cronometro");

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
    if( id == null || estado==null){
        res.json({"estado":"error datos no validos"})
    }else{
    let valoresAceptados =  new RegExp("[0-9]+");
    if( id.match(valoresAceptados) ){
        if( estado == "1" || estado == "0"){
            mysqlConnection.query("update parquimetros set estado = ? where id_ubicacion = ?",[estado,id],
                (err) =>{
                    if(!err){
                         res.json({"estado":"actualizacion realizada"});
                         if(estado == 1)
                            verificarQr(id)                   
                         else 
                            eliminar_multa(id)
                    }else{
                         console.log("Error al actualizar la informacion");
                   }
            });
          }
       } 
   }      
});

function verificarQr(dato){
    setTimeout(() => {
        mysqlConnection.query("select * from parquimetro_cliente where ubicacion=?",[dato],(err,rows)=>{
            if(err){
                throw err
            }else{
            console.log(rows.length)  
            if(rows.length<=0){
                mysqlConnection.query("CALL  insertarMulta(?)",[dato],(err)=>{
                    if(err)
                        throw err;
                });
            }}
        });
     }, 10000);
}

function eliminar_multa(id_parquimetro){
     mysqlConnection.query("CALL delete_Data(?)",[id_parquimetro],(err)=>{
         if(err)
             throw err;
     });
}



function validaciones(correos,user){
        return new Promise((resolve) =>{
            //validar si el usuario o correo ya existe 
            var estado = 0
            
            mysqlConnection.query("select correo from clientes where correo=?",[correos],(err,rows) =>{
                if(!err){
                    if(rows.length > 0){
                        resolve(-1)
                    }else{ 
                        mysqlConnection.query("select usuario from clientes where usuario=?",[user],(err,rows) =>{
                            if(!err){
                            if(rows.length > 0){
                                resolve(-2)
                            }else{
                                resolve(1)
                            }}
                    })
                    }
                }
        })
        
    })
}


//falta validar que el usuario no este registrado ni el correo
//falta  utilizar una promesa para esperar los resultados
route.post("/usuarios", (req,res) =>{
    const {user,password,nombre,apellido,correo} = req.body;
    if(user == null || password == null || nombre == null || nombre==null || apellido == null || correo==null){
        res.json({"estado":"Datos Incompletos","flag":"false"})    
    }else if(user.trim().length < 1 || password.trim().length < 1 || nombre.trim().length < 1 || apellido.trim().length < 1 || correo.trim().length < 1){
        res.json({"estado":"Datos Incompletos","flag":"false"})    
    }
    else{
        (async ()=>{
            const valor = await validaciones(correo,user)
              if(valor >=0){
                  const query = ` 
                     CALL registroUsuario(?,?,?,?,?)`;
                     mysqlConnection.query(query,[user,password,nombre,apellido,correo],(err) =>{
                         if(!err){
                             res.json({"estado":"Registro Realizado","flag":"true"});
                             console.log("registro exitoso")
                         }
                         });
                     }else if(valor == -1){
                         res.json({"estado":"el correo ya esta registrado","flag":"false"})
                     }else if (valor == -2){
                         res.json({"estado":"el usuario ya existe","flag":"false"})
                     }
          })()
    }
});


route.post("/Login",(req,res) =>{
    let usuario  = req.body.usuario;
    let password  = req.body.password;
    if( usuario==null || password==null){
        res.json({"estado":"false"})
    }else if (usuario.trim().length < 1 || password.trim().length < 1){
        res.json({"estado":"false"})
    }
    else{
            const query =  `
            CALL loginUsuario(?,?)`;
            mysqlConnection.query(query,[usuario,password],(err,rows,fields) => {
            if(err){
                res.json({"estado":"false"});
            }else{
                    //mandar el nombre y apellido del  usuario ingresado
                //console.log(rows[1][0].nombre,rows[1][1].apellido);
                //validar que el usuario exista 
                res.json({"nombre":rows[1][0].nombre,
                            "apellido":rows[1][0].apellido,
                            "estado": "true"
                });
        }
    })
}});








route.post("/qr_estado",(req,res) =>{
    let usuario = req.body.usuario;
    let id_parquimetro = req.body.id_parquimetro;
    if( usuario==null || id_parquimetro==null){
        res.json({"estado":"Errores en los Datos","flag":"false"})
    }else if (usuario.trim().length < 1 || id_parquimetro.trim().length < 1){
        res.json({"estado":"Errores en los Datos","flag":"false"})
    }else{
        let promise =  new Promise(resolve =>{
            let estado = 0
             mysqlConnection.query("select estado from parquimetros where id_ubicacion=?",[id_parquimetro],(err,rows)=>{
                 try{
                     resolve(rows[0].estado)
                 }catch(err) {
                     console.log("Error Parquimetro no registrado")
                 }
             });
        });
    (async ()=>{  
         let estado =  await promise
         if(estado == 0){
            res.json({"estado":"Estacione el auto","flag":"false"})
         }else{
            const query = `
            CALL uso_parquimetro(?,?)`;
            mysqlConnection.query(query,[usuario,id_parquimetro],(err)=>{
                res.json({"estado":"Estacionado","flag":"true"})
           }) 
         }
    })();
   }
});

//realizar pago y finalizar el uso del parquimetro
route.post("/realizar_cobro",(req,res)=>{
     let parquimetro = req.body.id_parquimetro 
     mysqlConnection.query("delete from parquimetros_clientes where id_parquimetro=?",[parquimetro],(err)=>{

     }); 
     //Pausar 10 minutos para que el usuario se desocupe el lugar
     myfunction(parquimetro,10000);
});


function cronometro(dato,duracion) {
    return new Promise(resolve => {
      
    });
  }

 async function myfunction(dato,duracion){
     try{
        let resultado = await cronometro(dato,duracion);
        console.log("perros"); // 0
     }catch(error){
         throw "error"+error;
     }
}






module.exports = route;



