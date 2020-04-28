function logout(){
  firebase.auth().signOut();
  sessionStorage.clear();
  window.location.href = "index.html";
}
