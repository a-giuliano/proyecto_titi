$(document).ready(function() {
    
//    localStorage.setItem("spanLang", "true");
    update();
});

function change() {
    var lang = localStorage.getItem("spanLang");
    if (lang == "true") {
	localStorage.setItem("spanLang", "false");
    }
    else {
	localStorage.setItem("spanLang", "true");
    }

    update();
}

function update() {

    var lang = localStorage.getItem("spanLang");

    if(lang == "true"){
	/* Adjust NavBar Spacing */
	var all = document.getElementsByClassName('nav-item');
	for (var i = 0; i < all.length; i++) {
	    all[i].style.width = "180px"; 
	}
	
	/* Update Words */
	document.getElementById("language").innerHTML = "English";
        document.getElementById("tv").innerHTML = "Visita de Table";
	document.getElementById("mv").innerHTML = "Visita de Mapa";
        document.getElementById("sv").innerHTML = "Vista de Resumen";
        document.getElementById("logout").innerHTML = "Cierre de Sesion";
	document.getElementById("csv-link").innerHTML = "Descargar tabla como csv";
        document.getElementById("num").innerHTML = "Numero";
        document.getElementById("famName").innerHTML = "Llamo de Familia";
        document.getElementById("com").innerHTML = "Comunidad";
        document.getElementById("visit").innerHTML = "Ultima Visita";
        document.getElementById("totComp").innerHTML = "Cumplimiento Total";
        document.getElementById("animal").innerHTML = "Animales";
        document.getElementById("cons").innerHTML = "Conservacion";
        document.getElementById("rec").innerHTML = "Reciclaje";
        document.getElementById("struct").innerHTML = "Estructuras";
    }
/*    else {
	/* Adjust NavBar Spacing
	var all = document.getElementsByClassName('nav-item');
        for (var i = 0; i < all.length; i++) {
            all[i].style.width = "160px";
        }

	/* Update Words 
	document.getElementById("language").innerHTML = "Espanol";
        document.getElementById("tv").innerHTML = "Table View";
	document.getElementById("mv").innerHTML = "Map View";
	document.getElementById("sv").innerHTML = "Summary View";
	document.getElementById("logout").innerHTML = "Logout";
	document.getElementById("csv-link").innerHTML = "Download table as csv";
	document.getElementById("num").innerHTML = "Number";
	document.getElementById("famName").innerHTML = "Family Name";
	document.getElementById("com").innerHTML = "Community";
	document.getElementById("visit").innerHTML = "Last Visit";
	document.getElementById("totComp").innerHTML = "Total Compliance";
	document.getElementById("animal").innerHTML = "Animals";
	document.getElementById("cons").innerHTML = "Conservation";
	document.getElementById("rec").innerHTML = "Recycling";
	document.getElementById("struct").innerHTML = "Structures";
    }*/
}
