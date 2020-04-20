function translate() {
    document.getElementById("language").innerHTML = "English";
    document.getElementById("commGraphHeader").innerHTML = "Cantidad de Familias en Cada Communidad";
    document.getElementById("NFCLabel").innerHTML = "Cantidad de Familias que Viven en Cumplimento";
    document.getElementById("CPCLabel").innerHTML = "Porentaje de Familias que Viven en Cumplimento";
    document.getElementById("NTVLabel").innerHTML = "Numero Total de Visitas Realizadas";
    document.getElementById("NTCLabel").innerHTML = "Numero Total de Communidades";
}

function detranslate() {
     document.getElementById("language").innerHTML = "Espanol";
    document.getElementById("commGraphHeader").innerHTML = "Number of Families in Each Community";
    document.getElementById("NFCLabel").innerHTML = "Number of Families Living in Compliance";
    document.getElementById("CPCLabel").innerHTML = "Percentage of Families Living in Compliance";
    document.getElementById("NTVLabel").innerHTML = "Total Number of Visits Conducted";
    document.getElementById("NTCLabel").innerHTML = "Total Number of Communities";
}
