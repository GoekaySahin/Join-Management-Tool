/**
 * Check if subtask allready exist and add it
 */
function addSubtask() {
  let newTask = document.getElementById("add-subtask");
  let newSubtask = newTask.value;
  let plus = document.getElementById("plus-icon");
  let subtask_accept = document.getElementById("new-subtask-accept");
  subtasks.push(newSubtask);
  if (selectedSubtasks.indexOf(newSubtask) == -1) {
    selectedSubtasks.push(newSubtask);
  }
  prepareSubstask(newSubtask, plus, subtask_accept);
  backToSubtasks();
}

function prepareSubstask(newSubtask, plus, subtask_accept) {
  subtaskDescription();
  renderSubtasks();
  newSubtask.value = "";
  plus.classList.remove("d-none");
  subtask_accept.classList.add("d-none");
}

/**
 * Show the option the delete after creating subtask
 */
function subtaskDescription() {
  let subtask = document.getElementById("add-subtask");
  if (descript == 0) {
    descript++;
    subtask.placeholder = "Uncheck it, to remove the subtask!";
    subtaskToggleRed();
    setTimeout(subtaskSetBack, 1850);
  }
}

function subtaskToggleRed() {
  let subtask = document.getElementById("add-subtask");
  subtask.classList.toggle("add-subtask-red");
}

/**
 * Set the input field back to main
 */
function subtaskSetBack() {
  let subatsk = document.getElementById("add-subtask");
  subatsk.placeholder = "Add new subtask";
  subtaskToggleRed();
}

function subtaskReturn() {
  return false;
}

/**
 * Set subtask section back to the main view
 */
function backToSubtasks() {
  let plus = document.getElementById("plus-icon");
  let new_subtask = document.getElementById("new-subtask-accept");
  let add_subtask = document.getElementById("add-subtask");

  plus.classList.remove("d-none");
  new_subtask.classList.add("d-none");
  add_subtask.value = "";
}

/**
 * Render the created subtask in bottom of subtask input
 */
function renderSubtasks() {
  if (subtasks.length > 0) {
    for (let i = 0; i < 1; i++) {
      const subtask = subtasks[subCounterAdd];
      document.getElementById("subtask-content").innerHTML +=
        generateHTMLsubtask(subtask, subCounterAdd);
      subCounterAdd++;
    }
  } else {
    for (let i = 0; i < 1; i++) {
      const subtask = subtasks[subCounterAdd++];
      document.getElementById("subtask-content").innerHTML +=
        generateHTMLsubtask(subtask, i);
      subCounterAdd++;
    }
  }
}

/**
 * Check if exist if so, remove, else add
 *
 * @param {number} i of the subtask to added
 */
function addSubtaskToTask(i) {
  let subtask = document.getElementById("subtasks-checkbox-" + i).value;

  if (selectedSubtasks.includes(subtask)) {
    selectedSubtasks.splice(i, 1);
  } else {
    selectedSubtasks.push(subtask);
  }
}

/**
 * This function will set the variable on the right importance
 *
 * @param {strin} pushed wich button gets pushed
 */
function setImportanceBoard(pushed) {
  if (pushed.innerHTML.includes("Ur")) {
    importance = "urgent";
    urgentCounter++;
  } else if (pushed.innerHTML.includes("Me")) {
    importance = "medium";
  } else if (pushed.innerHTML.includes("Lo")) {
    importance = "low";
  }
}

/**
 * This will show the correct colored button after clicked
 *
 * @param {number} nr of importance button id
 */
function fillImportanceButton(nr) {
  let pushed;
  let pushedColored;
  if (nr > 3) {
    resetImportanceEdit();
    pushed = document.getElementById(`importance-button-edit-${nr}`);
    pushedColored = document.getElementById(
      `importance-button-colored-edit-${nr}`
    );
  } else {
    resetImportance();
    pushed = document.getElementById(`importance-button${nr}`);
    pushedColored = document.getElementById(`importance-button${nr}-colored`);
  }
  setImportanceBoard(pushed);
  pushed.classList.toggle("d-none");
  pushedColored.classList.toggle("d-none");
}

