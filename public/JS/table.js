"use strict";

var ref = database.ref("families");

window.onload = function main(){
    var promise = ref.once('value').then(generateData);
    var promise2 = promise.then(constructTable)
    promise2.then(assignFunctionality);
}

var imgPrefix = '<img height="20px" width="20px" style="display:block; margin-left:auto; margin-right:auto;" src="img/';

function generateData(data){
    var families = data.val();
    var keys = Object.keys(families);

    var data = [];
    var csvData = [];

    var empties = [];
    var empty = false;

    for(var i = 0; i < keys.length; i++){
        var family = families[keys[i]];

        // family ID
	var familyID = family.id;
        if (familyID == null || familyID == undefined){
		continue;
	}

        // get most recent visit
        var visits = family.visits;
        var targetVisit = visits[Object.keys(visits)[Object.keys(visits).length - 1]];

	// basic data
        var familyName = targetVisit.basicData.name;
        var community = titleCase(removeAccents(targetVisit.basicData.community));
      
	if (familyName == "") {
		empty = true;
	}
 
        // determine date of most recent visit
        var day = parseInt(targetVisit.date.day);
        var monthNumbers = {
            "enero"     : 1,
            "feb"       : 2,
            "marzo"     : 3,
            "abr"       : 4,
            "mayo"      : 5,
            "jun"       : 6,
            "jul"       : 7,
            "agosto"    : 8,
            "sept"      : 9,
            "set"       : 9,
            "oct"       : 10,
            "nov"       : 11,
            "dic"       : 12
        };
        var month = monthNumbers[targetVisit.date.month];
        var year = parseInt(targetVisit.date.year);
        var date = String(year) + "/" + String(month) + "/" +String(day);

        // determine compliance of each factor
        if ("animals" in targetVisit && "compliant" in targetVisit.animals){
	    var animals = targetVisit.animals.compliant;
        }
        else{
            var animals = "--";
        }

        if ("conservation" in targetVisit && "compliant" in targetVisit.conservation){
            var conservation = targetVisit.conservation.compliant;
        }
        else{
            var conservation = "--";
        }

        if ("recycle" in targetVisit && "compliant" in targetVisit.recycle){
            var recycle = targetVisit.recycle.compliant;
        }
        else{
            var recycle = "--";
        }

        if ("structures" in targetVisit && "compliant" in targetVisit.structures){
            var structures = targetVisit.structures.compliant;
        }
        else{
            var structures = "--";
        }

        var totalCompliance = animals && conservation && recycle && structures;

        var entry = {
            // values from visit
            "familyID"          : familyID,
            "familyName"        : familyName,
            "community"         : community,
            "lastVisitDate"     : date,
            "totalCompliance"   : totalCompliance,
            "animals"           : animals,
            "conservation"      : conservation,
            "recycle"           : recycle,
            "structures"        : structures,
            "visits"            : visits
        };

        var csvEntry = {
            "Family ID"         : familyID,
            "Family Name"       : familyName,
            "Community"         : community,
            "Last Visit Date"   : date,
            "Total Compliance"  : totalCompliance,
            "Animals"           : animals,
            "Conservation"      : conservation,
            "Recycle"           : recycle,
            "Structures"        : structures,
        }

	if (empty) {
            empties.push([entry, csvEntry]);
	}
	else {
            data.push(entry);
            csvData.push(csvEntry);
        }

        empty = false;
    }

    for (var i = 0; i < empties.length; i++) {
        data.push(empties[i][0]);
        csvData.push(empties[i][1]);
    }

    // load data into csv file link
    var csvLink = document.querySelector('#csv-link');
    var csvFile = new Blob([Papa.unparse(csvData)], {type: 'text'});
    csvLink.href = URL.createObjectURL(csvFile);
    csvLink.download = 'PTDataTable.csv';

    return data;
}

