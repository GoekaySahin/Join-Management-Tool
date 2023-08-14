/**
 * Set the document where the subtask start rendering
 */
function renderSubtasks() {
  let subContent = document.getElementById("subtask-content");

  subContent.innerHTML = "";
  for (let i = 0; i < subtasks.length; i++) {
    const subtask = subtasks[i];
    subContent.innerHTML += generateHTMLsubtask(subtask, i);
  }
}

/**
 *
 * @param {number} i is the number of the right id to remove or add the subtask
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
 * This function will set urgent and reset the other if clicked bevor
 */
function fillImportanceButton1() {
  importance = "urgent";
  importance1.style = "display: none;";
  importance1Colored.style = "display: flex; cursor: pointer;";
  importance2.style = "display: flex;";
  importance2Colored.style = "display: none;";
  importanc3.style = "display: flex;";
  importance3Colored.style = "display: none;";
}

/**
 * This function will reset colored button for urgent
 */
function emptyImportanceButton1() {
  importance = "";
  importance1.style = "display: flex;";
  importance1Colored.style = "display: none;";
}

/**
 * This function will set medium and reset the other if clicked bevor
 */
function fillImportanceButton2() {
  importance = "medium";
  importance2.style = "display: none;";
  importance2Colored.style = "display: flex; cursor: pointer;";
  importance1.style = "display: flex;";
  importance1Colored.style = "display: none;";
  importanc3.style = "display: flex;";
  importance3Colored.style = "display: none;";
}

/**
 * This function will reset medium button colored
 */
function emptyImportanceButton2() {
  importance = "";
  importance2.style = "display: flex;";
  importance2Colored.style = "display: none;";
}

/**
 * This function will set low and reset the other if clicked bevor
 */
function fillImportanceButton3() {
  importance = "low";
  importanc3.style = "display: none;";
  importance3Colored.style = "display: flex; cursor: pointer;";
  importance1.style = "display: flex;";
  importance1Colored.style = "display: none;";
  importance2.style = "display: flex;";
  importance2Colored.style = "display: none;";
}

/**
 * This function will reset the low colored
 */
function emptyImportanceButton3() {
  importance = "";
  importanc3.style = "display: flex;";
  importance3Colored.style = "display: none;";
}

/**
 * This function is used to open the dropdown where the contacts are rendered
 */
function openContactsToSelect() {
  if (!contactsRendered) {
    renderContacts();
    contactsRendered = true;
  }
  let ddContacts = document.getElementById("contacts-drop-down");
  let overlay = document.getElementById("overlay-contacts");
  ddContacts.classList.toggle("d-none");
  ddContacts.classList.toggle("contacts-z");
  overlay.classList.toggle("overlay-z");
}

/**
 * This function is to open the dropdown where the categorys are to select
 */
function openCategoriesToSelect() {
  let ddCategories = document.getElementById("categories-drop-down");
  let overlay = document.getElementById("overlay-categories");
  ddCategories.classList.toggle("d-none");
  ddCategories.classList.toggle("contacts-z");
  overlay.classList.toggle("overlay-z");
}

/**
 * This function is used to reset the checkboxes in the dropdown contacts
 */
function resetCheckboxes() {
  for (let i = 0; i < contacts.length; i++) {
    document.getElementById(`contacts-checkbox-${i}`).checked = false;
  }
}

/**
 * This function gets the document as variable to reset all
 *
 * @param {string} contacts document that will be manipulated
 * @param {string} title document that will be manipulated
 * @param {string} select document that will be manipulated
 * @param {string} description document that will be manipulated
 * @param {string} addSubtask document that will be manipulated
 * @param {string} accept document that will be manipulated
 * @param {string} plus document that will be manipulated
 * @param {string} selectCategory document that will be manipulated
 */
function clearAllInputFieldsAddTask(
  contacts,
  title,
  select,
  description,
  addSubtask,
  accept,
  plus,
  selectCategory,
  date
) {
  title.value = "";
  select.value = "";
  description.value = "";
  addSubtask.value = "";
  accept.classList.add("d-none");
  plus.classList.remove("d-none");
  resetImportanceButtons();
  selectedContacts = [];
  categoryColor = "";
  categoryColorTrue = "";
  selectedSubtasks = [];
  selectCategory.innerHTML = resetCategory();
  resetCheckboxes();
  contacts.innerHTML = "";
  date.value = "";
}

/**
 * This function transmitted the inputsfileds to clear it
 */
function clearAllInputFields() {
  let contacts = document.getElementById("contacts_box");
  let title = document.getElementById("title-input");
  let select = document.getElementById("select-date");
  let description = document.getElementById("description-input");
  let addSubtask = document.getElementById("add-subtask");
  let accept = document.getElementById("new-subtask-accept");
  let plus = document.getElementById("plus-icon");
  let selectCategory = document.getElementById("select-category");
  let date = document.getElementById("select-date");

  clearAllInputFieldsAddTask(
    contacts,
    title,
    select,
    description,
    addSubtask,
    accept,
    plus,
    selectCategory,
    date
  );
}

/**
 * Shows the correct input type to creat new contact
 */
function newContactAddTask() {
  if (newContactAddTaskActive) {
    let invateContact = document.getElementById("new_contact");
    invateContact.innerHTML = generateHTMLinviteNewContactEmail();
    invateContact.classList.remove("contacts-list-elem");
    invateContact.classList.remove("new-contact");
    invateContact.classList.add("invate-class");

    newContactAddTaskActive = false;
  }
}

