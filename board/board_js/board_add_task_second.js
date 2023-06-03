/**
 *
 * @param {variable} importance1 importance button
 * @param {variable} importance2 importance button
 * @param {variable} importance3 importance button
 * @param {variable} importance1Colored importance colored button
 * @param {variable} importance2Colored importance colored button
 * @param {variable} importance3Colored importance colored button
 */
function setImportanceButtons(
  importance1,
  importance2,
  importance3,
  importance1Colored,
  importance2Colored,
  importance3Colored
) {
  importance1.classList.remove("d-none");
  importance1Colored.classList.add("d-none");
  importance2.classList.remove("d-none");
  importance2Colored.classList.add("d-none");
  importance3.classList.remove("d-none");
  importance3Colored.classList.add("d-none");
}

/**
 *
 * Render the contacts on the task and get it from backend
 *
 * @param {array} invateNewContactName arry of all contacts invated or selected
 * @param {number} id of the seltected contact
 */
async function renderContactsAddTask(invateNewContactName, id) {
  let dropdown = document.getElementById("contacts-drop-down");
  contacts = (await JSON.parse(backend.getItem("contacts"))) || [];
  contacts.sort((a, b) => (a.name > b.name ? 1 : -1));
  loopForContacts(contacts, dropdown, id);
  checkedSetting(invateNewContactName);
}

function loopForContacts(contacts, dropdown, id) {
  for (let i = 0; i < contacts.length; i++) {
    const element = contacts[i];
    if (dropdown == null) {
      dropdown = document.getElementById("contacts-drop-down-edit");
    }
    dropdown.innerHTML += generateHTMLcontactsBoard(element, i);
  }
}

/**
 * This function is to render the contacts direct on the task
 *
 * @param {number} i
 * @param {number} id
 */
async function addContactToTaskBoard(i, id) {
  let contact = document.getElementById("contacts-checkbox" + i).value;
  getCheckboxValue(contact);

  checkSelectedContactsAddTask(contact);
  await safeEdit(undefined, selectedContacts);
  contactsOnTask = selectedContacts;
  renderContactsSelection(selectedContacts);
}

/**
 * This function is to check if the contact must remove or added
 *
 * @param {string} contact
 */
function checkSelectedContactsAddTask(contact) {
  if (selectedContacts.indexOf(contact) > -1) {
    let index = selectedContacts.indexOf(contact);
    selectedContacts.splice(index, 1);
  } else if (selectedContacts.indexOf(contact) == -1) {
    selectedContacts.push(contact);
  }
}

/**
 * This function is to check and set documents
 *
 * @param {variable} cBox document to manipulated
 * @param {variable} addTask to check if d none
 * @returns variable html document
 */
function cBoxSetting(cBox, addTask) {
  if (
    cBox == null ||
    cBox == undefined ||
    addTask.classList.contains("d-none")
  ) {
    cBox = document.getElementById("invite_contacts_select_edit");
  }
  return cBox;
}

/**
 * This function will set the arrays right
 *
 * @param {array} inviteContacts
 * @param {array} currentContacts
 * @param {string} contactsShow
 * @returns array of invated contacts
 */
function setConatctShow(inviteContacts, currentContacts, contactsShow) {
  for (let i = 0; i < contactsShow.length; i++) {
    const current = contactsShow[i];
    for (let j = 0; j < currentContacts.length; j++) {
      const contactData = currentContacts[j]["name"];
      if (contactData == current) {
        inviteContacts.push(currentContacts[j]);
      }
    }
  }
  return inviteContacts;
}

/**
 * This function will check the contacts formand transsmitted to setContact
 *
 * @param {array} contacts
 */
