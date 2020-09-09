function translate() {
    document.getElementById("language").innerHTML = "English";
    document.getElementById("commGraphHeader").innerHTML = "Cantidad de Árboles con Cada Problema de Salud";
    document.getElementById("NTCLabel").innerHTML = "Cantidad de Árboles de Valor Rastreados";
    document.getElementById("PDCLabel").innerHTML = "Porcentaje de Árboles que están Muertos";
    document.getElementById("PHCLabel").innerHTML = "Porcentaje de Árboles que son Completamente Saludables";
    document.getElementById("PUCLabel").innerHTML = "Porcentaje de Árboles que son Insaludables";
}

function detranslate() {
    document.getElementById("language").innerHTML = "Espanol";
    document.getElementById("commGraphHeader").innerHTML = "Number of Trees with Each Health Issue";
    document.getElementById("NTCLabel").innerHTML = "Number of Tracked Trees of Value";
    document.getElementById("PDCLabel").innerHTML = "Percentage of Trees that are Dead";
    document.getElementById("PHCLabel").innerHTML = "Percentage of Trees that are Entirely Healthy";
    document.getElementById("PUCLabel").innerHTML = "Percentage of Trees that are Unhealthy";
}
