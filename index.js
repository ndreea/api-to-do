

import dotenv from "dotenv"; //Lee el fichero y en base en lo que se encuentre, guardar las cosas en el .env
dotenv.config(); //lee el fichero .env y crea las variables de entorno

/*-----------------------------*/

import express from "express";
import { leerTareas,crearTarea } from "./db.js"; //Nos importamos las tareas de la carpeta db.js

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


servidor.delete("/tareas/borrar/:id", (peticion,respuesta) => {
    respuesta.send("id recibido: " + peticion.params.id);

});


//Middleware de gestión de errores, solo se usa para la petición errónea (400)
servidor.use((error,peticion,respuesta,siguiente) => {
    respuesta.status(400);
    respuesta.json({ error : "error en la petición" });
});


servidor.listen(process.env.PORT);