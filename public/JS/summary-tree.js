"use strict";

var ref = database.ref("trees_of_Value");
var trees_of_Value;
var DROPDOWN_POPULATED = false;
var REGIONS = {
  0: "All",
  1: "Ceibal",
  2: "Reserva",
  3: "Corredores"
}

// helper functions
function setAttributes(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}

function createOptionElement(attrs, innerhtml){
  var option = document.createElement("option");
  setAttributes(option, attrs); // uses helper function
  option.innerHTML = innerhtml;
  return option;
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}

function createIncompleteVisitDataAlertElement(spanish){
  var theAlert = document.createElement("div");
  var attributes = {"class": "alert", "id": "incompleteVisitData"};
  setAttributes(theAlert, attributes);
  var alertText = document.createElement("p");
  alertText.setAttribute("id", "incompleteVisitDataText");
  alertText.innerHTML = spanish ? "Datos de Visita Incompletos" : "Incomplete Visit Data";
  theAlert.appendChild(alertText);
  document.getElementById("dropdownsDiv").appendChild(theAlert);
}

function resetOptions() {
  document.getElementById("regionSelectId").value = 0;
  region_onchange();
  document.getElementById("compareVisitText").style.color = "black";
  var lang = localStorage.getItem("spanLang");
  if (lang =="true") {
    translate();
  }
  else {
    detranslate();
  }
}

// when user selects a new region number, we want to redo the parsing and
// displaying of data to match the specified region (we will reset the visit and compare dropdowns)
function region_onchange(){
    var selectedRegion = parseInt(document.getElementById("regionSelectId").value);
    // reset visit number
    document.getElementById("visitNumSelectId").value = 0;
    // reset compared visit
    document.getElementById("compareVisitSelectId").value = 0;
    setCardsToSingleVisit();
    var singleVisitData = parseDataSingleVisit(selectedRegion, 0);
    populateDropdowns(singleVisitData.maxNumVisits, false);
    displaySingleVisitData(singleVisitData);
}


// when user selects a new visit number, we want to redo the parsing and
// displaying of data to match the specified visit number (and reset compared visit)
function visit_num_onchange(){
  var selectedVisitNum = parseInt(document.getElementById("visitNumSelectId").value);
  var selectedRegion = parseInt(document.getElementById("regionSelectId").value);
  // reset compare visit dropdown
  document.getElementById("compareVisitSelectId").value = 0;
  // only view the newly selected visit, don't compare
  setCardsToSingleVisit();
  var singleVisitData = parseDataSingleVisit(selectedRegion, selectedVisitNum);
  displaySingleVisitData(singleVisitData);
  //update options for the compare visit dropdown
  if (selectedVisitNum == 0){ // "Most recent"
    populateDropdowns(singleVisitData.maxNumVisits, true);
  }
  else{
    // Only allow compare visit dropdown to have options for visits earlier than the selected visit
    populateDropdowns(selectedVisitNum, true);
  }
}

function compare_visit_onchange(){
  var selectedCompareVisit = parseInt(document.getElementById("compareVisitSelectId").value);
  var selectedVisitNum = parseInt(document.getElementById("visitNumSelectId").value);
  var selectedRegion = parseInt(document.getElementById("regionSelectId").value);

  // if the user doesn't want a comparison visit any more
  if (parseInt(selectedCompareVisit) == 0) {
    document.getElementById("compareVisitText").style.color = "black";
    // show the normal cards relevant for a single visit
    setCardsToSingleVisit();
    var singleVisitData = parseDataSingleVisit(selectedRegion, selectedVisitNum);
    displaySingleVisitData(singleVisitData);
    return;
  }

  // user wants to make a comparison
  document.getElementById("compareVisitText").style.color = "blue";

  // if the user wants to compare against the previous visit
  if (selectedCompareVisit == -1){
    if (selectedVisitNum == 1) {
      // cannot allow comparison between visit 1 and previous visit, as there is no visit before visit 1
      var lang = localStorage.getItem("spanLang");
      if (lang == "true") { // Spanish
        alert("No se puede comparar con la visita anterior debido al número de visita seleccionado actualmente.");
      }
      else { // English
        alert("Cannot compare to previous visit due to currently selected Visit Number.");
      }
      document.getElementById("compareVisitSelectId").value = 0;
    }
    // if the user wants to compare against a certain visit that is not visit 1
    else {
      // show the comparison cards instead
      setCardsToCompareVisits();
      var compareVisitData = parseDataSingleVisit(selectedRegion, selectedCompareVisit);
      var currentVisitData = parseDataSingleVisit(selectedRegion, selectedVisitNum);
      compareVisits(currentVisitData, compareVisitData);
    }
  }

  // if the user wants to compare against a certain visit
  else {
    // show the comparison cards instead
    setCardsToCompareVisits();
    var compareVisitData = parseDataSingleVisit(selectedRegion, selectedCompareVisit);
    var currentVisitData = parseDataSingleVisit(selectedRegion, selectedVisitNum);
    compareVisits(currentVisitData, compareVisitData);
  }
}

