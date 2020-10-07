var plyConfig = {
  responsive: true,
  showLink: false,
  locale: "es",
  displaylogo: false,
  displayModeBar: false,
};

var Plotly = window.Plotly || {};
window.addEventListener("load", function () {
  console.log("Iniciando Plotly");
  showCovid();
  showDolar();
});


function unpack(rows, key) {
  return rows.map(function (row) {
    return row[key]
  });
}

function showCovid() {
  Plotly.d3.csv("covid.csv", function (err, rows) {
    if (err) {
      console.log("Error en CSV", err);
      return;
    }

    var noticias = {
      type: "bar",
      x: unpack(rows, "DATE"),
      y: unpack(rows, "QTY"),
    };

    var data = [noticias];

    var layout = {
      title: "Noticias COVID por día",
      font: { size: 18 }
    };

    Plotly.newPlot("my-graph", data, layout, plyConfig);
  })
}

function showDolar() {
  Plotly.d3.csv("dolar.csv", function (err, rows) {
    if (err) {
      console.log("Error en CSV", err);
      return;
    }

    var valores_dolar = {
      type: "scatter",
      mode: 'lines',
      x: unpack(rows, "DATE"),
      y: unpack(rows, "QTY"),
    };

    var data = [valores_dolar];

    var layout = {
      title: "Variación del DóLAR por día",
      font: { size: 18 },
    };

    Plotly.newPlot("my-usd", data, layout, plyConfig);
  })
}
