"use strict";

// root of firebase data
var rootRef = firebase.database().ref().child("families");

// main map
var map;

// currently active color selector
var active = 'Last Visit';

window.onload = main;

function main(){
    
    initMap();
    
    rootRef.on('child_added', snap =>{
        // gps coords
        var gps_coords = getCoords(snap);
        
        //determine active selector
        if (active == 'Last Visit'){
            var color_url = getDateColor(snap);
        }
        else if(active == 'Compliance'){
            var color_url = getComplianceColor(snap);
        }
        
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
        return "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
    }
    else if( timeDelay <= 90){
        return "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
    }
    else{
        return "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
    }
    
}

function getComplianceColor(snap){
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
    
    if (totalCompliance){
        return "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
    }
    else{
        return "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
    }
    
}

//update map according to color selector
function setActive(selector){
    active = selector;
    document.getElementById("description").innerHTML = "Map colored according to: " + active;
    main();
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
  
  
  var contentString = '<div class="infoWindow">'+
                      '<h1>' + name + '</h1>'+
                      '<h2> Community: ' + community + '</h2>'+
                      '<h2> ID: ' + familyId + '</h2>'+
                      '</div>'
  
  return contentString;
  
  
}