window.onload = function onload() {
  if (sessionStorage.getItem("user") == null) {
    window.location.href = "https://proyectotiti-6da63.firebaseapp.com/index.html";
  }

  // assign onchange functions for the dropdown menus
  document.getElementById("regionSelectId").onchange = region_onchange;
  document.getElementById("visitNumSelectId").onchange = visit_num_onchange;
  document.getElementById("compareVisitSelectId").onchange = compare_visit_onchange;

  // parse and display with region set to All and visit number set to Most Recent
  ref.once('value', snap => {
    trees_of_Value = snap.val();
    //setup();
    setCardsToSingleVisit();
    var singleVisitData = parseDataSingleVisit(0, 0);
    populateDropdowns(singleVisitData.maxNumVisits, false);
    displaySingleVisitData(singleVisitData);
    update(); // from lang.js - unify the language being displayed

    // ################
    // TODO : ALLOW DOWNLOAD AS CSV
    // ################
    // load data into csv file link
    var csvLink = document.querySelector('#csv-link');
    var csvFile = new Blob([Papa.unparse(trees_of_Value["2BO12"])], {type: 'text'});
    csvLink.href = URL.createObjectURL(csvFile);
    csvLink.download = 'Trees_of_Value-Data.csv';
  });
}

function populateDropdowns(numVisits, compareDropdownOnly) {
  // clear the compare dropdown
  removeAllChildNodes(document.getElementById("compareVisitSelectId"))
  // add the new options
  var none_option = createOptionElement({"value": "0", "id": "noneOption"}, "None");
  document.getElementById("compareVisitSelectId").appendChild(none_option);

  var prev_option = createOptionElement({"value": "-1", "id": "previousOption"}, "Previous");
  document.getElementById("compareVisitSelectId").appendChild(prev_option);
  
  // add individual visit options
  for (var i = 1; i < numVisits; i++) {
    var option = createOptionElement({"value": i.toString()}, i.toString()); // helper function
    document.getElementById("compareVisitSelectId").appendChild(option);
  }
  // if we only need to update compare visit dropdown
  if (compareDropdownOnly) return;

  // if we also need to populate the visit dropdown

  // clear the visit dropdown
  removeAllChildNodes(document.getElementById("visitNumSelectId"))
  // add "Most Recent" option
  var mr_option = createOptionElement({"value": "0", "id": "mostRecentOption"}, "Most Recent"); // helper function
  document.getElementById("visitNumSelectId").appendChild(mr_option);

  // add individual visit options
  for (var i = 1; i <= numVisits; i++){
    var option = createOptionElement({"value": i.toString()}, i.toString()); // helper function
    document.getElementById("visitNumSelectId").appendChild(option);
  }
}

