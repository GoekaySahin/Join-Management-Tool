let storedUsers = [];
let emailValue = false;

setURL("https://join.goekay-sahin.de/smallest_backend_ever/");

function checkInputSignUp(userName, email, password) {
  if (userName == "") {
    alert("Bitte gib deinen Namen ein.");
    return false;
  } else if (email == "") {
    alert("Bitte gib deine E-Mail-Adresse ein.");
  } else if (password == "") {
    alert("Bitte gib ein Passwort ein.");
  } else {
    let success = document.getElementById("sign-up-successful");
    success.classList.remove("d-none");
    setTimeout(() => {
      window.location = "../startPage/startPage.html";
    }, 3000);
  }
}

function creatNewUserSignUp(userName, email, password) {
  let newUser = {
    userName: userName,
    email: email,
    password: password,
  };
  return newUser;
}

async function signUpUser() {
  let userName = document.getElementById("user").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("pw").value;
  checkIfEmailIsCorrectForm(email);
  if (emailValue == false) {
    return;
  }
  let newUser = creatNewUserSignUp(userName, email, password);

  storedUsers.push(newUser);
  await backend.setItem("storedUsers", JSON.stringify(storedUsers));
  checkInputSignUp(userName, email, password);
  emailValue = false;
  return true;
}

function checkIfEmailIsCorrectForm(email) {
  if (!email.includes(".")) {
    alert("Incorrect e-mail form!");
  } else {
    emailValue = true;
  }
}

async function retrieveUsers() {
  await downloadFromServer();
  let storedJSON = (await backend.getItem("storedUsers")) || [];
  if (storedJSON.length > 1) {
    storedUsers = JSON.parse(storedJSON);
  }
}
