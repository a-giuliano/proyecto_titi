"use strict";

var ref = database.ref("trees_of_Value");
var ntreesCard = document.querySelector('#ntrees-card');
var percentageAliveCard = document.querySelector('#percentage-alive-card');
var percentageHealthyCard = document.querySelector('#percentage-healthy-card');

window.onload = function main(){
  if(sessionStorage.getItem("user") == null) {
    window.location.href = "https://proyectotiti-6da63.firebaseapp.com/index.html";
  }

  // get total number of families
  var trees_of_Value;
  var ntrees = 0;
  var nalive = 0;
  var alivePercentage = 0;
  var nhealthy = 0;
  var healthyPercentage = 0;
  //var communities = {}; // use later when implementing doughnut graphs

  ref.once('value', snap=>{
    trees_of_value = snap.val();
    ntrees = Object.keys(trees_of_value).length;

    var keys = Object.keys(trees_of_Value);
    for(var i = 0; i < keys.length; i++){
      var tree = trees_of_Value[keys[i]];

      var visits = tree.visits;
      var targetVisit = visits[Object.keys(visits)[Object.keys(visits).length - 1]];
   
      if (targetVisit == undefined || targetVisit == null){
	      continue;
      }

      // determine number of trees alive
      if("reasonForDeath" in targetVisit){
        nalive += (targetVisit.reasonForDeath == false)? 1 : 0;
      }

       // determine status of each health factor (fungus, insect, rotten, sick)
      var fungus = ("fungus" in targetVisit) ? targetVisit.fungus : false;
      var insect = ("insect" in targetVisit) ? targetVisit.insect : false;
      var rotten = ("rotten" in targetVisit) ? targetVisit.rotten : false;
      var sick = ("sick" in targetVisit) ? targetVisit.sick : false;

      // healthy if no issues with any of the four health factors
      var healthy = !(fungus || insect || rotten || sick);

      if(healthy){
        n_healthy++;
      }

      // use later when implementing doughnut graphs
      /* 
      if ("basicData" in targetVisit && "community" in targetVisit.basicData && targetVisit.basicData.community != "") {
      	if(titleCase(removeAccents(targetVisit.basicData.community)) in communities){
	        communities[titleCase(removeAccents(targetVisit.basicData.community))]++;    	    
	      }
	      else {
	        communities[titleCase(removeAccents(targetVisit.basicData.community))] = 1;
	        ncommunities++;
	      }
      }
      */

    }

    alivePercentage = Math.round((nalive / ntrees) * 100);
    healthyPercentage = Math.round((nhealthy / ntrees) * 100);

    ntreesCard.innerHTML = ntrees;
    percentageAliveCard.innerHTML = alivePercentage;
    percentageHealthyCard.innerHTML = healthyPercentage;
  });
}