function checkAllTreesHaveVisit(incompleteVisitData) {
  // if we are missing information for some or all trees for the specified visit,
  // then alert the user to this with text on the page
  if (incompleteVisitData) {
    var lang = localStorage.getItem("spanLang");
    if (lang == "true") { // Spanish
      if (document.getElementById("incompleteVisitData") == null) {
        createIncompleteVisitDataAlertElement(true);
      }
    }
    else { // English
      if (document.getElementById("incompleteVisitData") == null) {
        createIncompleteVisitDataAlertElement(false);
      }
    }
  }
  // not missing any data for this visit
  else {
    if (document.getElementById("incompleteVisitData") != null) {
      document.getElementById("dropdownsDiv").removeChild(document.getElementById("incompleteVisitData"));
    }
  }
}

function parseDataSingleVisit(selectedRegion, selectedVisitNum) {

  var maxNumVisits = 0;
  // variables for updating cards in summary-tree.html
  var ntrees = 0;
  var ndead = 0;
  var nhealthy = 0;
  var healthIssues = {}; // used when implementing doughnut graphs
  var reasonsForDeath = {}; // used when implementing doughnut graphs
  var singleVisitData = {};
  var incompleteVisitData = false;
  var sumOfHeights = 0;
  var sumOfDaps = 0;

  // console.log("Parsing");
  // console.log(typeof trees_of_Value);
  // console.log(trees_of_Value);
  ntrees = Object.keys(trees_of_Value).length;

  var keys = Object.keys(trees_of_Value);
  for (var i = 0; i < keys.length; i++) {
    var tree = trees_of_Value[keys[i]];
    // check for correct region
    if (selectedRegion == 0) { // all regions
      ;
    }
    else if (REGIONS[selectedRegion] != tree.location) {
      // region of tree doesn't match selected region
      ntrees -= 1;
      continue;
    }

    var visits = tree.visits;
    var numVisits = Object.keys(visits).length;

    if (maxNumVisits < numVisits){
      maxNumVisits = numVisits;
    }

    
    var targetVisit = undefined;
    // if we want most recent visit
    if (selectedVisitNum == 0) {
      targetVisit = visits[Object.keys(visits)[numVisits - 1]];
    }
    //if we want the previous visit
    else if (selectedVisitNum == -1){
      try {
        targetVisit = visits[Object.keys(visits)[numVisits - 2]];
      }
      catch (err){
        console.log("Catching error");
        // If the tree only has one visit, we can't get a previous visit;
        incompleteVisitData = true;
        break;
      }
    }
    // otherwise, use data for the visit that the user
    // specified with the drop down menu
    else {
      targetVisit = visits[Object.keys(visits)[selectedVisitNum - 1]];
    }

    if (targetVisit == undefined || targetVisit == null) {
      incompleteVisitData = true;
      ntrees -= 1;
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

    // add height and dap to appropriate accumulating variables
    sumOfHeights += ("height" in targetVisit) ? parseFloat(targetVisit.height) : 0;
    if ("dap" in targetVisit){
      if (targetVisit.dap == "-75.3") sumOfDaps += 75.3;
      else if (targetVisit.dap == "-75.5") sumOfDaps += 75.5;
      else if (targetVisit.dap == "Mas 160" && targetVisit.code == "2CL10") sumOfDaps += 200;
      else if (targetVisit.dap == "Mas 160" && targetVisit.code == "2LE04") sumOfDaps += 167.5;
      else sumOfDaps += parseFloat(targetVisit.dap);
    }
    //sumOfDaps += ("dap" in targetVisit) ? parseFloat(targetVisit.dap) : 0; <------------------- change back later

    // determine status of each health factor (fungus, insect, rotten, sick)
    var fungus = ("fungus" in targetVisit) ? targetVisit.fungus : false;
    var insect = ("insect" in targetVisit) ? targetVisit.insect : false;
    var rotten = ("rotten" in targetVisit) ? targetVisit.rotten : false;
    var sick = ("sick" in targetVisit) ? targetVisit.sick : false;

    // healthy if no issues with any of the four health factors and not
    // affected at any level
    var healthy = !(fungus || insect || rotten || sick); // || affected);

    if (healthy) {
      nhealthy++;
    }

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
        if (targetVisit.reasonForDeath in reasonsForDeath) {
          reasonsForDeath[targetVisit.reasonForDeath]++;
        }
        else {
          reasonsForDeath[targetVisit.reasonForDeath] = 1;
        }
      }
    }


  }
  var nalive = ntrees - ndead;
  console.log("sumOfHieghts: " + sumOfHeights);
  var avgHeight = sumOfHeights / nalive;
  console.log("avgHeight in Parser: " + avgHeight);
  console.log("sumOfDaps: " + sumOfDaps);
  var avgDap = sumOfDaps / nalive;
  console.log("avgDap in Parser: " + avgDap);

  singleVisitData.maxNumVisits = maxNumVisits;
  singleVisitData.ntrees = ntrees;
  singleVisitData.ndead = ndead;
  singleVisitData.nhealthy = nhealthy;
  singleVisitData.nunhealthy = ntrees - nhealthy;
  singleVisitData.healthIssues = healthIssues;
  singleVisitData.reasonsForDeath = reasonsForDeath;
  singleVisitData.avgHeight = avgHeight;
  singleVisitData.avgDap = avgDap;

  // check if each tree in the current region has information for the selected visit
  checkAllTreesHaveVisit(incompleteVisitData);
  return singleVisitData; // dictionary of values used in the display function
}