async function renderContactsSelection(contacts) {
  contacts = checkContactsIfEmpty(contacts);

  let inviteContacts = [];
  let changedColorForDots = [];
  let addTask = document.getElementById("add_task");
  let cBox = document.getElementById("invite_contacts_select");
  cBox = cBoxSetting(cBox, addTask);
  let currentContacts = await JSON.parse(backend.getItem("contacts"));
  let contactsShow = contacts;

  invateContacts = setConatctShow(
    inviteContacts,
    currentContacts,
    contactsShow
  );

  cBox.innerHTML = "";
  setColorForDots(inviteContacts, cBox);
}

/**
 * This function is to check how many contacts are invated on a task
 *
 * @param {array} inviteContacts array of contacts
 * @param {variable} cBox document wich get manipulated
 */
function setColorForDots(inviteContacts, cBox) {
  if (inviteContacts.length > 2) {
    moreThanTwoContactsSmallView(inviteContacts, cBox);
  } else if (inviteContacts.length == 2) {
    twoContactsSmallView(invateContacts, cBox);
  } else {
    oneContactSmallView(invateContacts, cBox);
  }
}

/**
 * If one contact to render in small view
 *
 * @param {array} inviteContacts array of contacts
 * @param {variable} cBox document wich get manipulated
 */
function oneContactSmallView(inviteContacts, cBox) {
  for (let i = 0; i < inviteContacts.length; i++) {
    cBox.innerHTML += `<p class="invate-contact font-contact" style="background-color: ${inviteContacts[i]["color"]};">${inviteContacts[i]["firstLetters"]}</p>`;
  }
}

/**
 * If two contact to render in small view
 *
 * @param {array} inviteContacts array of contacts
 * @param {variable} cBox document wich get manipulated
 */
function twoContactsSmallView(inviteContacts, cBox) {
  for (let i = 0; i < inviteContacts.length; i++) {
    cBox.innerHTML += `<p class="invate-contact font-contact" style="background-color: ${inviteContacts[i]["color"]};">${inviteContacts[i]["firstLetters"]}</p>`;
  }
}

/**
 * If more than two contact to render in small view
 *
 * @param {array} inviteContacts array of contacts
 * @param {variable} cBox document wich get manipulated
 */
function moreThanTwoContactsSmallView(inviteContacts, cBox) {
  for (let i = 0; i < 2; i++) {
    cBox.innerHTML += `<p class="invate-contact font-contact" style="background-color: ${inviteContacts[i]["color"]};">${inviteContacts[i]["firstLetters"]}</p>`;
  }
  changedColorForDots = "#FFAA00";
  cBox.innerHTML += `<p class="invate-contact font-contact" style="background-color: ${changedColorForDots};">...</p>`;
}

/**
 *
 * @param {array} contacts
 * @returns the contact without an empty index
 */
function checkContactsIfEmpty(contacts) {
  if (contacts[0] == "") {
    contacts.splice(0, 1);
  }
  if (selectedContacts.length > 0) {
    if (selectedContacts[0] == "") {
      selectedContacts.splice(0, 1);
    }
  }
  return contacts;
}

/**
 * This function will fill the right categroy and transmitted to render the right categroy
 * @param {string} category
 */
function fillCategory(category) {
  let categoryField = document.getElementById("select-category");

  if (category == "sales") {
    fillSales(categoryField);
  } else if (category == "backoffice") {
    fillBackoffice(categoryField);
  } else {
    fillNewCategory(categoryField);
  }
}

function fillNewCategory(categoryField) {
  categoryField.innerHTML = "";
  categoryField.innerHTML += setCategoryToNewCategory(
    categoryName,
    categoryColorTrue
  );
  openCategoriesToSelect();
}

function fillBackoffice(categoryField) {
  categoryField.innerHTML = "";
  categoryField.innerHTML += setCategoryToBackoffice();
  openCategoriesToSelect();
  categoryColor = "#22bfc7";
}

function fillSales(categoryField) {
  categoryField.innerHTML = "";
  categoryField.innerHTML += setCategoryToSales();
  openCategoriesToSelect();
  categoryColor = "#df1c9f";
}

