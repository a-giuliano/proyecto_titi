function logout(){
  firebase.auth().signOut();
  window.location.href = "index.html";
}