function compareVisits(currentVisitData, compareVisitData) {
  console.log("avgHeight: " + currentVisitData.avgHeight);
  console.log("avgDap: " + currentVisitData.avgDap);
  
  // note: compare visit happened before current visit
  // Get the comparison data we need for the new comparison cards
  var comparisonData = {}
  comparisonData.changeNumTracked = currentVisitData.ntrees - compareVisitData.ntrees;
  comparisonData.changeNumTrackedPerc = compareVisitData.ntrees == 0 ? 0 : ((comparisonData.changeNumTracked / compareVisitData.ntrees) * 100).toFixed(2);
  comparisonData.changeNumDead = currentVisitData.ndead - compareVisitData.ndead;
  comparisonData.changeNumDeadPerc = compareVisitData.ndead == 0 ? 0 : ((comparisonData.changeNumDead / compareVisitData.ndead) * 100).toFixed(2);
  comparisonData.changeNumHealthy = currentVisitData.nhealthy - compareVisitData.nhealthy;
  comparisonData.changeNumHealthyPerc = compareVisitData.nhealthy == 0 ? 0 : ((comparisonData.changeNumHealthy / compareVisitData.nhealthy) * 100).toFixed(2);
  comparisonData.changeNumUnhealthy = currentVisitData.nunhealthy - compareVisitData.nunhealthy;
  comparisonData.changeNumUnhealthyPerc = compareVisitData.nunhealthy == 0 ? 0 : ((comparisonData.changeNumUnhealthy / compareVisitData.nunhealthy) * 100).toFixed(2);
  comparisonData.changeAvgHeight = (currentVisitData.avgHeight - compareVisitData.avgHeight).toFixed(2);
  comparisonData.changeAvgHeightPerc = compareVisitData.avgHeight == 0 ? 0 : ((comparisonData.changeAvgHeight / compareVisitData.avgHeight) * 100).toFixed(2);
  comparisonData.changeAvgDap = (currentVisitData.avgDap - compareVisitData.avgDap).toFixed(2);
  comparisonData.changeAvgDapPerc = compareVisitData.avgDap == 0 ? 0 : ((comparisonData.changeAvgDap / compareVisitData.avgDap) * 100).toFixed(2);
  
  // Get data about reasons for death and health issues for any trees that are newly
  // affected between the earlier visit and the later visit (for use in dougnut graphs)
  comparisonData.reasonsForDeath = {};
  var rfd;
  for (rfd in currentVisitData.reasonsForDeath) {
    if (rfd in compareVisitData.reasonsForDeath) {
      var count = currentVisitData.reasonsForDeath[rfd] - compareVisitData.reasonsForDeath[rfd];
      if (count > 0) {
        comparisonData.reasonsForDeath[rfd] = count;
      }
    }
    else {
      // rfd did not exist in compareVisitData
      comparisonData.reasonsForDeath[rfd] = currentVisitData.reasonsForDeath[rfd];
    }
  }
  var hi;
  comparisonData.healthIssues = {};
  for (hi in currentVisitData.healthIssues) {
    if (hi in compareVisitData.healthIssues) {
      var count = currentVisitData.healthIssues[hi] - compareVisitData.healthIssues[hi];
      if (count > 0) {
        comparisonData.healthIssues[hi] = count;
      }
    }
    else {
      // hi did not exist in compareVisitData
      compareVisitData.healthIssues[hi] = currentVisitData.healthIssues[hi];
    }
  }

  displayComparisonData(comparisonData);
}

