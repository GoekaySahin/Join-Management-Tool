let alphabet = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "x",
  "y",
  "z",
];

function openContactsOnContactsHtml() {
  renderContactsAddTask();
  openContactsToSelect();
}

/**
 * Redner the alphabet register
 */
function renderContactsRasterHTML() {
  alphabet.forEach((letter) => {
    let container = `${letter}_container`;
    let innerContainer = document.getElementById("contact-list-id");

    innerContainer.innerHTML += `
                          <div id="${container}">
                            <div class="contact-char">${letter.toUpperCase()}</div>
                            <hr class="underline" />
                          </div>
                          <div id="${letter}"></div>`;
  });
}

function showNoContacts() {
  document.getElementById("contact_list_container").innerHTML = `
    <div class="no-contacts">
      <h4>No contacts yet. <br> Please add a new contact!</h4>
    </div>
    `;
}

function ContactListHTML(id, acronym, i, element) {
  document.getElementById(id).innerHTML += `
    <div class="contact" id="contact${i}" onclick="openContactDetail(${i})">
      <div id="circle_contacts${i}" class="circle">${acronym.toUpperCase()}</div>
      <div class="contact-info-container">
      <span class="contact-name">${element["name"]}</span>
      <span id="contact-email-${i}" class="contact-email">${
    element["mail"]
  }</span>
      </div>
    </div>
    `;
}

function renderOpenDetail(i) {
  document.getElementById("contact_right").innerHTML = `
    <img onclick="closeDetail()" class="d-none" id="backarrow" src="img/backarrow.png" alt="" />
    <div class="name-container">
      <div class="circle-right" id="circle_right"></div>
      <div class="name">
        <h1 id="name_right"></h1>
        <div class="name-addTask">
          <div onclick="openAddTask()"  class="add-task-opener">
              <img class="cross" src="img/cross.png" alt="" />
              <p>Add Task</p>
          </div>
          <div onclick="openEditContact(${i})" id="edit_contact_pencil" class="edit-contact">
            <img src="img/pencil.png" alt="" />
            <p>Edit Contact</p>
          </div>
        </div>
      </div>
    </div>

    <div class="contact-information-container">
      <div class="contact-information">
        <h2>Contact Information</h2>
        <div class="info-email">
          <p>Email</p>
          <span id="mail_right"></span>
        </div>
        <div class="info-mobil">
          <p>Mobil</p>
          <span id="mobil_right"></span>
        </div>
      </div>
    </div>
    <button class="save-btn deleteBTN" onclick="deleteActualContact(${i})" >delete</button>
    <img onclick="openEditContact(${i})" src="img/edit-contact.png" id="edit_contact" class="d-none" alt="" />
    `;
}

function renderDetailHTML(name, email, phone, acronym, color) {
  let cRight = document.getElementById("contact_right");
  let nRight = document.getElementById("name_right");
  let mRight = document.getElementById("mail_right");
  let circleRight = document.getElementById("circle_right");
  let mobileRight = document.getElementById("mobil_right");

  cRight.classList.remove("d-none");
  nRight.innerHTML = name;
  mRight.innerHTML = email;

  if (phone == undefined) {
    mobileRight.innerHTML = "";
  } else {
    mobileRight.innerHTML = `${phone}`;
  }
  circleRight.innerHTML = acronym.toUpperCase();
  circleRight.style.background = color;
}

function renderDetailHTMLRespons() {
  let newBtn = document.getElementById("new_contact_btn");
  let contactList = document.getElementById("contact_list_container");
  let editPush = document.getElementById("edit_contact_pencil");
  let back = document.getElementById("backarrow");
  let editContact = document.getElementById("edit_contact");
  let contactRight = document.getElementById("contact_right");

  newBtn.classList.add("d-none");
  contactList.classList.add("d-none");
  editPush.classList.add("d-none");
  back.classList.remove("d-none");
  contactRight.classList.remove("d-none");
  editContact.classList.remove("d-none");
}

/**
 * Disable the register where no contact exist
 */
function disableContactContainer() {
  alphabet.forEach((letter) => {
    let container = `${letter}_container`;
    if (document.getElementById(`${letter}`).innerHTML < 1) {
      document.getElementById(container).classList.add("d-none");
    } else {
      document.getElementById(container).classList.remove("d-none");
    }
  });
}
