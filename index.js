

import dotenv from "dotenv"; //Lee el fichero y en base en lo que se encuentre, guardar las cosas en el .env
dotenv.config(); //lee el fichero .env y crea las variables de entorno

/*-----------------------------*/

import express from "express";

const servidor = express();






servidor.listen(process.env.PORT);