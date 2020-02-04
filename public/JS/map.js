"use strict";

// root of firebase data
var rootRef = database.ref().child("families");

// main map
var map;

var lang;

window.onload = main;

function main(){
    
    lang = localStorage.getItem("spanLang");
    initMap();
    
    rootRef.on('child_added', snap =>{
        // gps coords
        var gps_coords = getCoords(snap);
        
        //determine active selector
        var color_url = getMarker(snap);
        
        // add markers
        if(gps_coords){
          var contentString = getContent(snap);
          
          var infowindow = new google.maps.InfoWindow({
            content: contentString
          });
            
          var marker = new google.maps.Marker({
            position: gps_coords,
            icon: {
              url: color_url
            }
          });
          
          marker.addListener('click', function() {
            infowindow.open(map, marker);
          });
          
          marker.setMap(map);
        }    
    });
    
}

// instantiate map
function initMap() {
    // map properties
    var mapProp= {
        center: {lat: 9.4931728365217167, lng: -75.341516083275},
        zoom: 10,
    };

    // New map
    map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

}

function getCoords(snap){
    // dictionary structure of each of the visits 
    var visits = JSON.parse(JSON.stringify(snap.child("visits").val()));
    
    // determine most recent visit
    var nVisits = Object.keys(visits).length;
    var mostRecent = "visit" + String(nVisits);
    var targetVisit = visits[mostRecent];
    
    // get latitude and longitude
    var gps_coords = targetVisit.basicData.gps_coords;
    if (gps_coords){
        var latlng = gps_coords.split(",");
        var lat = latlng[0];
        var lng = latlng[1];
        var coords = {lat: parseFloat(lat), lng: parseFloat(lng)};
        return coords;
    }
    
    return "";
    
}

function getMarker(snap){
    if (getTimeDelay(snap) <= 30 && getComplianceDict(snap)["total"]){
        return "img/marker_circle_green.png";
    }
    else{
        return "img/marker_circle_red.png";
    }
}

function getComplianceDict(snap){
    // dictionary structure of each of the visits 
    var visits = JSON.parse(JSON.stringify(snap.child("visits").val()));
    
    // determine most recent visit
    var nVisits = Object.keys(visits).length;
    var mostRecent = "visit" + String(nVisits);
    var targetVisit = visits[mostRecent];
    
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

    var complianceDict;
    if(lang != "true") {
	complianceDict = {
	    "animals": animals,
	    "conservation": conservation,
	    "recycle": recycle,
	    "structures": structures,
	    "total": totalCompliance
	}
    }
    else {
	complianceDict = {
            "animales": animals,
            "conservacion": conservation,
            "reciclaje": recycle,
            "estructuras": structures,
            "total": totalCompliance
        }
    }
    
    return complianceDict;
    
}

function getTimeDelay(snap){
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
    var timeDelay = parseInt((currentDate - visitDate) / (1000 * 3600 * 24)); // time btwn visits in days
    return timeDelay;
}

function getContent(snap){

  // dictionary structure of each of the visits 
  var visits = JSON.parse(JSON.stringify(snap.child("visits").val()));
    
  // determine most recent visit
  var nVisits = Object.keys(visits).length;
  var mostRecent = "visit" + String(nVisits);
  var targetVisit = visits[mostRecent];
  
  var familyId = snap.child("id").val();
  var name = targetVisit.basicData.name;
  var community = targetVisit.basicData.community;

  var complianceDict = getComplianceDict(snap);

  var complianceString = '';
  if (complianceDict['total']){
      complianceString = (lang != "true") ? 'Compliant' : 'Complaciente';
  }
  else{
      complianceString = (lang != "true") ? 'Compliant' : 'No Complaciente: ';
      for(var key in complianceDict){
          if(key == 'total'){
              continue;
          }
          else if(complianceDict[key] == false){
              complianceString += ' ' + key;
          }
      }
  }
  
  var contentString;
  if (lang != "true") {
    contentString = '<div class="infoWindow">'+
                      '<h1>' + name + '</h1>'+
                      '<h2> Visited <b>' + getTimeDelay(snap) + '</b> days ago</h2>'+
                      '<h2>' + complianceString + '</h2>'+
                      '</div>';
  }
  else {
    contentString = '<div class="infoWindow">'+
                      '<h1>' + name + '</h1>'+
                      '<h2> Visitado hace <b>' + getTimeDelay(snap) + '</b> dias</h2>'+
                      '<h2>' + complianceString + '</h2>'+
                      '</div>';
  }
  return contentString;
  
}

