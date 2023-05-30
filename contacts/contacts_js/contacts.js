let color;
let firstLetters;
let selectedColor;
let selectedLetter;
let selectedContact;
let editContactIndex;
/* let maps;
let todosMap;
let progressesMap;
let feedbacksMap;
let donesMap; */

setURL(
  "https://goekay-nuri-sahin.developerakademie.com/join/smallest_backend_ever"
);

async function init() {
  await downloadFromServer();
  await includeHTML();
  checkSize();
  await renderContactList();
  await loadContacts();
}

async function loadContacts() {
  contacts = (await JSON.parse(backend.getItem("contacts"))) || [];
}

function hoverContactsHtml() {
  let contactsHTML = document.getElementById("contacts-html");
  let contactsBG = document.getElementById("contacts_bg");

  contactsHTML.classList.add("section-background-normal");
  contactsBG.classList.remove("section-background");
}

function hoverContactsRespons() {
  let contactsHTML = document.getElementById("contacts-html");
  let contactsBG = document.getElementById("contacts_bg");

  contactsHTML.classList.remove("section-background");
  contactsBG.classList.add("section-background");
}

function checkSize() {
  let size = window.innerWidth;
  if (size < 1024) {
    sidebarTabled();
    hoverContactsRespons();
  } else if (size > 1024) {
    enableSidebar();
    hoverContactsHtml();
  }
}

function sidebarTabled() {
  let sidebar = document.getElementById("sidebar");
  let helpBTN = document.getElementById("help-section-btn");
  let response = document.getElementById("header-name-resp");

  sidebar.classList.remove("sidebar");
  sidebar.classList.add("tablet-sidebar");
  helpBTN.classList.add("d-none");

  if (!(response == null)) {
    response.classList.remove("d-none");
  }
}

function enableSidebar() {
  let sidebar = document.getElementById("sidebar");
  sidebar.classList.add("sidebar");
  sidebar.classList.remove("tablet-sidebar");
}

// Contact JS

function setCreatedContact(name, mail, mobil, firstLetters) {
  let contact = {
    name: name.value,
    mail: mail.value,
    mobil: mobil.value,
    color: color,
    firstLetters: firstLetters,
  };
  return contact;
}

async function creatNewContactBackSettings(contact, name, mail, mobil) {
  contacts.push(contact);
  await backend.setItem("contacts", JSON.stringify(contacts));
  renderContactList();
  closeBlurScreen();
  succesImg();
  resetValue(name, mail, mobil);
}

async function createNewContact() {
  let name = document.getElementById("input-name");
  let mail = document.getElementById("input-mail");
  let mobil = document.getElementById("input-phone");
  firstLetters = name.value.split(/\s+/).map((word) => word[0]);
  firstLetters = firstLetters.join("");
  firstLetters = firstLetters.toUpperCase();
  getNewColor();
  let contact = setCreatedContact(name, mail, mobil, firstLetters);
  await creatNewContactBackSettings(contact, name, mail, mobil);
}

function resetValue(name, mail, mobil) {
  name.value = "";
  mail.value = "";
  mobil.value = "";
}

function succesImg() {
  let succsesIMG = document.getElementById("succes_img");

  succsesIMG.classList.remove("d-none");
  setTimeout(() => {
    succsesIMG.classList.add("d-none");
  }, 1500);
}

function renderContactsRaster() {
  let raster = document.getElementById("contact_list_container");
  raster.innerHTML = renderContactsRasterHTML();
}

function renderContactsDetailLoop(contacts) {
  for (let i = 0; i < contacts.length; i++) {
    const element = contacts[i];
    let firstLetters = element["name"].split(/\s+/).map((word) => word[0]);
    let acronym = firstLetters.join("");
    let color = element["colors"];

    renderContactListHTML(element, acronym, i);
    setColorOnRendering(i);
    disableContactContainer();
    let contactsCircle = document.getElementById(`circle_contacts${i}`);
    contactsCircle.style.background = color;
  }
}

async function renderContactDetail() {
  contacts = (await JSON.parse(backend.getItem("contacts"))) || [];
  if (contacts.length < 1) {
    let listId = document.getElementById("contact-list-id");
    listId.classList.add("d-none");
    showNoContacts();
  } else {
    renderContactsDetailLoop(contacts);
  }
}

async function renderContactList() {
  let container = document.getElementById("contact_list_container");
  container.innerHTML = "";
  renderContactsRaster();

  await renderContactDetail();
}

async function renderContactListHTML(element, acronym, i) {
  let firstLetter = element["name"] ? element["name"][0] : "";
  if (!firstLetter) {
    console.error("First letter is undefined");
    return;
  }
  let id = firstLetter.toLowerCase();
  ContactListHTML(id, acronym, i, element);
}