function resetImportance() {
  let index = [1, 2, 3];
  let pushed;
  let pushedColored;
  for (let i = 0; i < index.length; i++) {
    const element = index[i];
    pushed = document.getElementById(`importance-button${element}`);
    pushedColored = document.getElementById(
      `importance-button${element}-colored`
    );
    pushed.classList.remove("d-none");
    pushedColored.classList.add("d-none");
  }
}

/**
 * Open the dropdown menu for contacts to select
 */
function openContactsToSelect() {
  document.getElementById("categories-drop-down").classList.add("d-none");
  let element = document.getElementById("contacts-drop-down");
  element.classList.toggle("d-none");
  allFieldsFilled();
}

/**
 * Open the dropdown to select category
 */
function openCategoriesToSelect() {
  document.getElementById("contacts-drop-down").classList.add("d-none");
  let element = document.getElementById("categories-drop-down");
  element.classList.toggle("d-none");
  allFieldsFilled();
}

/**
 * Check and set new contact
 *
 * @returns if input is empty
 */
async function creatNewContactAddTask() {
  let invateNewContactName = document.getElementById("add_task_name").value;
  if (invateNewContactName == "") {
    return;
  }
  selectedContacts.push(invateNewContactName);
  await invateCreateNewContact(invateNewContactName, email);
  getCheckboxValue(invateNewContactName);
  allFieldsFilled();
}

/**
 * This function will add a new contact in the edit task
 *
 * @param {number} id of the right map wich will probaly chanced
 */
async function creatNewContactEdit(id) {
  let invateNewContactName = document.getElementById("add_task_name").value;
  if (invateNewContactName.length == 0 || invateNewContactName == " ") {
    return;
  }
  selectedContacts.push(invateNewContactName); // Here the Contact wich is created in the edit version of taks
  // will be added to selectedContacts first
  await invateCreateNewContact(invateNewContactName, email, id);
  setTimeout(contactsCheckboxUpdate, 400, id);

  getCheckboxValue(invateNewContactName);
  renderContactsSelection(selectedContacts);
}

/**
 * This will save the new invated contact in the backend and clear the field
 *
 * @param {array} invateNewContactName
 * @param {string} email
 * @param {number} id
 */
async function invateCreateNewContact(invateNewContactName, email, id) {
  let invateContacts = [];
  let firstletter = getFirstLetterInvate(invateNewContactName);
  let color = getNewColorContacts();
  let contact = {
    name: invateNewContactName,
    mail: email,
    firstLetters: firstletter,
    color: color,
  };
  let indexLength = await checkIfNewContactExist(contact);

  newContactAddTaskReturn();
  clearContactsBeforeRendering(indexLength);
  renderContactsAddTask(invateNewContactName, id);
  renderContactsSelection(selectedContacts);
}

/**
 * Check if new created contact allready exist
 *
 * @param {string} contact
 * @returns list of indexes
 */
async function checkIfNewContactExist(contact) {
  exist = (await JSON.parse(backend.getItem("contacts"))) || [];
  exist.push(contact);
  await backend.setItem("contacts", JSON.stringify(exist));
  let currentContactsEdit =
    (await JSON.parse(backend.getItem("contacts"))) || [];
  let indexLength;

  if (exist.length > 0) {
    indexLength = exist.length;
  }
  return indexLength;
}

/**
 * Add d none to hole contacts in the list
 * @param {array} displayContacts
 */
function ContactsDivDisplay(displayContacts) {
  for (let i = 0; i < displayContacts.length; i++) {
    let contactsCard = document.getElementById(`contactsDiv${i}`);
    contactsCard.classList.add("d-none");
  }
}

/**
 * Check contacts and set the right checked
 * @param {array} invateNewContactName
 */
