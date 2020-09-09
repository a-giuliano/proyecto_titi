$(document).ready(function() {
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
	    all[i].style.width = "170px"; 
	}

	/* Update Words */ 
	document.getElementById("tv").innerHTML = "Visita de Table";
	document.getElementById("mv").innerHTML = "Visita de Mapa";
	document.getElementById("sv").innerHTML = "Vistas de Resumen";
	document.getElementById("svc").innerHTML = "Resumen de la Comunidad";
	document.getElementById("svt").innerHTML = "Resumen del Árbol";
	document.getElementById("logout").innerHTML = "Cierre de Sesion";

	translate();	
   }
    else {
	/* Adjust NavBar Spacing */
	var all = document.getElementsByClassName('nav-item');
        for (var i = 0; i < all.length; i++) {
            all[i].style.width = "180px";
        }

	/* Update Words */ 
        document.getElementById("tv").innerHTML = "Table View";
	document.getElementById("mv").innerHTML = "Map View";
	document.getElementById("sv").innerHTML = "Summary Views";
	document.getElementById("svc").innerHTML = "Community Summary";
        document.getElementById("svt").innerHTML = "Tree Summary";
	document.getElementById("logout").innerHTML = "Logout";

	detranslate();
    }
}
