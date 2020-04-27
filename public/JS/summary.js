"use strict";

var ref = database.ref("families");
const nfamiliesCard = document.querySelector('#nfmailies-card');
const compliantPercentageCard = document.querySelector('#compliant-percentage-card');
const totalVisitsCard = document.querySelector('#total-visits-card');
const totalCommunities = document.querySelector('#ncommunities');

window.onload = function main(){

  if(sessionStorage.getItem("user") == null) {
    window.location.href = "https://proyectotiti-6da63.firebaseapp.com/index.html";
  }

  // get total number of families
  var families;
  var nfamilies = 0;
  var ncompliant = 0;
  var compliantPercentage = 0;
  var nTotalVisits = 0;
  var ncommunities = 0;
  var communities = {};

  ref.once('value', snap=>{
    families = snap.val();
    nfamilies = Object.keys(families).length;

    var keys = Object.keys(families);
    for(var i = 0; i < keys.length; i++){
      var family = families[keys[i]];

      var visits = family.visits;
      nTotalVisits += Object.keys(visits).length;

      var targetVisit = visits[Object.keys(visits)[Object.keys(visits).length - 1]];
   
      if (targetVisit == undefined || targetVisit == null){
	continue;
      }

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

      if(totalCompliance || totalCompliance == "none"){
        ncompliant++;
      }

      if ("basicData" in targetVisit && "community" in targetVisit.basicData && targetVisit.basicData.community != "") {
    	if(titleCase(removeAccents(targetVisit.basicData.community)) in communities){
	    communities[titleCase(removeAccents(targetVisit.basicData.community))]++;    	    
	}
	else {
	    communities[titleCase(removeAccents(targetVisit.basicData.community))] = 1;
	    ncommunities++;
	}
      }

    }

    console.log(communities);
    compliantPercentage = Math.round((ncompliant / nfamilies) * 100);

    document.getElementById("numFamilies").innerHTML = nfamilies;
    document.getElementById("perctFamilies").innerHTML = compliantPercentage;
    document.getElementById("numVisits").innerHTML = nTotalVisits;
    document.getElementById("numComm").innerHTML = ncommunities;
    
    var ctxD = document.getElementById("doughnutChart").getContext('2d');
    var myLineChart = new Chart(ctxD, {
      type: 'doughnut',
      data: {
          labels: $.map(communities, function(value, key) { return key }),
          datasets: [{
	    data: $.map(communities, function(value, key) { return value }),
	    backgroundColor: $.map(communities, function(value, key) {return '#'+Math.floor(Math.random()*16777215).toString(16)}),
        }]
      },
      chartOptions: {
	responsive: true,
	maintainAspectRatio: false,
      }
   });
  });
}