function renderDecision(name, email, phone, acronym, color) {
  const body = document.body;
  const bodyWidth = body.offsetWidth;
  if (bodyWidth < 800) {
    renderDetailHTMLRespons();
    renderDetailHTML(name, email, phone, acronym, color);
  } else {
    renderDetailHTML(name, email, phone, acronym, color);
    animateDetail();
  }
}

async function openContactDetail(i) {
  contacts = await JSON.parse(backend.getItem("contacts"));
  let contact = contacts[i];
  let name = contact["name"];
  let email = contact["mail"];
  let phone = contact["mobil"];
  let color = contact["color"];
  let firstLetters = contact["name"].split(/\s+/).map((word) => word[0]);
  let acronym = firstLetters.join("");

  renderOpenDetail(i);
  renderDecision(name, email, phone, acronym, color);
  openContactDetailHover(i);
}

function closeContactRight() {
  let contactRight = document.getElementById("contact_right");

  contactRight.classList.add("slide-bottom");
  setTimeout(() => {
    contactRight.classList.add("d-none");
    contactRight.classList.remove("slide-bottom");
  }, 300);
}

function closeDetail() {
  let editPencil = document.getElementById("edit_contact_pencil");
  let editContact = document.getElementById("edit_contact");
  let listContainer = document.getElementById("contact_list_container");
  let newBTN = document.getElementById("new_contact_btn");
  let contactRight = document.getElementById("contact_right");
  let backArrow = document.getElementById("backarrow");

  editPencil.classList.remove("d-none");
  editContact.classList.add("d-none");
  listContainer.classList.remove("d-none");
  newBTN.classList.remove("d-none");
  contactRight.classList.add("d-none");
  backArrow.classList.add("d-none");
}

function addNewContact() {
  const addContactContainer = document.getElementById("add_contact_container");
  const blurScreen = document.getElementById("blur_screen");

  if (addContactContainer.classList.contains("d-none")) {
    addContactContainer.classList.remove("d-none");
    blurScreen.classList.remove("d-none");
    animateAddContact();
  } else {
    addContactContainer.classList.add("d-none");
    blurScreen.classList.add("d-none");
  }
}

function closeBlurScreen() {
  const addContactContainer = document.getElementById("add_contact_container");
  const blurScreen = document.getElementById("blur_screen");
  const editBlurscreen = document.getElementById("blur_screen-edit");

  addContactContainer.classList.add("d-none");
  blurScreen.classList.add("d-none");
  editBlurscreen.classList.add("d-none");
}

function openAddTask() {
  let addTask = document.getElementById("add_task");
  let list = document.getElementsByTagName("html");
  let html = list[0];

  addTask.classList.toggle("d-none");
  window.scrollTo(0, 0);
  html.classList.toggle("hide-overflow-y");

  renderAddTask();
  renderContactsAddTask();
  dateFuture();
}

function renderAddTask() {
  let addTask = document.getElementById("add_task");
  addTask.innerHTML = renderAddTaskHTML();
}

function closeAddTask() {
  let addBoard = document.getElementById("add-board");

  addBoard.classList.remove("slide-left");
  addBoard.classList.add("slide-right");
  setTimeout(openAddTask, 350);
}

function getNewColor() {
  let symbols;
  symbols = "0123456789ABCDEFabcdef";
  color = "#";

  for (let f = 0; f < 6; f++) {
    color = color + symbols[Math.floor(Math.random() * 21)];
    console.log(color);
  }
}

function setColorOnRendering(i) {
  let circle = document.getElementById(`circle_contacts${i}`);
  circle.style.background = contacts[i]["color"];
}

function clickDialog(e) {
  e.stopPropagation();
}

function setEditContact(nameInput, mailInput, selectedContact, phoneInput) {
  nameInput.value = selectedContact.name;
  mailInput.value = selectedContact.mail;
  if (selectedContact.mobil !== undefined) {
    phoneInput.value = selectedContact.mobil;
  } else {
    phoneInput.value = "";
  }
}

function openEditContact(i) {
  selectedContact = contacts[i];
  selectedColor = selectedContact["color"];
  selectedContactIndex = i;

  let nameInput = document.getElementById("input-name-edit");
  let mailInput = document.getElementById("input-mail-edit");
  let phoneInput = document.getElementById("input-phone-edit");
  let mobileRight = document.getElementById("mobile_right");

  setEditContact(nameInput, mailInput, selectedContact, phoneInput);

  removeBlurscreen();
  animateEditContact();
}

async function setToSaveEditContact(
  contacts,
  name_input,
  mail_input,
  phone_input,
  firstLetter
) {
  let contact = {
    name: name_input.value,
    mail: mail_input.value,
    mobil: phone_input.value,
    color: selectedColor,
    firstLetters: firstLetter,
  };

  await deleteSelectedContact(contact);
  await saveMaps();
  selectedContact = null;
  setContactListByResponsive();
  renderContactList();
  closeBlurScreen();
  closeContactRight();
  setTimeout(() => {
    renderOpenDetail();
  }, 200);
}

