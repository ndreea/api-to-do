
import dotenv from "dotenv"; //Lee el fichero y en base en lo que se encuentre, guardar las cosas en el .env
dotenv.config(); //lee el fichero .env y crea las variables de entorno

/*-----------------------------*/

import postgres from "postgres";

function conectar(){
    return postgres({
        host : process.env.DB_HOST,
        database : process.env.DB_NAME,
        user : process.env.DB_USER,
        password : process.env.DB_PASSWORD
    });
}

export function leerTareas(){
    return new Promise(async (ok,ko) => {

        let conexion = conectar();

        try{

            let tareas = await conexion `SELECT * FROM tareas`;

            conexion.end();

            ok(tareas);

        }
        catch(error){

            ko({ error : "error en la base de datos" });

        }
    });
}

export function crearTarea(tarea){
    return new Promise(async (ok,ko) => {

        let conexion = conectar();
    
        try{
    
            let [{id}] = await conexion `INSERT INTO tareas (tarea) VALUES (${tarea}) RETURNING id`;
    
            conexion.end();
    
            ok(id);
    
        }
        catch(error){
    
            ko({ error : "error en la base de datos" });
    
        }
    
    });
}

export function borrarTarea(id){
    return new Promise(async (ok,ko) => {

        let conexion = conectar();

        try{
            let {count}= await conexion `DELETE FROM tareas WHERE id = ${id}`;

            conexion.end();

            ok(count);

        }catch(error){
            ko({error: "error en base de datos"});
        }

    });
}