// display the data for the comparison between two visits
function displayComparisonData(cData) {
  console.log("cData.changeNumTrackedPerc" + cData.changeNumTrackedPerc);
  // display the comparison data on the new cards
  document.getElementById("numTrees").innerHTML = `${cData.changeNumTracked} <i><span style="font-size:0.6em">(${cData.changeNumTrackedPerc}%)</span></i>`;
  document.getElementById("numberDead").innerHTML = `${cData.changeNumDead} <i><span style="font-size:0.6em">(${cData.changeNumDeadPerc}%)</span></i>`;

  document.getElementById("numberHealthy").innerHTML = `${cData.changeNumHealthy} <i><span style="font-size:0.6em">(${cData.changeNumHealthyPerc}%)</span></i>`;
  document.getElementById("numberUnhealthy").innerHTML = `${cData.changeNumUnhealthy} <i><span style="font-size:0.6em">(${cData.changeNumUnhealthyPerc}%)</span></i>`;

  document.getElementById("avgHeightChange").innerHTML = `${cData.changeAvgHeight} <i><span style="font-size:0.6em">(${cData.changeAvgHeightPerc}%)</span></i>`;
  document.getElementById("avgDapChange").innerHTML = `${cData.changeAvgDap} <i><span style="font-size:0.6em">(${cData.changeAvgDapPerc}%)</span></i>`;

  // visualize changes in reasons for death and in health issues
  createDougnutGraphs(cData.reasonsForDeath, cData.healthIssues);
}

// display cards and doughnut graph for information about a single visit
function displaySingleVisitData(singleVisitData) {
  var ntrees = singleVisitData.ntrees;
  var ndead = singleVisitData.ndead;
  var nhealthy = singleVisitData.nhealthy;
  var healthIssues = singleVisitData.healthIssues;
  var reasonsForDeath = singleVisitData.reasonsForDeath;
  var nunhealthy = singleVisitData.nunhealthy;
  var deadPercentage = ((ndead / ntrees) * 100).toFixed(2);
  var healthyPercentage = (((nhealthy-ndead) / (ntrees - ndead)) * 100).toFixed(2);
  var unhealthyPercentage = ((nunhealthy / (ntrees - ndead)) * 100).toFixed(2);

  document.getElementById("numTrees").innerHTML = ntrees;
  document.getElementById("numberDead").innerHTML = `${ndead}/${ntrees} <i><span style="font-size:0.6em">(${deadPercentage}%)</span></i>`;
  document.getElementById("numberHealthy").innerHTML = `${nhealthy-ndead}/${ntrees-ndead} <i><span style="font-size:0.6em">(${healthyPercentage}%)</span></i>`;
  document.getElementById("numberUnhealthy").innerHTML = `${nunhealthy}/${ntrees-ndead} <i><span style="font-size:0.6em">(${unhealthyPercentage}%)</span></i>`;

  // create 'reasons for death' and 'health issues' doughnut graphs
  createDougnutGraphs(reasonsForDeath, healthIssues);
}

