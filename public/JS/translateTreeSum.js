function translate() {
    document.getElementById("language").innerHTML = "English";
    //document.getElementById("commGraphHeader").innerHTML = "Cantidad de Familias en Cada Communidad";
    document.getElementById("NTCLabel").innerHTML = "Cantidad de Árboles de Valor Rastreados";
    document.getElementById("PACLabel").innerHTML = "Porcentaje de Árboles Vivos";
    document.getElementById("PHCLabel").innerHTML = "Porcentaje de Árboles Complentamente Sanos";
}

function detranslate() {
     document.getElementById("language").innerHTML = "Espanol";
    //document.getElementById("commGraphHeader").innerHTML = "Number of Families in Each Community";
    document.getElementById("NTCLabel").innerHTML = "Number of Tracked Trees of Value";
    document.getElementById("PACLabel").innerHTML = "Percentage of Trees Alive";
    document.getElementById("PHCLabel").innerHTML = "Percentage of Trees Entirely Healthy";
}
