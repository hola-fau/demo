// Lógica para escribir archivo CSV
// Importar librería de escritura CSV
import csv from "csv-writer";

// Se importa librería de Twitter
import Twitter from "twitter";

// Se configura el uso de la librería de Twitter
// Cada parámetro debe definirse en el terminal
// como variables de ambiente.
// NO PONER LOS VALORES EN EL CÓDIGO
var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

// Se obtienen los datos desde la API
client.get('search/tweets', { q: 'pokemon go', count: 50 })
.then(function (tweets) {

        // Al funcionar correctamente, desplegar el resultado
        // y luego generar el CSV de salida
        console.log("*********** Twits obtenidos ***********");
        console.log(tweets.statuses.length);

        console.log("*********** Twit en posición 10 ***********");
        console.log(tweets.statuses[10]);
        console.log("*********** Texto de Twit en posición 10 ***********");
        console.log(tweets.statuses[10].text);
        console.log("****************************************************");

        // Generar el procesamiento de los datos
        /* Se crea una variable para llevar el contador de noticias por día,
                con la estructura tipo:
                let noticias_dia = {"dia": cantidad,}
            */
        let noticias_dia = {};

        // Podemos recorrer (ejecutar varias veces el bloque de código)
        // usando de referencia la posición de "indice", comenzando en cero,
        // hasta el largo (cantidad) de elementos del arreglo.
        for (let indice = 0; indice < tweets.statuses.length; indice++) {
            // Se obtiene el valor del texto del elemento "created_at"
            // y se quitan los caracteres (espacios) que están ántes
            // y después del contenido.
            let fecha_full=new Date(tweets.statuses[indice].created_at)
            // Se obtiene la fecha en formato: "2020-9-22"
            let fecha = fecha_full.getFullYear() + "-" + fecha_full.getMonth() + "-" + fecha_full.getDay() + " " + fecha_full.getHours()

            // console.log("twit en posición " + indice, fecha);

            /* Quiero obtener una estructura de la siguiente forma, por ejemplo:
                  {
                      "Sep 15": 1,
                      "Sep 14": 2,    
                      ...
                  }
                  */
            // Se evalúa si un tweet contiene la palabra "game" como parte del texto
            if(tweets.statuses[indice].text.indexOf('game') > -1){
                // Se evalúa si no existe el contador para esa fecha
                if (isNaN(noticias_dia[fecha])) {
                    // Si no existe, se crea el contador para la fecha, iniciando en 1
                    noticias_dia[fecha] = 1;
                } else {
                    // Cuando ya existe, se aumenta el contador
                    noticias_dia[fecha] = noticias_dia[fecha] + 1;
                }
            }
        }
        // Terminado el ciclo "for", tendremos una variable con la
        // estructura necesaria

        /*
          Se genera un arreglo para contener los datos procesados,
          este tendrá la siguiente estructura:
          [
            {dia: "2020-9-22", cantidad: 15},
            {dia: "2020-9-21", cantidad: 2},
            ...
          ]
        */
        let contadores_dia = [];

        // Se obtienen las etiquetas de días como un arreglo,
        // esto, a partir del texto del día,
        // por ejemplo "2020-9-22".
        // la variable día tendrá la siguiente forma:
        // dias = ["2020-9-22", "2020-9-22" ... ]
        let dias = Object.keys(noticias_dia);

        // Ya que es un arreglo, se recorren los días procesados
        for (let indice = 0; indice < dias.length; indice++) {
            // Se obtiene la etiqueta del día
            let etiqueta_dia = dias[indice];
            // Se crea el objeto json para el día
            let dia_contador = {
                dia: etiqueta_dia,
                cantidad: noticias_dia[etiqueta_dia]
            };

            // Se agrega al arreglo el objeto del día
            contadores_dia.push(dia_contador);
        }
        // Terminado el ciclo "for" contaremos con una variable,
        // con la siguiente forma:
        /*
        contadores_dia = [
            {dia: "2020-9-22", cantidad: 15},
            {dia: "2020-9-22", cantidad: 2},
            ...
          ]    
        */

        console.log("Objeto de cantidad de noticias por día:", noticias_dia);
        console.log("Arreglo de cantidad de noticias por día:", contadores_dia);

        // Se obtiene objeto de escritura CSV
        const { createObjectCsvWriter } = csv;

        // Se inicializa el ojeto de escritura
        // donde indicamos que queremos grabar el archivo en el mismo directorio
        // el archivo tendrá por nombre "covid.csv"
        // Además para identificar cada dato, el encabezado del CSV será:
        // DATE, QTY
        const archivo_csv = createObjectCsvWriter({
            path: "./twitter.csv", // acá indicamos donde se grabará el archivo
            header: [
                { id: "dia", title: "DATE" },
                { id: "cantidad", title: "QTY" }
            ]
        });

        // Se escribe el archivo CSV con los datos del arreglo
        archivo_csv
            .writeRecords(contadores_dia)
            .then(function () {
                // Al completar el granbado del archivo,
                // ya podremos verlo en la carpeta.
                console.log("Archivo creado");
            })
            .catch(function (error) {
                // En caso de error, mostraremos su mensaje
                console.log("Error al crear el archivo", error);
            });
        // Finaliza el proceso de escritura/grabación del archivo CSV    }
    })
    .catch(function(error){
        console.log("Error al buscar por Twits!!!", error);
    });