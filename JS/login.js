firebase.auth().onAuthStateChanged(function(user){
  if(user){
    // User is signed in
    // window.location.href = "../table.html";
    document.getElementById("user_div").style.display = "block";
    document.getElementById("login_div").style.display = "none";
  }
  else{
    // No user is signed in
    document.getElementById("login_div").style.display = "block";
    document.getElementById("user_div").style.display = "none";
  }
});


function login(){
  var userEmail = document.getElementById("email_field").value;
  var userPass = document.getElementById("password_field").value;
  
  firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error){
    // Handle errors here
    var errorCode = error.code;
    var errorMessage = error.message;
    
    window.alert("Error : " + errorMessage);
  });
  
  console.log(userEmail + " " + userPass);
}

function logout(){
  firebase.auth().signOut();
}