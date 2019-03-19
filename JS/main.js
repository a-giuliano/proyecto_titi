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
            "test"              : 123
        };

        data.push(entry);

    }

    return data;
}

function constructTable(data){
    var table;
    console.log(data);
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
    // `d` is the original data object for the row
    return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
        '<tr>'+
            '<td>Test:</td>'+
            '<td>'+d.test+'</td>'+
        '</tr>'+
    '</table>';
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



