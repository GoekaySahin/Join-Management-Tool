function subtaskCounter(doneCoordinates, counter) {
  for (let i = 0; i < doneCoordinates.length; i++) {
    const element = doneCoordinates[i];
    if (element.includes("add")) {
      counter++;
    }
    return counter;
  }
}

function renderSubtaskStatus(id, doneSum) {
  document.getElementById(`subtask_done${id}`).innerHTML = doneSum;
}

function addProgressCard(number, id, doneSum) {
  let progressStatusCard = document.getElementById(`progress_card_done${id}`);
  let bar = document.getElementById(`progress_card${id}`);

  progressStatusCard.innerHTML = doneSum;
  bar.style = `width: ${number}%;`;
}

/**
 * This function checks from the id wich map it is
 *
 * @param {number} id of the map
 * @returns the right map
 */
function checkMap(id) {
  let currentMap = new Map();
  if (todosMap.has(`${id}`)) {
    currentMap = new Map(todosMap);
  } else if (progressesMap.has(`${id}`)) {
    currentMap = new Map(progressesMap);
  } else if (feedbacksMap.has(`${id}`)) {
    currentMap = new Map(feedbacksMap);
  } else {
    currentMap = new Map(donesMap);
  }
  return currentMap;
}

/**
 * This function shows the contacts in edit popup version
 *
 * @returns wich contacts are in popup
 */
async function editContactsPopup() {
  let map = await JSON.parse(backend.getItem("contacts"));
  if (map == undefined || map == null) {
    return;
  }
  if (typeof map === "string") {
    map = map.split(",");
  }
  let contactsInPopup = [];
  for (let i = 0; i < map.length; i++) {
    const element = map[i]["name"];
    let dok = document.getElementById(`contacts-checkbox${i}`);
    if (dok == null || dok == undefined) {
      return;
    }
    if (contactsInPopup.indexOf(element) < 0) {
      contactsInPopup.push(element);
    }
  }
  return contactsInPopup;
}

/**
 * This function is to set the layout if subtask on it
 * @param {number} id of the map
 */
function setSubtasksLayout(id) {
  let progressText = document.getElementById(`progress_text${id}`);
  let subText = document.getElementById("subtask_id");
  let subP = document.getElementsByClassName("subtext");
  let subCheck = document.getElementsByClassName("sub-checkmark");

  progressText.classList.add("add-colum");
  subText.classList.add("mb");
  subText.classList.add("mt11");
  for (let i = 0; i < subP.length; i++) {
    const element = subP[i];
    element.classList.add("mt0");
    subCheck[i].classList.remove("d-none");
    document.getElementById(`subtask_checking${i}`).classList.add("scw");
  }
}

/**
 * This function will check the selected contacts in the dropdown
 *
 * @param {number} id of the map
 * @returns id dropdown is close
 */
function setSelectedContacts(id) {
  let dropDown = document.getElementById("contacts-drop-down-edit");

  if (dropDown.classList.contains("d-none")) {
    return;
  }
  let map = wichSection(id);
  let contacts = map.get(`${id}`)["contacts"];
  contacts = checkIfString(contacts);
  if (contacts[0] == "") {
    contacts.splice(0, 1);
  } else {
    selectedContacts = contacts;
  }
}

/**
 * This function will start if user will edit
 * is change the layout
 * @param {number} id of the map
 */
function edit(id) {
  addEditClasses();
  let currentMap = new Map(checkMap(id));
  let popTop = document.getElementById("popup_card");
  let title = currentMap.get(`${id}`)["title"];
  let description = currentMap.get(`${id}`)["description"];
  let names = document.getElementsByClassName("fullName");
  let contactsInEdit = [];

  for (let i = 0; i < names.length; i++) {
    const element = names[i];
    element.classList.add("d-none");
    let contact = element.innerHTML;
    contactsInEdit.push(contact);
  }
  setTimeout(renderContactsSelection, 150, contactsInEdit);
  setTimeout(ContactsDivDisplay, 1, contactsInEdit);

  showEdit(title, description, id);
  dateFuture();
  setSubtasksLayout(id);
  toggleEditTitle();
  checkExistContact(id);
  /*   openEditContactsToSelect(id);
    openEditContactsToSelect(id); */
  setTimeout(checkExistContact, 100, id);
  editDnone();
  setEditPrio(id);
}

function getContactsForCheckbox(id) {
  let map = wichSection(id);
  let contacts = map.get(`${id}`)["contacts"];
  contacts = checkIfString(contacts);

  for (let j = 0; j < contacts.length; j++) {
    const newElement = contacts[j];
    document.getElementById(newElement).checked = true;
  }
}

function toggleEditTitle() {
  let titleEdit = document.getElementById("popup-card-title");
  titleEdit.classList.toggle("popup-title-for_edit");
}

function dateFuture() {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("select-date").setAttribute("min", today);
}

function dateFutureTask() {
  const today = new Date().toISOString().split("T")[0];
  let dateId = document.getElementById("select-date-task");
  if (dateId == null) {
    return;
  }
  dateId.setAttribute("min", today);
}

