"use strict";

var ref = database.ref("trees_of_Value");
//const ntreesCard = document.querySelector('#ntrees-card');
//const percentageAliveCard = document.querySelector('#percentage-alive-card');
//const percentageHealthyCard = document.querySelector('#percentage-healthy-card');

window.onload = function main(){
  if(sessionStorage.getItem("user") == null) {
    window.location.href = "https://proyectotiti-6da63.firebaseapp.com/index.html";
  }

  // variables for updating cards in summary-tree.html
  var trees_of_Value;
  var ntrees = 0;
  var ndead = 0;
  var deadPercentage = 0;
  var nhealthy = 0;
  var healthyPercentage = 0;
  var nunhealthy = 0;
  var unhealthyPercentage = 0;
  var healthIssues = {}; // use when implementing doughnut graphs

  ref.once('value', snap=>{
    trees_of_Value = snap.val();
    ntrees = Object.keys(trees_of_Value).length;

    var keys = Object.keys(trees_of_Value);
    for(var i = 0; i < keys.length; i++){
      var tree = trees_of_Value[keys[i]];

      var visits = tree.visits;
      var targetVisit = visits[Object.keys(visits)[Object.keys(visits).length - 1]];
   
      if (targetVisit == undefined || targetVisit == null){
	      continue;
      }

      // determine if tree is dead or at least affected 
      // at some level
      var affected = false;
      if("deathLevel" in targetVisit){
        var deathLevel = targetVisit.deathLevel;
        deathLevel = deathLevel[6]; // the digit after 'Nivel'
        // if the Nivel in the deathLevel field is '4'
        // (which is when Afectacion is 100%), then the
        // tree is dead
        ndead += (deathLevel == '4') ? 1 : 0;
        affected = (deathLevel != '0') ? true : false;
      }

       // determine status of each health factor (fungus, insect, rotten, sick)
      var fungus = ("fungus" in targetVisit) ? targetVisit.fungus : false;
      var insect = ("insect" in targetVisit) ? targetVisit.insect : false;
      var rotten = ("rotten" in targetVisit) ? targetVisit.rotten : false;
      var sick = ("sick" in targetVisit) ? targetVisit.sick : false;
      
      // healthy if no issues with any of the four health factors and not
      // affected at any level
      var healthy = !(fungus || insect || rotten || sick || affected);

      if(healthy){
        nhealthy++;
      }
      nunhealthy = ntrees - nhealthy;

      if (fungus){
        if ("fungus" in healthIssues)
          healthIssues["fungus"]++;
        else
          healthIssues["fungus"] = 1;
      }
      if (insect){
        if ("insect" in healthIssues)
          healthIssues["insect"]++;
        else
          healthIssues["insect"] = 1;
      }
      if (rotten){
        if ("rotten" in healthIssues)
          healthIssues["rotten"]++;
        else
          healthIssues["rotten"] = 1;
      }
      if (sick){
        if ("sick" in healthIssues)
          healthIssues["sick"]++;
        else
          healthIssues["sick"] = 1;
      }
      if (affected){
        if ("reasonForDeath" in targetVisit){
          if (targetVisit.reasonForDeath in healthIssues)
            healthIssues[targetVisit.reasonForDeath]++;
          else
            healthIssues[targetVisit.reasonForDeath] = 1;
        }
      }

    }

    deadPercentage = Math.round((ndead / ntrees) * 100).toFixed(1);
    healthyPercentage = Math.round((nhealthy / ntrees) * 100).toFixed(1);
    unhealthyPercentage = Math.round((nunhealthy / ntrees) * 100).toFixed(1);
    
    document.getElementById("numTrees").innerHTML = ntrees;
    document.getElementById("percentDead").innerHTML = `${deadPercentage} <i><span style="font-size:0.6em">(${ndead}/${ntrees})</span></i>`;
    document.getElementById("percentHealthy").innerHTML = `${healthyPercentage} <i><span style="font-size:0.6em">(${nhealthy}/${ntrees})</span></i>`;
    document.getElementById("percentUnhealthy").innerHTML = `${unhealthyPercentage} <i><span style="font-size:0.6em">(${nunhealthy}/${ntrees})</span></i>`;
    
    var ctxD = document.getElementById("doughnutChart").getContext('2d');
    var myLineChart = new Chart(ctxD, {
      type: 'doughnut',
      data: {
          labels: $.map(healthIssues, function(value, key) { return key }),
          datasets: [{
	          data: $.map(healthIssues, function(value, key) { return value }),
	          backgroundColor: $.map(healthIssues, function(value, key) {return '#'+Math.floor(Math.random()*16777215).toString(16)}),
        }]
      },
      chartOptions: {
	      responsive: true,
	      maintainAspectRatio: false,
      }
   });
  });
}

