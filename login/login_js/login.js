let currentUser;
async function init() {
  await retrieveUsers();
}

/**
 * This function checks the inputs for login
 * @returns if input is not correct
 */
async function checkInput() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("pw").value;

  for (let i = 0; i < storedUsers.length; i++) {
    const element = storedUsers[i];
    if (element["email"] == email) {
      if (element["email"] == email && element["password"] == password) {
        await loginSteps(element);
      } else {
        alert("Password is incorrect!");
        return;
      }
    }
  }
}

/**
 * This function is to set the right user wich login
 * @param {string} element name of the user
 */
async function loginSteps(element) {
  currentUser = element;
  userAsJson = JSON.stringify(currentUser);
  await backend.setItem("currentUser", userAsJson);
  openSummaryAsUser();
}

function renderSignUpPage() {
  window.location = "../login/signUp/signUp.html";
}

function backToStart() {
  window.location = "../startPage/startPage.html";
}

function forgotPassword() {
  window.location = "../login/forgot/forgotPassword.html";
}

function backFromForgot() {
  let buleScreen = document.getElementById("blue-screen");
  let email = document.getElementById("email");
  let forgot = document.getElementById("forgot_password");

  buleScreen.classList.add("blue-screen");
  forgot.classList.add("shadow-drop-2-center");
  forgot.classList.add("scale-down-center");
  email.classList.add("slide-password-email");

  setTimeout(backToStart, 125);
}

function backFromReset() {
  forgotPassword();
}

/**
 * This funtion send the mail if input is right
 * @returns boolean if input has value or not
 */
function sendMeTheEmail() {
  var email = document.getElementById("email").value;
  if (email == "") {
    return false;
  } else {
    document.getElementById("sent-overlay").classList.remove("d-none");
    document.getElementById("sent-box").classList.remove("d-none");
    setTimeout(backToStart, 1500);
    return true;
  }
}

/**
 * This function can use to reset the pw
 * @returns if no value is in input
 */
function resetPassword() {
  let password = document.getElementById("new-password").value;
  let confirmedPassword = document.getElementById("confirm-password").value;
  if (password == "") {
    alert("Bitte gib ein Passwort ein.");
    return false;
  } else if (confirmedPassword == "") {
    alert("Bitte bestätige dein Passwort.");
  } else if (password != confirmedPassword) {
    alert("Passwörter stimmen nicht überein.");
  } else {
    document.getElementById("reset-overlay").classList.remove("d-none");
    document.getElementById("reset-container").classList.remove("d-none");
    setTimeout(backToStart, 1500);
  }
  return true;
}

/**
 * Open as User greet User
 */
function openSummaryAsUser() {
  window.location = "../../summary/summary.html";
}

/**
 * Open as guest greet guest
 */
async function openSummary() {
  currentUser = "Guest user";
  userAsJson = JSON.stringify(currentUser);
  await backend.setItem("currentUser", userAsJson);
  window.location = "../../summary/summary.html";
}
