// Se importa la librería cheerio,
// para extraer datos del HTML
import cheerio from "cheerio";

// Lógica para escribir archivo CSV
// Importar librería de escritura CSV
import csv from "csv-writer";

// Se importa la librería que hemos creado
// obteniendo solo la función "getDataUrl"
import { getDataUrl } from "./lib/lee_pagina.js";

// Se establecen constantes de donde obtener los datos
const ruta = "https://www.meganoticias.cl/temas/Coronavirus-en-Chile/";
const filtro_a_usar = ".box-articulos";

/*
    En este caso no se usa la constante de la biblioteca
    Se define ruta propia para la página desde donde obtener
    la información
*/
getDataUrl(ruta, filtro_a_usar)
  .then(function (respuesta) {
    /*
        Deseo crear la lógica para generar 
        una salida de la forma:
        {"dia": cantidad, "dia": cantidad ...}
        */
    //console.log(respuesta);
    const $ = cheerio.load(respuesta);

    // Obtener arreglo con todos los elemento de tipo "Artículos"
    // mediante su etiqueta "article"
    let articulos = $("article");
    console.log("Cantidad de Artículos", articulos.length);

    let titulo = $(articulos[10]).find("figure div.bottom h2").text();
    let fecha = $(articulos[10]).find("figure .bottom .fecha").text().trim();

    console.log("titulo en posición 10", titulo);
    console.log("fecha en posición 10", fecha);

    /* Se crea una variable para llevar el contador de noticias por día,
            con la estructura tipo:
            let noticias_dia = {"dia": cantidad,}
        */
    let noticias_dia = {};

    // Podemos recorrer (ejecutar varias veces el bloque de código)
    // usando de referencia la posición de "indice", comenzando en cero,
    // hasta el largo (cantidad) de elementos del arreglo.
    for (let indice = 0; indice < articulos.length; indice++) {
      // Se obtiene el valor del texto del elemento con clase "fecha"
      // y se quitan los caracteres (espacios) que están ántes
      // y después del contenido.
      let fecha = $(articulos[indice])
        .find("figure .bottom .fecha") // Busca el elemento
        .text() // extrae el texto visible en página
        .trim(); // quita los espacios

      console.log("fecha en posición " + indice, fecha);

      /* Quiero obtener una estructura de la siguiente forma, por ejemplo:
            {
                "Sep 15": 1,
                "Sep 14": 2,    
                ...
            }
            */
      // Se evalúa si no existe el contador para esa fecha
      if (isNaN(noticias_dia[fecha])) {
        // Si no existe, se crea el contador para la fecha, iniciando en 1
        noticias_dia[fecha] = 1;
      } else {
        // Cuando ya existe, se aumenta el contador
        noticias_dia[fecha] = noticias_dia[fecha] + 1;
      }
    }
    // Terminado el ciclo "for", tendremos una variable con la
    // estructura necesaria

    /*
      Se genera un arreglo para contener los datos procesados,
      este tendrá la siguiente estructura:
      [
        {dia: "Sep 15", cantidad: 1},
        {dia: "Sep 14", cantidad: 2},
        ...
      ]
    */
    let contadores_dia = [];

    // Se obtienen las etiquetas de días como un arreglo,
    // esto, a partir del texto del día,
    // por ejemplo "Sep 15".
    // la variable día tendrá la siguiente forma:
    // dias = ["Sep 15", "Sep 14", "Sep 13" ... ]
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
        {dia: "Sep 15", cantidad: 1},
        {dia: "Sep 14", cantidad: 2},
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
      path: "./covid.csv", // acá indicamos donde se grabará el archivo
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
    // Finaliza el proceso de escritura/grabación del archivo CSV
  })
  .catch(function (error) {
    console.error(error);
  });
