"use strict";

var DROPDOWN_POPULATED = false;
var MAX_NUM_VISITS = 0;

// when user selects a new visit number, we want to redo the parsing and
// displaying of data to match the specified visit number
$(document).ready(() => {
  $("select.visitNumSelect").change(() => {
    var selectedVisitNum = $("select.visitNumSelect").find('option').filter(':selected').val();
    parseAndDisplayData(selectedVisitNum);
  });
});

var ref = database.ref("trees_of_Value");

window.onload = function main() {
  if (sessionStorage.getItem("user") == null) {
    window.location.href = "https://proyectotiti-6da63.firebaseapp.com/index.html";
  }
  parseAndDisplayData(0);
}

function parseAndDisplayData(selectedVisitNum) {
  // variables for updating cards in summary-tree.html
  var trees_of_Value;
  var ntrees = 0;
  var ndead = 0;
  var deadPercentage = 0;
  var nhealthy = 0;
  var healthyPercentage = 0;
  var nunhealthy = 0;
  var unhealthyPercentage = 0;
  var healthIssues = {}; // used when implementing doughnut graphs

  var incompleteVisitData = false;

  ref.once('value', snap => {
    trees_of_Value = snap.val();
    ntrees = Object.keys(trees_of_Value).length;

    var keys = Object.keys(trees_of_Value);
    for (var i = 0; i < keys.length; i++) {
      var tree = trees_of_Value[keys[i]];

      var visits = tree.visits;
      var numVisits = Object.keys(visits).length;

      // populate the dropdown menu (which allows the user to select a visit number),
      // if we haven't done so already or if the number of recorded visits for the
      // current tree exceeds the number of visits currently available for selection
      if (!DROPDOWN_POPULATED || MAX_NUM_VISITS < numVisits) {
        if (MAX_NUM_VISITS < numVisits){
          MAX_NUM_VISITS = numVisits;
        }
        populateDropdown(numVisits);
      }

      var targetVisit;
      // if coming from main, display most recent visit
      if (selectedVisitNum == 0) {
        targetVisit = visits[Object.keys(visits)[numVisits - 1]];
        // and show "Most Recent" in the drop down box
        $('select.visitNumSelect option[value=0]').attr('selected', 'selected');
      }
      // otherwise, show all data for the visit that the user
      // specified with the drop down menu
      else {
        targetVisit = visits[Object.keys(visits)[selectedVisitNum - 1]];
      }

      if (targetVisit == undefined || targetVisit == null) {
        incompleteVisitData = true;
        continue;
      }

      // determine if tree is dead or at least affected 
      // at some level
      var affected = false;
      if ("deathLevel" in targetVisit) {
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

      if (healthy) {
        nhealthy++;
      }
      nunhealthy = ntrees - nhealthy;

      if (fungus) {
        if ("fungus" in healthIssues)
          healthIssues["fungus"]++;
        else
          healthIssues["fungus"] = 1;
      }
      if (insect) {
        if ("insect" in healthIssues)
          healthIssues["insect"]++;
        else
          healthIssues["insect"] = 1;
      }
      if (rotten) {
        if ("rotten" in healthIssues)
          healthIssues["rotten"]++;
        else
          healthIssues["rotten"] = 1;
      }
      if (sick) {
        if ("sick" in healthIssues)
          healthIssues["sick"]++;
        else
          healthIssues["sick"] = 1;
      }
      if (affected) {
        if ("reasonForDeath" in targetVisit && targetVisit.reasonForDeath != "") {
          if (targetVisit.reasonForDeath in healthIssues)
            healthIssues[targetVisit.reasonForDeath]++;
          else
            healthIssues[targetVisit.reasonForDeath] = 1;
        }
      }

    }

    deadPercentage = ((ndead / ntrees) * 100).toFixed(2);
    healthyPercentage = ((nhealthy / ntrees) * 100).toFixed(2);
    unhealthyPercentage = ((nunhealthy / ntrees) * 100).toFixed(2);

    document.getElementById("numTrees").innerHTML = ntrees;
    document.getElementById("numberDead").innerHTML = `${ndead}/${ntrees} <i><span style="font-size:0.6em">(${deadPercentage}%)</span></i>`;
    document.getElementById("numberHealthy").innerHTML = `${nhealthy}/${ntrees} <i><span style="font-size:0.6em">(${healthyPercentage}%)</span></i>`;
    document.getElementById("numberUnhealthy").innerHTML = `${nunhealthy}/${ntrees} <i><span style="font-size:0.6em">(${unhealthyPercentage}%)</span></i>`;

    // if we are missing information for some or all trees for the specified visit,
    // then alert the user to this
    if (incompleteVisitData) {
      var lang = localStorage.getItem("spanLang");
      if (lang == "true") {
        document.getElementById("incompleteVisitData").innerHTML = "Datos de Visita Incompletos"
      }
      else {
        document.getElementById("incompleteVisitData").innerHTML = "Incomplete Visit Data";
      }
    }
    // not missing any data for this visit
    else {
      document.getElementById("incompleteVisitData").innerHTML = "";
    }


    var ctxD = document.getElementById("doughnutChart").getContext('2d');
    var myLineChart = new Chart(ctxD, {
      type: 'doughnut',
      data: {
        labels: $.map(healthIssues, function (value, key) { return key }),
        datasets: [{
          data: $.map(healthIssues, function (value, key) { return value }),
          backgroundColor: $.map(healthIssues, function (value, key) { return '#' + Math.floor(Math.random() * 16777215).toString(16) }),
        }]
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
      }
    });
  });
}

function populateDropdown(numVisits) {
  // here we will update the drop down menu so it gives the user the correct
  // number of visits to choose from
  //var innerHTMLString = "<option value=0 id='mostRecentOption'>Most Recent</option>";
  var innerHTMLString = "";
  for (var i = 1; i <= numVisits; i++) {
    innerHTMLString = innerHTMLString + "<option value=" + i.toString() + ">" + i.toString() + "</option>";
  }
  document.getElementById("visitNumSelectId").innerHTML += innerHTMLString;

  DROPDOWN_POPULATED = true;
}