async function saveEditContact() {
  let contacts = await JSON.parse(backend.getItem("contacts"));
  let name_input = document.getElementById("input-name-edit");
  let mail_input = document.getElementById("input-mail-edit");
  let phone_input = document.getElementById("input-phone-edit");
  let firstLetters = name_input.value.split(/\s+/).map((word) => word[0]);
  let firstLetter = firstLetters.join("");

  await setToSaveEditContact(
    contacts,
    name_input,
    mail_input,
    phone_input,
    firstLetter
  );
}

async function deleteSelectedContact(contact) {
  contacts[selectedContactIndex] = contact;
  await backend.setItem("contacts", JSON.stringify(contacts));
  await getMaps();
  searchMapsForContact(contact);
}

function setTodoGetMaps() {
  if (todos.length > 1) {
    todosMap = new Map(Object.entries(JSON.parse(todos)));
  }
}

function setProgressGetMap() {
  if (progresses.length > 1) {
    progressesMap = new Map(Object.entries(JSON.parse(progresses)));
  }
}

function setFeedbacksGetMap(feedbacks) {
  if (feedbacks.length > 1) {
    feedbacksMap = new Map(Object.entries(JSON.parse(feedbacks)));
  }
}

function setDonesGetMap(dones) {
  if (dones.length > 1) {
    donesMap = new Map(Object.entries(JSON.parse(dones)));
  }
}

async function getMaps() {
  let todos = (await JSON.parse(backend.getItem("todoJson"))) || [];
  let progresses = (await JSON.parse(backend.getItem("progressJson"))) || [];
  let feedbacks = (await JSON.parse(backend.getItem("feedbackJson"))) || [];
  let dones = (await JSON.parse(backend.getItem("doneJson"))) || [];

  setTodoGetMaps(todos);
  setProgressGetMap(progresses);
  setFeedbacksGetMap(feedbacks);
  setDonesGetMap(dones);

  maps = [todosMap, progressesMap, feedbacksMap, donesMap];
}

function checkSetupMapsContact(contacts, map, index) {
  if (index.contacts == undefined) {
    return;
  } else {
    console.log(index.contacts);
    if (index.contacts.indexOf(selectedContact.name) >= 0) {
      let i = index.contacts.indexOf(selectedContact.name);
      index.contacts.splice(i, 1);
      if (typeof index.letters == "string") {
        index.letters = index.letters.split(",");
      }
      index.letters.splice(i, 1);
      console.log(contacts.name);
      index.letters.splice(i, 0, contacts.firstLetters);
      index.contacts.splice(i, 0, contacts.name);
    }
  }
}

function searchMapsForContact(contacts) {
  maps.forEach((map) => {
    map.forEach((index) => {
      checkSetupMapsContact(contacts, map, index);
    });
  });
}

function setContactListByResponsive() {
  const bodyWidth = document.body.offsetWidth;

  if (bodyWidth <= 800) {
    setTimeout(() => {
      document
        .getElementById("contact_list_container")
        .classList.remove("d-none");
      document.getElementById("new_contact_btn").classList.remove("d-none");
    }, 400);
  }
}

async function saveMaps() {
  const todos = JSON.stringify(Object.fromEntries(todosMap));
  await backend.setItem("todoJson", JSON.stringify(todos));
  const progresses = JSON.stringify(Object.fromEntries(progressesMap));
  await backend.setItem("progressJson", JSON.stringify(progresses));
  const feedbackes = JSON.stringify(Object.fromEntries(feedbacksMap));
  await backend.setItem("feedbackJson", JSON.stringify(feedbackes));
  const dones = JSON.stringify(Object.fromEntries(donesMap));
  await backend.setItem("doneJson", JSON.stringify(dones));
}

function dateFuture() {
  const today = new Date().toISOString().split("T")[0];
  let dateTask = document.getElementById("select-date-task");

  dateTask.setAttribute("min", today);
}

function removeBlurscreen() {
  let blurScreen = document.getElementById("blur_screen-edit");
  blurScreen.classList.remove("d-none");
}

function addBlurscreen() {
  let blurScreen = document.getElementById("blur_screen-edit");
  blurScreen.classList.add("d-none");
}

//  Render HMTL

function openContactDetailHover(i) {
  // Zunächst entfernen Sie alle vorhandenen ‘selected’ Klassen von allen Kontakten.
  let contacts = document.getElementsByClassName("contact");
  for (let j = 0; j < contacts.length; j++) {
    contacts[j].classList.remove("contact-selected");
    document
      .getElementById(`contact-email-${j}`)
      .classList.remove("color-white");
  }
  // Fügen Sie die ‘selected’ Klasse nur zum angeklickten Kontakt hinzu.
  let selectedContact = document.getElementById(`contact${i}`);
  selectedContact.classList.add("contact-selected");
  document.getElementById(`contact-email-${i}`).classList.add("color-white");
}

function checkIfString(element) {
  if (typeof element === "string") {
    element = element.split(",");
  }
  return element;
}
