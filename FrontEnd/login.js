const loginEmail = document.querySelector("#login-email").value;
const loginPassword = document.querySelector("#login-password").value;
const submitButton = document.querySelector("#submit-button");

submitButton.addEventListener("click", function() {
  if(loginEmail === "test@test.com" && loginPassword === "test"){
    window.location.href="todo.html";
  }

  else {
    alert("Wrong login");
  }
})

