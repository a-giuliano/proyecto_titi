"use strict";

var ref = database.ref("families");
const nfamiliesCard = document.querySelector('#nfmailies-card');
const compliantPercentageCard = document.querySelector('#compliant-percentage-card');
const totalVisitsCard = document.querySelector('#total-visits-card');
const totalCommunities = document.querySelector('#ncommunities');

window.onload = function main(){
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
    	if(targetVisit.basicData.community.toLowerCase() in communities){
	    communities[targetVisit.basicData.community.toLowerCase()]++;    	    
	}
	else {
	    communities[targetVisit.basicData.community.toLowerCase()] = 1;
	    ncommunities++;
	}
      }

    }

    console.log(communities);
    compliantPercentage = Math.round((ncompliant / nfamilies) * 100);

    nfamiliesCard.innerHTML = `
      <h1>${nfamilies}</h1>
      <p>Number of families living in compliance</p>
    `;

    compliantPercentageCard.innerHTML = `
      <h1>${compliantPercentage}%</h1>
      <p>Percentage of families living in compliance</p>
    `;

    totalVisitsCard.innerHTML = `
      <h1>${nTotalVisits}</h1>
      <p>Total number of visits conducted</p>
    `;

    totalCommunities.innerHTML = `
      <h1>${ncommunities}</h1>
      <p>Total number of communities</p>
    `;


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

     options: {
        responsive: true
      }
   });
  });
}