function createNewCategory() {
  let category_input = document.getElementById("new-category-input");
  let dropdown = document.getElementById("categories-drop-down");
  let category_content = document.getElementById("new-category-content");
  let dropdown_arrow = document.getElementById("drop-down-arrow-categories");
  let category_accept = document.getElementById("new-category-accept");

  category_input.value = "";
  dropdown.classList.add("d-none");
  category_input.classList.remove("d-none");
  category_content.classList.remove("d-none");
  dropdown_arrow.classList.add("d-none");
  category_accept.classList.remove("d-none");
}

/**
 * This function will reset the category section after select one
 */
function goBackToSelectCategory() {
  let category_input = document.getElementById("new-category-input");
  let category_content = document.getElementById("new-category-content");
  let dropdown_arrow = document.getElementById("drop-down-arrow-categories");
  let category_accept = document.getElementById("new-category-accept");
  let select = document.getElementById("select-category");

  category_input.classList.add("d-none");
  category_content.classList.add("d-none");
  dropdown_arrow.classList.remove("d-none");
  category_accept.classList.add("d-none");
  select.innerHTML = "Select task category";
  categoryColor = "";
  categoryColorTrue = "";
}

/**
 * This function will add a new generated category
 */
function addNewCategory() {
  let category_input = document.getElementById("new-category-input");
  let category_content = document.getElementById("new-category-content");
  let dropdown_arrow = document.getElementById("drop-down-arrow-categories");
  let category_accept = document.getElementById("new-category-accept");
  let select = document.getElementById("select-category");

  checkIfNewCategoryPossible(
    category_input,
    category_content,
    dropdown_arrow,
    category_accept,
    select
  );
  allFieldsFilled();
}

function checkIfNewCategoryPossible(
  category_input,
  category_content,
  dropdown_arrow,
  category_accept,
  select
) {
  if (category_input.value == "") {
    showErrorCategory();
    setTimeout(showErrorCategory, 1235);
    return;
  }
  if (categoryColor == undefined) {
    showErrorColor();
    setTimeout(showErrorColor, 1235);
  } else {
    createNewCategory(
      category_input,
      category_content,
      dropdown_arrow,
      category_accept,
      select
    );
  }

  function createNewCategory(
    category_input,
    category_content,
    dropdown_arrow,
    category_accept,
    select
  ) {
    categoryName = category_input.value;
    category_input.classList.add("d-none");
    category_content.classList.add("d-none");
    dropdown_arrow.classList.remove("d-none");
    category_accept.classList.add("d-none");
    select.innerHTML = "";
    select.innerHTML = generateHTMLnewCategoryNameAndColor(
      categoryName,
      categoryColorTrue
    );
    newCategories.push(categoryName, categoryColor, categoryColorTrue);
    renderNewCategories(categoryName, categoryColorTrue);
  }
}

/**
 * Reset the colors that will show as an option to select
 */
function categorySelectReset() {
  let categoryColorsList = [
    "turquoise",
    "red",
    "green",
    "orange",
    "pink",
    "blue",
  ];

  resetCategoryColorSelect(categoryColorsList);
}

function resetCategoryColorSelect(categoryColorsList) {
  for (let i = 0; i < categoryColorsList.length; i++) {
    const element = categoryColorsList[i];
    let categoryColorId = document.getElementById(`category-color-${element}`);
    categoryColorId.classList.remove("select-new-category-color");
  }
}

/**
 * If not correct input
 */
function showErrorCategory() {
  let messageInput = document.getElementById("error_value_cat");
  messageInput.classList.toggle("d-none");
}

function showErrorColor() {
  let messageColor = document.getElementById("error_value_col");
  messageColor.classList.toggle("d-none");
}

/**
 * Set the new category color
 *
 * @param {variable} color of the new category
 */
function selectCategoryColor(color) {
  categorySelectReset();
  showCategoryColor(color);
  if (containsCategoryColor(color)) {
    categoryColor = color;
    categoryColorTrue = color;
  } else {
    categoryColor = "";
    categoryColorTrue = "";
  }
}