function createDougnutGraphs(reasonsForDeath, healthIssues){
  var deathChart = document.getElementById("doughnutChart-reasonsForDeath");
  if (typeof(deathChart) != undefined && deathChart != null){
    $('#doughnutChart-reasonsForDeath').remove();
  }
  $('#graphContainer').append('<canvas baseChart class ="chart" id="doughnutChart-reasonsForDeath"></canvas>');
  var ctxD = document.getElementById("doughnutChart-reasonsForDeath").getContext('2d');
  var myDeathChart = new Chart(ctxD, {
    type: 'doughnut',
    data: {
      labels: $.map(reasonsForDeath, function (value, key) { return key }),
      datasets: [{
        data: $.map(reasonsForDeath, function (value, key) { return value }),
        backgroundColor: $.map(reasonsForDeath, function (value, key) { return '#' + Math.floor(Math.random() * 16777215).toString(16) }),
      }]
    },
    chartOptions: {
      responsive: true,
      maintainAspectRatio: false,
    }
  });

  var healthChart = document.getElementById("doughnutChart-healthIssues");
  if (typeof(healthChart) != undefined && healthChart != null){
    $('#doughnutChart-healthIssues').remove();
  }
  $('#graphContainer').append('<canvas baseChart class ="chart" id="doughnutChart-healthIssues"></canvas>');
  var ctxD = document.getElementById("doughnutChart-healthIssues").getContext('2d');
  var myHealthChart = new Chart(ctxD, {
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
}

function setCardsToSingleVisit() {
  // set the cards for single visit information
  if (document.getElementById("change-avg-height-card") != null) {
    document.getElementById("change-avg-height-card").style.display = 'none';
  }
  if (document.getElementById("change-avg-dap-card") != null) {
    document.getElementById("change-avg-dap-card").style.display = 'none';
  }
  // change styling for card one to center it
  document.getElementById("numTrees").style.paddingLeft = "0%";

  var lang = localStorage.getItem("spanLang");
  if (lang == "true") { // Spanish
    document.getElementById("NTCLabel").innerHTML = "# Arboles Rastreados";
    document.getElementById("NDCLabel").innerHTML = "# Muertos";
    document.getElementById("NHCLabel").innerHTML = "# Saludables";
    document.getElementById("NUCLabel").innerHTML = "# Insaludables";
  }
  else { // English
    document.getElementById("NTCLabel").innerHTML = "# Tracked Trees";
    document.getElementById("NDCLabel").innerHTML = "# Dead";
    document.getElementById("NHCLabel").innerHTML = "# Healthy";
    document.getElementById("NUCLabel").innerHTML = "# Unhealthy";
  }

}

function setCardsToCompareVisits() {
  // set the cards to compare two visits
  document.getElementById("change-avg-height-card").style.display = 'inline-block';
  document.getElementById("change-avg-dap-card").style.display = 'inline-block';
  // change styling for card one to center it
  document.getElementById("numTrees").style.paddingLeft = "20%";

  var lang = localStorage.getItem("spanLang");
  if (lang == "true") { // Spanish
    document.getElementById("ACHLabel").innerHTML = "<span style=\"color:blue\">(Cambio en) la Altura Media (m)</span>";
    document.getElementById("ACDLabel").innerHTML = "<span style=\"color:blue\">(Cambio en) la Dap Media (cm)</span>";

    document.getElementById("NTCLabel").innerHTML = "<span style=\"color:blue\">(Cambio en) # Arboles Rastreados</span>";
    document.getElementById("NDCLabel").innerHTML = "<span style=\"color:blue\">(Cambio en) # Muertos</span>";
    document.getElementById("NHCLabel").innerHTML = "<span style=\"color:blue\">(Cambio en) # Saludables</span>";
    document.getElementById("NUCLabel").innerHTML = "<span style=\"color:blue\">(Cambio en) # Insaludables</span>";
  }
  else { // English
    document.getElementById("ACHLabel").innerHTML = "<span style=\"color:blue\">(Change in) Average Height (m)</span>";
    document.getElementById("ACDLabel").innerHTML = "<span style=\"color:blue\">(Change in) Average Dap (cm)</span>";

    document.getElementById("NTCLabel").innerHTML = "<span style=\"color:blue\">(Change in) # Tracked Trees</span>";
    document.getElementById("NDCLabel").innerHTML = "<span style=\"color:blue\">(Change in) # Dead</span>";
    document.getElementById("NHCLabel").innerHTML = "<span style=\"color:blue\">(Change in) # Healthy</span>";
    document.getElementById("NUCLabel").innerHTML = "<span style=\"color:blue\">(Change in) # Unhealthy</span>";
  }
}