"use strict";

const loginEmail = document.getElementById("inputLoginEmail");
const loginPassword = document.getElementById("inputLoginPassword");
const submitButton = document.querySelector("#buttonLogin");

submitButton.addEventListener("click", function() {
  console.log(loginEmail.value + " . " + loginPassword.value)
  if(loginEmail.value === "test@test.com" && loginPassword.value === "test"){
    window.location.href="todo.html";
  }

  else {
    alert("Wrong login");
  }
})

