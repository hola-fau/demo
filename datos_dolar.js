// Lógica para escribir archivo CSV
// Importar librería de escritura CSV
import csv from "csv-writer";

// Se importa librería que hemos creado
// para usar la función que se conecta a la URL de la API
import { getUrlContent } from './lib/lee_pagina.js'

// Se obtienen los datos desde la API
getUrlContent('https://mindicador.cl/api/dolar')
    .then(function (valor_usd) {

        // Al funcionar correctamente, desplegar el resultado
        // y luego generar el CSV de salida
        console.log("*********** Valores obtenidos ***********");
        console.log(valor_usd.serie.length);

        console.log("*********** Contenido en posición 3 ***********");
        console.log(valor_usd.serie[3]);
        console.log("*********** Valor en posición 3 ***********");
        console.log(valor_usd.serie[3].valor);
        console.log("****************************************************");

        // Generar el procesamiento de los datos
        /* Se crea una variable para llevar el contador de valores por día,
                con la estructura tipo:
                let valores_dia = {"dia": valor,}
            */
        let valores_dia = {};

        // Podemos recorrer (ejecutar varias veces el bloque de código)
        // usando de referencia la posición de "indice", comenzando en cero,
        // hasta el largo (valor) de elementos del arreglo.
        for (let indice = 0; indice < valor_usd.serie.length; indice++) {
            // Se obtiene el valor del dia del elemento "fecha"
            // y se quitan los caracteres (espacios) que están ántes
            // y después del contenido.
            let fecha_full = new Date(valor_usd.serie[indice].fecha)
            // Se obtiene la fecha en formato: "2020-10-7"
            // a la función de mes "getMonth" se suma 1, ya que los meses se inician en cero
            // para el día del mes se usa la función "getDate"
            let fecha = fecha_full.getFullYear() + "-" + (fecha_full.getMonth() + 1 )+ "-" + fecha_full.getDate()

            // console.log("día en posición " + indice, fecha);

            /* Quiero obtener una estructura de la siguiente forma, por ejemplo:
                  {
                      "2020-10-7": 797.35,
                      "2020-10-6": 794.34,    
                      ...
                  }
                  */
            // Se evalúa si no existe el indicador para esa fecha
            if (isNaN(valores_dia[fecha])) {
                // Si no existe, se crea el indicador para la fecha, con el valor entregado por la API
                valores_dia[fecha] = valor_usd.serie[indice].valor;
            } 
        }
        // Terminado el ciclo "for", tendremos una variable con la
        // estructura necesaria

        /*
          Se genera un arreglo para contener los datos procesados,
          este tendrá la siguiente estructura:
          [
            {dia: "2020-10-7", valor: 797.35},
            {dia: "2020-10-6", valor: 794.34},
            ...
          ]
        */
        let contadores_dia = [];

        // Se obtienen las etiquetas de días como un arreglo,
        // esto, a partir del texto del día,
        // por ejemplo "2020-10-7".
        // la variable día tendrá la siguiente forma:
        // dias = ["2020-10-7", "2020-10-6" ... ]
        let dias = Object.keys(valores_dia);

        // Ya que es un arreglo, se recorren los días procesados
        // En este caso se inicia el indice con el largo del arreglo
        // luego se evalúa mientras el indice sea mayor o igual a cero
        // y por cada ciclo se resta 1 al indice
        // Esto se hace para generar la salida en orden inverso,
        // es decir de la fecha mas antigua a la mas nueva
        // y así mostrar de mejor forma la variación diaria
        for (let indice = dias.length; indice >= 0; indice--) {
            // Se obtiene la etiqueta del día
            let etiqueta_dia = dias[indice];
            // Se crea el objeto json para el día
            let dia_contador = {
                dia: etiqueta_dia,
                valor: valores_dia[etiqueta_dia]
            };

            // Se agrega al arreglo el objeto del día
            contadores_dia.push(dia_contador);
        }
        // Terminado el ciclo "for" contaremos con una variable,
        // con la siguiente forma:
        /*
        contadores_dia = [
            ...
            {dia: "2020-10-6", valor: 794.34},
            {dia: "2020-10-7", valor: 797.35}
          ]    
        */

        console.log("Objeto de valor de valores por día:", valores_dia);
        console.log("Arreglo de valor de valores por día:", contadores_dia);

        // Se obtiene objeto de escritura CSV
        const { createObjectCsvWriter } = csv;

        // Se inicializa el ojeto de escritura
        // donde indicamos que queremos grabar el archivo en el mismo directorio
        // el archivo tendrá por nombre "uf.csv"
        // Además para identificar cada dato, el encabezado del CSV será:
        // DATE, QTY
        const archivo_csv = createObjectCsvWriter({
            path: "./dolar.csv", // acá indicamos donde se grabará el archivo
            header: [
                { id: "dia", title: "DATE" },
                { id: "valor", title: "QTY" }
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
    .catch(function (error) {
        console.log("Error al buscar por Valores!!!", error);
    });