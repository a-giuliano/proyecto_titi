function translate() {
    document.getElementById("language").innerHTML = "English";
    document.getElementById("commGraphHeader").innerHTML = "Cantidad de Árboles con Cada Problema de Salud";
    document.getElementById("NTCLabel").innerHTML = "Número de Árboles de Valor Rastreados";
    document.getElementById("NDCLabel").innerHTML = "Número de Árboles que están Muertos";
    document.getElementById("NHCLabel").innerHTML = "Número de Árboles que son Completamente Saludables";
    document.getElementById("NUCLabel").innerHTML = "Número de Árboles que son Insaludables";
    document.getElementById("visitNumText").innerHTML = "Número de Visita: ";
    if(document.getElementById("incompleteVisitData").innerHTML != ""){
        document.getElementById("incompleteVisitData").innerHTML = "Datos de Visita Incompletos";
    }
    document.getElementById("mostRecentOption").innerHTML = "Más Reciente";
}

function detranslate() {
    document.getElementById("language").innerHTML = "Espanol";
    document.getElementById("commGraphHeader").innerHTML = "Number of Trees with Each Health Issue";
    document.getElementById("NTCLabel").innerHTML = "Number of Tracked Trees of Value";
    document.getElementById("NDCLabel").innerHTML = "Number of Trees that are Dead";
    document.getElementById("NHCLabel").innerHTML = "Number of Trees that are Entirely Healthy";
    document.getElementById("NUCLabel").innerHTML = "Number of Trees that are Unhealthy";
    document.getElementById("visitNumText").innerHTML = "Visit Number: ";
    if(document.getElementById("incompleteVisitData").innerHTML != ""){
        document.getElementById("incompleteVisitData").innerHTML = "Incomplete Visit Data";
    }
    document.getElementById("mostRecentOption").innerHTML = "Most Recent";
}