function constructTable(data){
    var table;
    if(localStorage.getItem("spanLang") == "true"){
    table = $('#myTable').DataTable({
	data: data,
	"language": {
        "sProcessing":    "Procesando...",
        "sLengthMenu":    "Mostrar _MENU_ registros",
        "sZeroRecords":   "No se encontraron resultados",
        "sEmptyTable":    "Ningún dato disponible en esta tabla",
        "sInfo":          "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
        "sInfoEmpty":     "Mostrando registros del 0 al 0 de un total de 0 registros",
        "sInfoFiltered":  "(filtrado de un total de _MAX_ registros)",
        "sInfoPostFix":   "",
        "sSearch":        "Buscar:",
        "sUrl":           "",
        "sInfoThousands":  ",",
        "sLoadingRecords": "Cargando...",
        "oPaginate": {
            "sFirst":    "Primero",
            "sLast":    "Último",
            "sNext":    "Siguiente",
            "sPrevious": "Anterior"
        },
        "oAria": {
            "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
            "sSortDescending": ": Activar para ordenar la columna de manera descendente"
        }
    },
      columns: [
          {
              "className":      'details-control',
              "orderable":      false,
              "defaultContent": ''
          },
          { data: 'familyID' },
          { data: 'familyName' },
          { data: 'community' },
          { data: 'lastVisitDate' },
          
	  { data: 'totalCompliance',
            render: function  ( check ) {
		return ( (check == "--") ? imgPrefix+'dash.png"/>' : (check ? imgPrefix+'check.png"/>' : imgPrefix+'false.png"/>') );
	    },
	  },
	  { data: 'animals',
	    render: function  ( check ) {
		return ( (check == "--") ? imgPrefix+'dash.png"/>' : (check ? imgPrefix+'check.png"/>' : imgPrefix+'false.png"/>') );
	    },  
	  },
          { data: 'conservation',
	    render: function  ( check ) {
		return ( (check == "--") ? imgPrefix+'dash.png"/>' : (check ? imgPrefix+'check.png"/>' : imgPrefix+'false.png"/>') );
	    },
	  },
          { data: 'recycle',
	    render: function  ( check ) {
		return ( (check == "--") ? imgPrefix+'dash.png"/>' : (check ? imgPrefix+'check.png"/>' : imgPrefix+'false.png"/>') );
	    },
          },
          { data: 'structures',
	    render: function  ( check ) {
		return ( (check == "--") ? imgPrefix+'dash.png"/>' : (check ? imgPrefix+'check.png"/>' : imgPrefix+'false.png"/>') );
	    },
	  }
      ]
    });}
    else{
	table = $('#myTable').DataTable({
        data: data,
	columns: [
          {
              "className":      'details-control',
              "orderable":      false,
              "defaultContent": ''
          },
          { data: 'familyID' },
          { data: 'familyName' },
          { data: 'community' },
          { data: 'lastVisitDate' },

          { data: 'totalCompliance',
            render: function  ( check ) {
                return ( (check == "--") ? imgPrefix+'dash.png"/>' : (check ? imgPrefix+'check.png"/>' : imgPrefix+'false.png"/>') );
            },
          },
          { data: 'animals',
            render: function  ( check ) {
                return ( (check == "--") ? imgPrefix+'dash.png"/>' : (check ? imgPrefix+'check.png"/>' : imgPrefix+'false.png"/>') );
            },
          },
          { data: 'conservation',
            render: function  ( check ) {
                return ( (check == "--") ? imgPrefix+'dash.png"/>' : (check ? imgPrefix+'check.png"/>' : imgPrefix+'false.png"/>') );
            },
          },
          { data: 'recycle',
            render: function  ( check ) {
                return ( (check == "--") ? imgPrefix+'dash.png"/>' : (check ? imgPrefix+'check.png"/>' : imgPrefix+'false.png"/>') );
            },
          },
          { data: 'structures',
            render: function  ( check ) {
                return ( (check == "--") ? imgPrefix+'dash.png"/>' : (check ? imgPrefix+'check.png"/>' : imgPrefix+'false.png"/>') );
            },
          }
      ]
    });}	
  
    return table;
  
  }

