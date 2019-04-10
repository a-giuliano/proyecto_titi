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
        <h1>Details</h1>
        <p>Click the cells on the right to get specifics for each visit</p>
    </div>
    <table id="visits-table" >
    `;
    for(var visit in d.visits){
        // get all animal data
        var animalData = JSON.stringify(d.visits[visit]['animals']);
        animalData = animalData.replace(/"/g, "'");

        // get all conservation data
        var conservationData = JSON.stringify(d.visits[visit]['conservation']);
        conservationData = conservationData.replace(/"/g, "'");

        html += 
        `<tr>
            <td>${visit}:</td>
            <td class="click-cell" onclick="showDetails(${animalData}, 'animal');">Animals: ${d.visits[visit]['animals']['compliant']}</td>
            <td class="click-cell" onclick="showDetails(${conservationData}, 'conservation');">Conservation: ${d.visits[visit]['conservation']['compliant']}</td>
            <td>Recycling: ${d.visits[visit]['recycle']['compliant']}</td>
            <td>Structures: ${d.visits[visit]['structures']['compliant']}</td>
        </tr>`
    }
    html += '</table>';
    return html;
}

function showDetails(data, type){
    var html = `<h1>Details</h1>`;
    if(type == 'animal'){
        html += `<h2>Domestic:</h2><ul>`
        for(var animal in data['domestic']){
            html += `
                <li><b>Name</b>: ${data['domestic'][animal]['name']}, <b>Type</b>: ${data['domestic'][animal]['type']}</li>
            `;
        }
        html += `</ul>`;
        html += `<h2>Wild:</h2><ul>`
        for(var animal in data['wild']){
            html += `
                <li><b>Name</b>: ${data['wild'][animal]['name']}, <b>Type</b>: ${data['wild'][animal]['type']}</li>
            `;
        }
        html += `</ul>`;
    }
    else if(type == 'conservation'){
        html += `<h3>Area: ${data['area']}</h3>`;
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



