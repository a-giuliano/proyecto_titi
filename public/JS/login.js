firebase.auth().onAuthStateChanged(function(user){
  if(user){
    // User is signed in
    localStorage.setItem("spanLang", "true");
    console.log('success');
    sessionStorage.setItem("user", user);
    window.location.href = "../summary-tree.html";
  }
  else{
    // No user is signed in
    // sit and wait for user to sign in
  }
});

const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // get user info
  const email = loginForm['login-email'].value;
  const password = loginForm['login-password'].value;

  firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error){
    // Handle errors here
    var errorCode = error.code;
    var errorMessage = error.message;
    
    window.alert("Error : " + errorMessage);
  });
});
