'use strict'

//conexion a la base de datos
var mongoose = require('mongoose');
var app = require("./app");
var port = 3700;
const url ='mongodb://127.0.0.1:27017/portafolio'; 

mongoose.Promise = global.Promise;
        mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true}).then(() => {
            console.log("Conexion a la base datos mongodb de manera exitosa");
             //creacion del servidor
            app.listen(port, () => {
                console.log("Servidor corriendo correctamente en la url: localhost:3700")
            });
        }).catch((err)=>{console.log(err)});