"use strict";

const loginEmail = document.querySelector("#inputLoginEmail");
const loginPassword = document.querySelector("#inputLoginPassword");
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

