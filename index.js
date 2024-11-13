

import dotenv from "dotenv"; //Lee el fichero y en base en lo que se encuentre, guardar las cosas en el .env
dotenv.config(); //lee el fichero .env y crea las variables de entorno

/*-----------------------------*/

import express from "express";
import { leerTareas,crearTarea,borrarTarea,editarTarea,editarEstado } from "./db.js"; //Nos importamos las funciones tareas de la carpeta db.js

const servidor = express();

servidor.use((peticion,respuesta,siguiente) => {
    console.log("entramos al middleware a hacer cualquier proceso");
    siguiente(); //Permite salir del middleware y revisar los otros
});

//Creamos un middleware
servidor.use(express.json()); //Esto lo va a interceptar y se convertirá en body en la petición de node express

//Asociamos el index.html para que aparezca una vez que se carga la página
if(process.env.PRUEBAS){
    servidor.use(express.static("./pruebas")); //Middleware
}


//CONSTRUCCIÓN DE API

servidor.get("/tareas", async (peticion,respuesta) => {

    try{    
        let tareas = await leerTareas();

        respuesta.json(tareas);
    }
    catch(error){
        respuesta.status(500);

        respuesta.json({ error : "error en el servidor" });
    }

});


//Conectamos con el puerto: Estamos esperando un objeto que tiene la propiedad tarea
servidor.post("/tareas/nueva", async (peticion,respuesta,siguiente) => {
    let {tarea} = peticion.body;

    if(!tarea || tarea.trim() == ""){
        return siguiente(true);
    }

    try{

        let id = await crearTarea(tarea);

        respuesta.json({id});
    }
    catch(error){
        respuesta.status(500);

        respuesta.json({ error : "error en el servidor" });
    }

});


servidor.put("/tareas/actualizar/:id([0-9]+)/:operacion(1|2)", async (peticion,respuesta,siguiente) => {

    let operacion = Number(peticion.params.operacion); //Estraemos la operación de la URL
    let id = Number(peticion.params.operacion); //Estraemos el id de la URL
    let {tarea} = peticion.body; //Extraemos la tarea del cuerpo de la petición - Tendrá un texto o undefined

    let operaciones = [editarTarea, editarEstado]; //Creamos una variable en donde guardamos las operaciones :operacion(1|2)

    //Validamos la tarea
    if(operacion == 1 && (!tarea || tarea.trim()) == ""){
        return siguiente(true);
    }
    try{

        let cantidad = await operaciones[operacion - 1](id,tarea); //Invocamos la operación que convenga [operacion - 1]

        respuesta.json({ resultado : cantidad ? "ok" : "ko" });

    }
    catch(error){
        respuesta.status(500);

        respuesta.json({ error : "error en el servidor" });
    }

});




//Middleware de eliminar la tarea
servidor.delete("/tareas/borrar/:id([0-9]+)", async (peticion,respuesta) => {
    try{
        let id = Number(peticion.params.id);

        let cantidad = await borrarTarea(id);

        respuesta.json({ resultado : cantidad ? "ok" : "ko" });
    }
    catch(error){
        respuesta.status(500);

        respuesta.json({ error : "error en el servidor" });
    }

});


//Middleware de gestión de errores, solo se usa para la petición errónea (400)
servidor.use((error,peticion,respuesta,siguiente) => {
    respuesta.status(400);
    respuesta.json({ error : "error en la petición" });
});

//Middleware de opción por defecto (404) - si se pone una url que no existe, sale un error
servidor.use((peticion,respuesta) => {
    respuesta.status(404);
    respuesta.json({ error : "recurso no encontrado" });
});

servidor.listen(process.env.PORT);