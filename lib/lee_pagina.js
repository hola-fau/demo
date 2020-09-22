/*
    Se cargan librerías para obtener datos desde otra página
    
    La librería "axios" facilita conectarse a otros servidores
    La librería "cheerio" facilita explorar el HTML y extraer contenido
*/
import axios from "axios";
import cheerio from "cheerio";
// Se define una constante con el servidor
// desde donde se obtendrán los datos
// además se usa export para dejar disponible para otros archivos
export const URL_DE_CONSULTA = "https://codigonet.net";

/*
    Se crea una función para leer y procesar datos desde otros servidores
    Se usa "export" para dejar disponible la función en otros archivos
    Se usa la instrucción "async" para indicar que la función queda esperando por respuesta
*/
export async function getUrlContent(url = "") {
  let contenido_de_pagina = "no traemos contenido";
  // Se crea un bloque "seguro", mediante try y catch
  // esto quiere decir que en caso de error, se ejecuta el bloque de código
  // que está entre las llaves {} de "catch"
  try {
    // Se obtiene contenido de otra página, usando la librería AXIOS
    // indicando como parámetro la constante URL_DE_PRUEBA
    // sumando el texto recibido como parámetro de esta función
    const respuesta = await axios.get(url);
    // Una vez recibida la respuesta de la otra página
    // se asigna el resultado a la variable "contenido_de_pagina",
    // esto desde el atributo "data" de lo recibido mediante axios
    contenido_de_pagina = respuesta.data;
  } catch (error) {
    // Si se produce algún error, se ejecuta este código
    // de esta forma se evita "caida" del programa
    console.error(error); // Acá se despliega el error por consola
    contenido_de_pagina = error; // Acá se asigna el error a la variable a retornar
  }
  return contenido_de_pagina; // Acá se usa el contenido de la variable como retorno de la función
}

/*
    Se crea función para obtener datos de una página,
    haciendo uso de la otra función creada "getUrlContent",
    de esta forma se "reutiliza" el código.
    Se hace uso nuevamente de "async" para indicar que se debe esperar la respuesta
*/
export async function getDataUrl(url, filtro = "html") {
  let respuesta = await getUrlContent(url); // Acá se usa la otra función para traer datos

  // Se hace uso de "cheerio" para cargar e interpretar el contenido obtenido
  const $ = cheerio.load(respuesta); // Al interpretar el contenido es asignado a la variable "$"
  // se utiliza el contenido de la variable "filtro" recibida como parámetro
  let filtrado = $(filtro).html(); // Mediante "cheerio" se obtiene o filtra una porción de código
  return filtrado; // Se usa el contenido de "filtrado" como retorno de la función
}