async function getCheckboxValue(invateNewContactName) {
  if (invateNewContactName == undefined) {
    invateNewContactName = selectedContacts;
  }
  checkedIndex = [];
  checkedEdit = [];
  if (currentContacts == null) {
    checkedIndex.push(0);
  } else if (checkedIndex.length == 0 && checkedEdit.length == 0) {
    checkedIndex.push(invateNewContactName);
    setCheckboxValue(checkedIndex, checkedEdit);
  } else {
    setCheckboxValue(checkedIndex, checkedEdit);
  }
}

async function setCheckboxValue(checkedIndex, checkedEdit) {
  await getCurrentContacts();
  for (let i = 0; i < currentContacts.length; i++) {
    const element = document.getElementById(`contacts-checkbox${i}`);
    if (element == null) {
      continue;
    }
    if (element.checked === true) {
      checkedIndex.push(i);
    }
    if (checkedEdit.indexOf(checkedIndex) < 0) {
      checkedEdit.push(checkedIndex);
    }
  }
}

async function checkedSetting(invateNewContactName) {
  if (invateNewContactName == undefined) {
    return;
  }

  //selectedContacts.push(invateNewContactName);

  if (selectedContacts.length > 1) {
    showCheckedOnEditContacts(selectedContacts);
  } else {
    showCheckedEditContact(invateNewContactName);
  }
}

function showCheckedEditContact(invateNewContactName) {
  let docElement = document.getElementById(invateNewContactName);
  docElement.childNodes[3].checked = true;
}

function showCheckedOnEditContacts(selectedContacts) {
  for (let i = 0; i < selectedContacts.length; i++) {
    const names = selectedContacts[i];
    let docElement = document.getElementById(names);
    docElement.childNodes[3].checked = true;
  }
}

/**
 * This function will clear the contact field and render new that all contacts are visible
 *
 * @param {array} indexLength
 */
function clearContactsBeforeRendering(indexLength) {
  if (exist.length > 0) {
    for (let i = 0; i < indexLength - 1; i++) {
      let contact = document.getElementById(`selected-contact${i}`);
      if (contact == null) {
        continue;
      }
      contact.parentElement.remove();
    }
  }
}

/**
 * This function checks if a empty index is there
 *
 * @param {array} contact maybe a empty index in it to splice
 * @returns array of conatcts
 */
function spliceEmptyObject(contact) {
  for (let j = 0; j < contact.length; j++) {
    const element = contact[j];
    if (element == "") {
      contact.splice(j, 1);
      continue;
    }
  }
  return contact;
}

/**
 * Get the firstlette of the contact
 *
 * @param {string} contact
 * @returns if contact has no value
 */
function getFirstLetterInvate(contact) {
  let contacts = contact;
  let letterList;
  let firstLetters;
  if (contacts.length == 0) {
    return;
  }

  contact = checkIfString(contact);
  contact = spliceEmptyObject(contact);

  letterList = setTheFirstLetterInvate(contact);
  return letterList;
}

function setTheFirstLetterInvate(contact) {
  for (let i = 0; i < contact.length; i++) {
    const element = contact[i];
    let name = element.split(" ");
    let firstLetter = name[0].split("");
    if (name[1] == undefined) {
      firstLetters = firstLetter;
      firstLetters = firstLetters[0].toUpperCase();
      letterList = firstLetters;
    } else {
      let secondLetter = name[1].split("");
      firstLetters = firstLetter[0] + secondLetter[0];
      firstLetters = firstLetters.toUpperCase();
      letterList = firstLetters;
    }
  }
  return letterList;
}

/**
 * This function will creat a new color for the contact that have been new created
 * @returns new color for new contact
 */
function getNewColorContacts() {
  let color = "#";
  const symbols = "0123456789ABCDEF";
  for (let f = 0; f < 6; f++) {
    color += symbols[Math.floor(Math.random() * 16)];
  }
  return color;
}

/**
 * This function checks who gets login
 *
 * @returns user wich is login
 */
function loadAtStartTask() {
  let nameTest = JSON.parse(backend.getItem("currentUser")) || [];
  if (nameTest.length < 2) {
    showCurrentUserNameForSummery = "Guest";
  } else {
    showCurrentUserNameForSummery = nameTest;
  }
  return showCurrentUserNameForSummery;
}
