"use strict";

var ref = database.ref("families");

window.onload = function main(){
    var promise = ref.once('value').then(generateData);
    var promise2 = promise.then(constructTable)
    promise2.then(assignFunctionality);
}

function generateData(data){
    var families = data.val();
    var keys = Object.keys(families);

    var data = [];
    var csvData = [];

    for(var i = 0; i < keys.length; i++){
        var family = families[keys[i]];
        
        // family ID
        var familyID = family.id;

        // get most recent visit
        var visits = family.visits;
        var targetVisit = visits[Object.keys(visits)[Object.keys(visits).length - 1]];

        // basic data
        var familyName = targetVisit.basicData.name;
        var community = targetVisit.basicData.community;
        
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
            var animals = "none";
        }

        if ("conservation" in targetVisit && "compliant" in targetVisit.conservation){
            var conservation = targetVisit.conservation.compliant;
        }
        else{
            var conservation = "none";
        }

        if ("recycle" in targetVisit && "compliant" in targetVisit.recycle){
            var recycle = targetVisit.recycle.compliant;
        }
        else{
            var recycle = "none";
        }

        if ("structures" in targetVisit && "compliant" in targetVisit.structures){
            var structures = targetVisit.structures.compliant;
        }
        else{
            var structures = "none";
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
            "Family ID"          : familyID,
            "Family Name"        : familyName,
            "Community"         : community,
            "Last Visit Date"     : date,
            "Total Compliance"   : totalCompliance,
            "Animals"           : animals,
            "Conservation"      : conservation,
            "Recycle"           : recycle,
            "Structures"        : structures,
        }

        data.push(entry);
        csvData.push(csvEntry);
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
    table = $('#myTable').DataTable({
      data: data,
      columns: [
          {
              "className":      'details-control',
              "orderable":      false,
              "data":           null,
              "defaultContent": ''
          },
          { data: 'familyID' },
          { data: 'familyName' },
          { data: 'community' },
          { data: 'lastVisitDate' },
          { data: 'totalCompliance' },
          { data: 'animals' },
          { data: 'conservation' },
          { data: 'recycle' },
          { data: 'structures' }
      ]
    });
  
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
    var html = `
    <div id="details">
        <h1 id="details-header">Details</h1>
        <p>Click the cells on the right to get specifics for each visit</p>
    </div>
    <table id="visits-table" >
        <tr>
            <th class="category"></th>
            <th class="category">Animals</th>
            <th class="category">Conservation</th>
            <th class="category">Recycling</th>
            <th class="category">Structures</th>
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
    var html = `<h1 id="details-header">Details</h1>`;
    if(document.getElementsByClassName('clicked')[0]) document.getElementsByClassName('clicked')[0].className = "click-cell";
    cell.className = 'clicked';
    if(type == 'animal'){
        html += `<h2>Domestic:</h2><ul>`
        for(var animal in data['domestic']){
            html += `
                <li>
                    <b>Type</b>: ${data['domestic'][animal]['type']},
                    <b>Count</b>: ${data['domestic'][animal]['amount']},
                    <b>Compliant</b>: ${data['domestic'][animal]['compliant']}
                </li>
            `;
        }
        html += `</ul>`;
        html += `<h2>Wild:</h2><ul>`
        for(var animal in data['wild']){
            html += `
                <li>
                    <b>Classification</b>: ${data['wild'][animal]['classification']}, 
                    <b>Type</b>: ${data['wild'][animal]['type']},
                    <b>Function</b>: ${data['wild'][animal]['function']},
                    <b>Origin</b>: ${data['wild'][animal]['origin']},
                    <b>Marking</b>: ${data['wild'][animal]['marking']},
                    <b>Compliant</b>: ${data['wild'][animal]['compliant']}
                </li>
            `;
        }
        html += `</ul>`;
    }
    else if(type == 'conservation'){
        html += `<p><b>Property hectares: </b>${data['area']}</p>`;
    }
    else if(type == 'recycle'){
        html += `
            <p><b>Recycle delivery:</b> ${data['recycle_deliver']}</p>
            <p><b>Does recycle:</b> ${data['doRecycle']}</p>
        `;
    }
    else if(type == 'structures'){
        for(var structure in data['construction']){
            html += `
                <li>
                    <b>Name</b>: ${data['construction'][structure]['name']},
                    <b>Size</b>: ${data['construction'][structure]['size']},
                    <b>Type</b>: ${data['construction'][structure]['type']},
                    <b>Function</b>: ${data['construction'][structure]['function']},
                    <b>Condition</b>: ${data['construction'][structure]['condition']},
                    <b>Comlpiant</b>: ${data['construction'][structure]['compliant']}
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