/**
 * This function will return the main view to creat a new contact
 */
function newContactAddTaskReturn() {
  let invateContact = document.getElementById("new_contact");
  invateContact.classList.add("contacts-list-elem");
  invateContact.classList.add("new-contact");
  invateContact.classList.remove("invate-class");
  invateContact.innerHTML = `
    <span class="rendered-contact-name"
    >Invite new contact</span
      >
      <img src="../add_task/img-add_task/contact_blue.png" />`;
  newContactAddTaskActive = true;
}

/**
 * This function start the render function to create new contact in the list and check and safe the email
 */
function addNameNewContact() {
  let invateNewContactEmail = document.getElementById("add_task_email").value;
  email = [String(invateNewContactEmail)];
  let invateContact = document.getElementById("new_contact");
  invateContact.innerHTML = generateHTMLinviteNewContactName();
}

/**
 * This function safe the new created contact in the backend
 */
async function createNewContactAddTask() {
  let invateNewContactName = document.getElementById("add_task_name").value;
  await invateCreateNewContact(invateNewContactName, email);
}

/**
 * This function is to creat the contact with all the information and transmitted to safe it
 *
 * @param {string} invateNewContactName of the new created contact
 * @param {string} email of the new created contact
 */
async function invateCreateNewContact(invateNewContactName, email) {
  let firstletter = getFirstLetterInvate(invateNewContactName);
  let color = getNewColorContact();
  let contact = {
    name: invateNewContactName,
    mail: email,
    firstLetters: firstletter,
    color: color,
  };
  let exist = (await JSON.parse(backend.getItem("contacts"))) || [];
  exist.push(contact);
  await backend.setItem("contacts", JSON.stringify(exist));
  newContactAddTaskReturn();
  clearContactsBeforeRendering();
  renderContacts();
}

/**
 *
 * @param {string} contact wich the function will get the firstletter of
 * @returns the firstletters
 */
function getFirstLetterInvate(contact) {
  let contacts = [contact];
  let letterList;

  for (let i = 0; i < contacts.length; i++) {
    const element = contacts[i];
    let name = element.split(" ");
    let firstLetter = name[0].split("");
    let secondLetter = name[1].split("");
    let firstLetters = firstLetter[0] + secondLetter[0];

    letterList = firstLetters;
  }

  return letterList;
}

/**
 * This function is to generate a new color for the firstletter view background in a circle
 *
 * @returns color of the contact
 */
function getNewColorContact() {
  let symbols, color;
  symbols = "0123456789ABCDEF";
  color = "#";

  for (let f = 0; f < 6; f++) {
    color = color + symbols[Math.floor(Math.random() * 16)];
  }
  return color;
}

function creatContactsSelection(contactsShow, currentContacts) {
  for (let i = 0; i < selectedContacts.length; i++) {
    const current = selectedContacts[i];
    for (let j = 0; j < currentContacts.length; j++) {
      const contactData = currentContacts[j]["name"];
      if (contactData == current) {
        contactsShow.push(currentContacts[j]);
      }
    }
  }
  return contactsShow;
}

/**
 * This function will creat two small view for contacts and a colored dot with ... that shows more than two contacts are edit
 *
 * @param {array} contactsShow contacts to show in small view
 */
function creatContactShowMoreThanTwo(contactsShow, cBox) {
  for (let i = 0; i < 2; i++) {
    cBox.innerHTML += `<p class="invate-contact font-contact" style="background-color: ${contactsShow[i]["color"]};">${contactsShow[i]["firstLetters"]}</p>`;
  }
  changedColorForDots = "#FFAA00";
  cBox.innerHTML += `<p class="invate-contact font-contact" style="background-color: ${changedColorForDots};">...</p>`;
}

/**
 * This function will show two contacts in small view colored firstletter version
 *
 * @param {array} contactsShow contacts to show in small view
 */
function creatTwoContactsToShow(contactsShow, cBox) {
  for (let i = 0; i < contactsShow.length; i++) {
    cBox.innerHTML += `<p class="invate-contact font-contact" style="background-color: ${contactsShow[i]["color"]};">${contactsShow[i]["firstLetters"]}</p>`;
  }
}

/**
 * This function is to generate just one firstletter smallview, colored circle for a contact
 *
 * @param {array} contactsShow contact that will show in small view
 */
function creatOneContactToShow(contactsShow, cBox) {
  for (let i = 0; i < contactsShow.length; i++) {
    cBox.innerHTML += `<p class="invate-contact font-contact" style="background-color: ${contactsShow[i]["color"]};">${contactsShow[i]["firstLetters"]}</p>`;
  }
}

/**
 * This function is to check how much of the contacts should generated
 *
 * @param {array} contacts contacts that are in small view with letters in cirlcle colored background
 * @returns if selectedContacts is empty
 */
async function renderContactsSelection(contacts) {
  let changedColorForDots = [];
  let cBox = document.getElementById("contacts_box");
  let contactsShow = [];
  let currentContacts = contacts;

  contactsShow = creatContactsSelection(contactsShow, currentContacts);

  if (selectedContacts == "") {
    cBox.innerHTML = "";
    return;
  }
  cBox.innerHTML = "";
  if (contactsShow.length > 2) {
    creatContactShowMoreThanTwo(contactsShow, cBox);
  } else if (contactsShow.length == 2) {
    creatTwoContactsToShow(contactsShow, cBox);
  } else {
    creatOneContactToShow(contactsShow, cBox);
  }
}