function assignFunctionality(table){
    $('#myTable tbody').on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = table.row( tr );
    
        if ( row.child.isShown() ) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            // Open this row
            row.child( format(row.data()) ).show();
            tr.addClass('shown');
        }
    } );
}

function format ( d ) {
    var lang = localStorage.getItem("spanLang");
    var html;
    html = (lang != "true") ? `
    <div id="details">
        <h1 id="details-header">Details</h1>
        <p>Click the cells on the right to get specifics for each visit</p>
    </div>
    <table id="visits-table" >
        <tr>
            <th class="category"></th>
            <th class="category" id="animal">Animals</th>
            <th class="category" id="cons">Conservation</th>
            <th class="category">Recycling</th>
            <th class="category">Structures</th>
        </tr>
    ` :
    `<div id="details">
        <h1 id="details-header">Detalles</h1>
        <p>Haga clic en las celdas a la derecha para obtener información específica para cada visita.</p>
    </div>
    <table id="visits-table" >
        <tr>
            <th class="category"></th>
            <th class="category" id="animal">Animales</th>
            <th class="category" id="cons">Conservacion</th>
            <th class="category">Reciclaje</th>
            <th class="category">Estructuras</th>
        </tr>
    `;
    for(var visit in d.visits){
        // get all animal data
        var animalData = JSON.stringify(d.visits[visit]['animals']);
        animalData = animalData.replace(/"/g, "'");

        // get all conservation data
        var conservationData = JSON.stringify(d.visits[visit]['conservation']);
        conservationData = conservationData.replace(/"/g, "'");

        // get all recycle data
        var recycleData = JSON.stringify(d.visits[visit]['recycle']);
        recycleData = recycleData.replace(/"/g, "'");

        // get all structures data
        var structuresData = JSON.stringify(d.visits[visit]['structures']);
        structuresData = structuresData.replace(/"/g, "'");

        var formattedVisit = 'V' + visit.slice(1, 5) + ' ' + visit.slice(5);

        html += 
        `<tr>
            <td class="visit-number">${formattedVisit}:</td>
            <td class="click-cell" onclick="showDetails(this, ${animalData}, 'animal');">${d.visits[visit]['animals']['compliant']}</td>
            <td class="click-cell" onclick="showDetails(this, ${conservationData}, 'conservation');">${d.visits[visit]['conservation']['compliant']}</td>
            <td class="click-cell" onclick="showDetails(this, ${recycleData}, 'recycle');">${d.visits[visit]['recycle']['compliant']}</td>
            <td class="click-cell" onclick="showDetails(this, ${structuresData}, 'structures');">${d.visits[visit]['structures']['compliant']}</td>
        </tr>`
    }
    html += '</table>';
    return html;
}

function showDetails(cell, data, type){
    var lang = localStorage.getItem("spanLang");

    var html = (lang != "true") ? `<h1 id="details-header">Details</h1>` : `<h1 id="details-header">Detalles</h1>`;
    if(document.getElementsByClassName('clicked')[0]) document.getElementsByClassName('clicked')[0].className = "click-cell";
    cell.className = 'clicked';
    if(type == 'animal'){
        html += (lang != "true") ? `<h2>Domestic:</h2><ul>` : `<h2>Doméstico:</h2><ul>`;
        for(var animal in data['domestic']){
            html += (lang != "true") ?  `
                <li>
                    <b>Type</b>: ${data['domestic'][animal]['type']},
                    <b>Count</b>: ${data['domestic'][animal]['amount']},
                    <b>Compliant</b>: ${data['domestic'][animal]['compliant']}
                </li>
            ` :
	    `
                <li>
                    <b>Tipo</b>: ${data['domestic'][animal]['type']},
                    <b>Cantidad</b>: ${data['domestic'][animal]['amount']},
                    <b>Complaciente</b>: ${data['domestic'][animal]['compliant']}
                </li>
            `;
        }
        html += `</ul>`;
        html += (lang != "true") ? `<h2>Wild:</h2><ul>` : `<h2>Silvestres:</h2><ul>`;
        for(var animal in data['wild']){
            html += (lang != "true") ? `
                <li>
                    <b>Classification</b>: ${data['wild'][animal]['classification']}, 
                    <b>Type</b>: ${data['wild'][animal]['type']},
                    <b>Function</b>: ${data['wild'][animal]['function']},
                    <b>Origin</b>: ${data['wild'][animal]['origin']},
                    <b>Marking</b>: ${data['wild'][animal]['marking']},
                    <b>Compliant</b>: ${data['wild'][animal]['compliant']}
                </li>
            ` :
	    `
                <li>
                    <b>Classificacion</b>: ${data['wild'][animal]['classification']},
                    <b>Tipo</b>: ${data['wild'][animal]['type']},
                    <b>Funcion</b>: ${data['wild'][animal]['function']},
                    <b>Origen</b>: ${data['wild'][animal]['origin']},
                    <b>Calificación</b>: ${data['wild'][animal]['marking']},
                    <b>Complaciente</b>: ${data['wild'][animal]['compliant']}
                </li>
            `
	    ;
        }
        html += `</ul>`;
    }
    else if(type == 'conservation'){
        html += (lang!= "true") ? `<p><b>Acres: </b>${data['area']}</p>` : `<p><b>Hectareas: </b>${data['area']}</p>`;
    }
    else if(type == 'recycle'){
        html += (lang!= "true") ? `
            <p><b>Recycle delivery:</b> ${data['recycle_deliver']}</p>
            <p><b>Does recycle:</b> ${data['doRecycle']}</p>
        ` :
	`
            <p><b>Entrega de Reciclaje:</b> ${data['recycle_deliver']}</p>
            <p><b>Hace Reciclar:</b> ${data['doRecycle']}</p>
        `
	;
    }
    else if(type == 'structures'){
        for(var structure in data['construction']){
            html += (lang != "true") ? `
                <li>
                    <b>Name</b>: ${data['construction'][structure]['name']},
                    <b>Size</b>: ${data['construction'][structure]['size']},
                    <b>Type</b>: ${data['construction'][structure]['type']},
                    <b>Function</b>: ${data['construction'][structure]['function']},
                    <b>Condition</b>: ${data['construction'][structure]['condition']},
                    <b>Compliant</b>: ${data['construction'][structure]['compliant']}
                </li>
            ` :
	    `
                <li>
                    <b>Nombre</b>: ${data['construction'][structure]['name']},
                    <b>Talla</b>: ${data['construction'][structure]['size']},
                    <b>Tipo</b>: ${data['construction'][structure]['type']},
                    <b>Funcion</b>: ${data['construction'][structure]['function']},
                    <b>Condicion</b>: ${data['construction'][structure]['condition']},
                    <b>Complaciente</b>: ${data['construction'][structure]['compliant']}
                </li>
            `;
        }
    }

    var detailsPane = document.querySelector('#details').innerHTML = html;
}

function getDateColor(snap){
  // dictionary structure of each of the visits 
  var visits = JSON.parse(JSON.stringify(snap.child("visits").val()));
  
  // determine most recent visit
  var nVisits = Object.keys(visits).length;
  var mostRecent = "visit" + String(nVisits);
  var targetVisit = visits[mostRecent];
  
  var day = parseInt(targetVisit.date.day);
  var monthNumbers = {
      "enero"     : 1,
      "feb"       : 2,
      "marzo"     : 3,
      "abr"       : 4,
      "mayo"      : 5,
      "jun"       : 6,
      "jul"       : 7,
      "agosto"    : 8,
      "sept"      : 9,
      "set"       : 9,
      "oct"       : 10,
      "nov"       : 11,
      "dic"       : 12
  };
  var month = monthNumbers[targetVisit.date.month];
  var year = parseInt(targetVisit.date.year);
  
  var currentDate = new Date();
  var visitDate = new Date(year, month-1, day);
  var timeDelay = parseInt((currentDate - visitDate)*0.000000015741); // time btwn visits in days
  
  if (timeDelay <= 30){
      return "Green";
  }
  else if( timeDelay <= 90){
      return "Yellow";
  }
  else{
      return "Red";
  }
  
}
