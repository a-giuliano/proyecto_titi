function translate() {
    document.getElementById("language").innerHTML = "English";
    document.getElementById("commGraphHeader").innerHTML = "Cantidad de Familias en Cada Communidad";
    document.getElementById("NFCLabel").innerHTML = "# Familias que Viven en Cumplimento";
    document.getElementById("NTVLabel").innerHTML = "# Visitas Realizadas";
    document.getElementById("NTCLabel").innerHTML = "# Communidades";
}

function detranslate() {
     document.getElementById("language").innerHTML = "Espanol";
    document.getElementById("commGraphHeader").innerHTML = "Number of Families in Each Community";
    document.getElementById("NFCLabel").innerHTML = "# Families Living in Compliance";
    document.getElementById("NTVLabel").innerHTML = "# Visits Conducted";
    document.getElementById("NTCLabel").innerHTML = "# Communities";
}
