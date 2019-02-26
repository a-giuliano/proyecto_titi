"use strict";

var rootRef = firebase.database().ref().child("families");

// initialize data table
var table;
$(document).ready( function () {
    table = $('#myTable').DataTable();
} );

window.onload = function main(){

  // loop through each family
  rootRef.on('child_added', snap =>{

    var entry = constructEntry(snap);
    addRow(entry);
  });  

}

function constructEntry(snap){
    
    //dictionary structure of each of the visits 
    var visits = JSON.parse(JSON.stringify(snap.child("visits").val()));

    //determine most recent visit
    var nVisits = Object.keys(visits).length;
    var mostRecent = "visit" + String(nVisits);

    var targetVisit = visits[mostRecent];
    // determine family ID
    var familyId = snap.child("id").val();

    // determine date of most recent visit
    var day = parseInt(targetVisit.date.day);
    var familyName = targetVisit.basicData.name;
    var community = targetVisit.basicData.community;

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
    var lastVisitDate = String(year) + "/" + String(month) + "/" +String(day) ;

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
        "familyId"          : familyId,
        "familyName"        : familyName,
        "community"         : community,
        "day"               : day,
        "month"             : month,
        "year"              : year,
        "lastVisitDate"     : lastVisitDate,
        "totalCompliance"   : totalCompliance,
        "animals"           : animals,
        "conservation"      : conservation,
        "recycle"           : recycle,
        "structures"        : structures,
    };

    return entry;

}
// List Style     
function addRow(entry){
  var row =[];
  row.push("jsdhgf");
  row.push(entry.familyId);
  row.push(entry.familyName);
  row.push(entry.community);
  row.push(entry.lastVisitDate);
  row.push(entry.totalCompliance);
  row.push(entry.animals);
  row.push(entry.conservation);
  row.push(entry.recycle);
  row.push(entry.structures);

  table.row.add(row).draw(false);
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