/**
 * This function show the old inputs on the editable card
 * @param {string} title of the card or task in popup view to edit
 * @param {string} description of the card task
 * @param {number} id of the card task to edit
 */
function showEdit(title, description, id) {
  let colors = document.getElementById(`c-color`);
  let popupTitle = document.getElementById("popup_title");
  let cardConten = document.getElementById("card_content");
  let popupDescription = document.getElementById("popup_description");
  let date = document.getElementById("date_box");
  let prio = document.getElementById("edit_priority");
  let assing = document.getElementById("edit-assigned");
  let contact = document.getElementById("contact");
  let editBox = document.getElementById("edit_box");

  renderShowEdit(
    colors,
    popupTitle,
    cardConten,
    popupDescription,
    date,
    prio,
    assing,
    contact,
    editBox,
    title,
    description,
    id
  );
}

function deleteTask(id) {
  let map = wichSection(id);
  map.delete(`${id}`);
  generateCards();
  popup();
  saveMaps();
}

function checkItBeforSaving(
  titleEdit,
  descriptionEdit,
  dateEdit,
  contactsEdit,
  button,
  section,
  category,
  categorycolor,
  colors,
  letters,
  subtask,
  subtaskStatus,
  id
) {
  if (titleEdit.length == 0) {
    titleEdit = section.get(`${id}`)["title"];
  }
  if (descriptionEdit.length == 0) {
    descriptionEdit = section.get(`${id}`)["description"];
  }
  if (dateEdit.length == 0) {
    dateEdit = section.get(`${id}`)["date"];
  }
  if (contactsEdit.length == 0 || contactsEdit[0] == "") {
    contact = section.get(`${id}`)["contacts"];
    contactsEdit = contact;
  }
  if (button == undefined) {
    button = section.get(`${id}`)["importance"];
  }
  saveIn(
    titleEdit,
    descriptionEdit,
    dateEdit,
    contactsEdit,
    button,
    section,
    category,
    categorycolor,
    colors,
    letters,
    subtask,
    subtaskStatus,
    id
  );
}

/**
 * This function is to safe the status quo
 *
 * @param {number} id of the map
 */
function qickSaveMap(id) {
  let titleEdit = document.getElementById("popup_title_edit").value;
  let descriptionEdit = document.getElementById("popup_description_edit").value;
  let dateEdit = document.getElementById("select-date").value;
  let contactsEdit = selectedContacts;
  let button = checkPrioBtn(id);
  let section = wichSection(id);

  let category = section.get(`${id}`)["category"];
  let categorycolor = section.get(`${id}`)["categorycolor"];
  let colors = section.get(`${id}`)["colors"];
  let letters = section.get(`${id}`)["letters"];
  let subtask = section.get(`${id}`)["subtask"];
  let subtaskStatus = globalProgress;
  checkItBeforSaving(
    titleEdit,
    descriptionEdit,
    dateEdit,
    contactsEdit,
    button,
    section,
    category,
    categorycolor,
    colors,
    letters,
    subtask,
    subtaskStatus,
    id
  );
}

/**
 * This function will add or remove the contacts and return
 * @returns array of correct contat
 */
function checkSelectedContacts() {
  if (selectedContacts.length > 0) {
    for (let i = 0; i < selectedContacts.length; i++) {
      const element = selectedContacts[i];
      if (currentContacts.indexOf(element) == -1) {
        currentContacts.push(element);
      }
    }
  }
  return currentContacts;
}

/**
 * This function will make sure that the right contacts will return in a rigth way
 *
 * @param {number} id of the map
 * @returns correct array of contacts
 */
function checkContacts(id) {
  let newContacts = selectedContacts;
  let map = wichSection(id);
  let currentContacts = map.get(`${id}`)["contacts"];

  selectedContacts = checkIfString(selectedContacts);
  currentContacts = checkIfString(currentContacts);

  if (currentContacts == selectedContacts) {
    return currentContacts;
  }
  currentContacts = checkSelectedContacts(currentContacts);

  return currentContacts;
}

async function setColorsExist() {
  let contacts = await JSON.parse(backend.getItem("contacts"));
  let colorList = [];
  for (let i = 0; i < selectedContacts.length; i++) {
    const taskName = selectedContacts[i];
    for (let j = 0; j < contacts.length; j++) {
      const contactsName = contacts[j]["name"];
      if (contactsName.includes(taskName)) {
        colorList.push(contacts[j]["color"]);
      }
    }
  }
  return colorList;
}

function titleLengthCheck(titleEdit, section, id) {
  if (titleEdit.length == 0) {
    titleEdit = section.get(`${id}`)["title"];
  }

  return titleEdit;
}

function descriptionLengthCheck(descriptionEdit, section, id) {
  if (descriptionEdit.length == 0) {
    descriptionEdit = section.get(`${id}`)["description"];
  }
  return descriptionEdit;
}

function dateLengthCheck(dateEdit, section, id) {
  if (dateEdit.length == 0) {
    dateEdit = section.get(`${id}`)["date"];
  }
  return dateEdit;
}

function buttonEditCheck(button, section, id) {
  if (button == undefined) {
    button = section.get(`${id}`)["importance"];
  }
  return button;
}
