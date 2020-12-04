create database if not exists parquimetro;
use parquimetro;

create table parquimetros(
   id_ubicacion int unsigned  auto_increment  primary key not null,
   direccion varchar(30),
   estado boolean default 0
);clientes

insert into parquimetros(direccion,estado)
				  values("Diaz Ordaz ",0),
						("Avila Camacho ",0),
                        ("Colonia VillaJardin",0);

create table clientes (
	usuario varchar(15) primary key not null ,
	passwords  varbinary(8000) not null,
	nombre varchar(15) not null,
	apellido varchar(20),
	correo varchar(30) not null
);

create table pagos_parquimetro(
     id_parquimetro
     id_cliente      
     pago_realizado  boolean default 0
)

select * from clientes;

update parquimetros set estado = 0 where id_ubicacion = 3;

DELIMITER //

create procedure registroUsuario(
   in _user varchar(15),
   in _password varchar(8000),
   in _nombre varchar(15),
   in _apellido varchar(20),
   in _correo varchar(30)
)
begin
    if _user no exists then
		insert into clientes(usuario,passwords,nombre,apellido,correo) 
		values(_user,AES_ENCRYPT('perro123',_password),_nombre,_apellido,_correo);
	end if 
end

call loginUsuario("luis","luis");
call registroUsuario("luis","luis12","luis","mendez","luis@gmail.com")
delete from clientes where usuario = "luis1";
insert into clientes(usuario,passwords,nombre,apellido,correo)values("luis1","luis","luis","mendez","luis@correo.com")

select cast(aes_decrypt("luis", 'perro123') as char) from clientes where usuario = "luis";registroUsuario
DELIMITER ;
