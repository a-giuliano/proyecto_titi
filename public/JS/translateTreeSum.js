function translate() {
    var selectedCompareVisit = parseInt(document.getElementById("compareVisitSelectId").value);
    document.getElementById("language").innerHTML = "English";

    document.getElementById("csv-link").innerHTML = "Descargar datos como csv";
    document.getElementById("resetButton").innerHTML = "Reiniciar";
    if (document.getElementById("healthGraphHeader") != null) {
        document.getElementById("healthGraphHeader").innerHTML = "Problemas de Salud";
    }
    if (document.getElementById("deathGraphHeader") != null) {
        document.getElementById("deathGraphHeader").innerHTML = "Razones de Muerte";
    }

    if (selectedCompareVisit == 0){
        document.getElementById("NTCLabel").innerHTML = "# Arboles Rastreados";
        document.getElementById("NDCLabel").innerHTML = "# Muertos";
        document.getElementById("NHCLabel").innerHTML = "# Saludables";
        document.getElementById("NUCLabel").innerHTML = "# Insaludables";
    }
    else {
        document.getElementById("NTCLabel").innerHTML = "<span style=\"color:blue\">(Cambio en) # Arboles Rastreados</span>";
        document.getElementById("NDCLabel").innerHTML = "<span style=\"color:blue\">(Cambio en) # Muertos</span>";
        document.getElementById("NHCLabel").innerHTML = "<span style=\"color:blue\">(Cambio en) # Saludables</span>";
        document.getElementById("NUCLabel").innerHTML = "<span style=\"color:blue\">(Cambio en) # Insaludables</span>";
        document.getElementById("ACHLabel").innerHTML = "<span style=\"color:blue\">(Cambio en) la Altura Media (m)</span>";
        document.getElementById("ACDLabel").innerHTML = "<span style=\"color:blue\">(Cambio en) la Dap Media (cm)</span>";
    }

    document.getElementById("visitNumText").innerHTML = "Número de Visita: ";
    if(document.getElementById("incompleteVisitData") != null){
        document.getElementById("incompleteVisitData").innerHTML = "Datos de Visita Incompletos";
    }
    if (document.getElementById("mostRecentOption") != null) {
        document.getElementById("mostRecentOption").innerHTML = "Más Reciente";
    }
    document.getElementById("regionText").innerHTML = "Región: ";
    document.getElementById("allOption").innerHTML = "Todas";
    document.getElementById("reserve").innerHTML = "Reserva";
    document.getElementById("corridors").innerHTML = "Corredores";
    document.getElementById("compareVisitText").innerHTML = "Comparar con Visita: ";
    if (document.getElementById("noneOption") != null) {
        document.getElementById("noneOption").innerHTML = "Nada";
    }
    if (document.getElementById("previousOption") != null) {
        document.getElementById("previousOption").innerHTML = "Anterior";
    }
    if (document.getElementById("growthRatesGraphHeader") != null) {
        document.getElementById("growthRatesGraphHeader").innerHTML = "Promedio de Cambio Porcentual en la Altura Entre Visitas por Especie";
    }
}

function detranslate() {
    var selectedCompareVisit = $("select.compareVisitSelect").find('option').filter(':selected').val();
    document.getElementById("language").innerHTML = "Espanol";

    document.getElementById("csv-link").innerHTML = "Download data as csv";
    document.getElementById("resetButton").innerHTML = "Reset";
    if (document.getElementById("deathGraphHeader") != null) {
        document.getElementById("deathGraphHeader").innerHTML = "Reasons for Death";
    }
    if (document.getElementById("healthGraphHeader") != null) {
        document.getElementById("healthGraphHeader").innerHTML = "Health Issues";
    }

    if (selectedCompareVisit == 0){
        document.getElementById("NTCLabel").innerHTML = "# Tracked Trees";
        document.getElementById("NDCLabel").innerHTML = "# Dead";
        document.getElementById("NHCLabel").innerHTML = "# Healthy";
        document.getElementById("NUCLabel").innerHTML = "# Unhealthy";
    }
    else {
        document.getElementById("NTCLabel").innerHTML = "<span style=\"color:blue\">(Change in) # Tracked Trees</span>";
        document.getElementById("NDCLabel").innerHTML = "<span style=\"color:blue\">(Change in) # Dead</span>";
        document.getElementById("NHCLabel").innerHTML = "<span style=\"color:blue\">(Change in) # Healthy</span>";
        document.getElementById("NUCLabel").innerHTML = "<span style=\"color:blue\">(Change in) # Unhealthy</span>";
        document.getElementById("ACHLabel").innerHTML = "<span style=\"color:blue\">(Change in) Average Height (m)</span>";
        document.getElementById("ACDLabel").innerHTML = "<span style=\"color:blue\">(Change in) Average Dap (cm)</span>";
    }

    document.getElementById("visitNumText").innerHTML = "Visit Number: ";
    if(document.getElementById("incompleteVisitData") != null){
        document.getElementById("incompleteVisitData").innerHTML = "Incomplete Visit Data";
    }
    if (document.getElementById("mostRecentOption") != null) {
        document.getElementById("mostRecentOption").innerHTML = "Most Recent";
    }
    document.getElementById("regionText").innerHTML = "Region: ";
    document.getElementById("allOption").innerHTML = "All";
    document.getElementById("reserve").innerHTML = "Reserve";
    document.getElementById("corridors").innerHTML = "Corridors";
    document.getElementById("compareVisitText").innerHTML = "Compare to Visit: ";
    if (document.getElementById("noneOption") != null) {
        document.getElementById("noneOption").innerHTML = "None";
    }
    if (document.getElementById("previousOption") != null) {
        document.getElementById("previousOption").innerHTML = "Previous";
    }

    if (document.getElementById("growthRatesGraphHeader") != null) {
        document.getElementById("growthRatesGraphHeader").innerHTML = "Average Percentage Change in Height Between Visits by Species";
    }
}
