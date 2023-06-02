let tasks = [];
let selectedContacts = [];
let subtasks = [];
let selectedSubtasks = [];
let newCategories = [];
let categoryName;
let categoryColor;
let categoryColorTrue;
let importance;
let newContactAddTaskActive = true;
let showCurrentUserNameForSummery;
let urgentCounter;
let contacts;
let exist;
let currentContacts = [];
let filled = false;
let checkedEdit = [];
let checkedList = [];
let contactsOnTask = [];
let descript = 0;
let subCounterAdd = 0;
let email;
let checkedIndex = [];

setURL(
  "https://goekay-nuri-sahin.developerakademie.com/join/smallest_backend_ever"
);

/**
 * This function is to get the urgentcounter from backend
 */
async function getUrgentCounter() {
  urgentCounter = (await backend.getItem("urgentCounter")) || 0;
  urgentCounter = parseInt(urgentCounter);
}

/**
 * This function is to get the contacts from backend
 */
async function getCurrentContacts() {
  currentContacts = await JSON.parse(backend.getItem("contacts"));
}

/**
 * This function checks wich map must be returnt
 *
 * @param {string} section of the map
 * @returns map wich get from string param
 */
function checkWichMap(section) {
  let map;
  if (section.includes("todo")) {
    map = todosMap;
  } else if (section.includes("progress")) {
    map = progressesMap;
  } else if (section.includes("feedback")) {
    map = feedbacksMap;
  } else if (section.includes("done")) {
    map = donesMap;
  }
  return map;
}

/**
 * This function will add the new created task and reset all the inputs
 *
 * @param {string} section where the task will be created
 * @returns if not complety all inputs filled
 */
async function addToTasks(section) {
  if (filled == false) {
    return;
  }
  load();
  let task = await setNewTask();
  selectedContacts = [];
  tasks.push(task);

  resetImportanceButtons();
  document.getElementById("subtask-content").innerHTML = "";
  await saveTaskAndCounter();
  tasks = [];
  resetAddTask(section);
}

/**
 * This will start the animation and set the task
 *
 * @param {string} section wich map will used
 */
function resetAddTask(section) {
  closeAddTask();
  setTasks(section);
  setTimeout(activateDragAndDrop, 400); /* setCards(); */
  setTimeout(load, 500);
}

/**
 * Save the task and counter in backend
 */
async function saveTaskAndCounter() {
  await backend.setItem("urgentCounter", JSON.stringify(urgentCounter));
  await backend.setItem("tasks", JSON.stringify(tasks));
}

/**
 * This function is used to set teh new task and start the resest inputs function and transmitted the document that need to reset
 *
 * @returns task wich created
 */
async function setNewTask() {
  let btn = document.getElementById("submit-btn");
  let title = document.getElementById("title-input");
  let category = document.getElementById("select-category");
  let date = document.getElementById("select-date-task");
  let description = document.getElementById("description-input");
  let contactsData = await contactToSave(selectedContacts);

  selectedSubtasks = subtasks;
  subtaskChecked();
  btn.classList.remove("opacity");

  let task = creatNewTask(
    title,
    contactsData,
    date,
    category,
    importance,
    description
  );
  resetTasksInputs(
    title,
    selectedContacts,
    date,
    categoryColor,
    description,
    selectedSubtasks
  );
  return task;
}

function creatNewTask(
  title,
  contactsData,
  date,
  category,
  importance,
  description
) {
  return {
    title: title.value,
    contacts: contactsData[0],
    letters: contactsData[2],
    colors: contactsData[1],
    date: date.value,
    category: category.innerText,
    categorycolor: categoryColor,
    importance: importance,
    description: description.value,
    subtasks: selectedSubtasks,
    subtaskCheck: checkedList,
  };
}

/**
 * Check the subtrask after creating
 */
function subtaskChecked() {
  subtasks.forEach((task, i) => {
    checkedList.push(document.getElementById(`subtasks-checkbox-${i}`).checked);
  });
}

/**
 * This function returns the data of the contacts
 *
 * @param {array} selectedContacts of the selectedContacts
 * @returns contacts data like names colors and letters
 */
async function contactToSave(selectedContacts) {
  let names = [];
  let colors = [];
  let letters = [];
  let list = await JSON.parse(backend.getItem("contacts"));
  checkColorAndLetter(selectedContacts, list, names, colors, letters);
  let data = [names, colors, letters];
  return data;
}

/**
 * This function transmitted the contact data to compare and creat
 *
 * @param {array} selectedContacts selceted contacts
 * @param {array} list of conatcts
 * @param {array} names name of contacts
 * @param {array} colors color of contacts
 * @param {array} letters letter of contacts
 */
function checkColorAndLetter(selectedContacts, list, names, colors, letters) {
  for (let j = 0; j < selectedContacts.length; j++) {
    const selected = selectedContacts[j];
    compareColorAndLetter(selected, list, names, colors, letters);
  }
}

/**
 * Transmitted every singel the data in array
 *
 * @param {array} selected selceted contacts
 * @param {array} list of conatcts
 * @param {array} names name of contacts
 * @param {array} colors color of contacts
 * @param {array} letters letter of contacts
 */
function compareColorAndLetter(selected, list, names, colors, letters) {
  for (let i = 0; i < list.length; i++) {
    const element = list[i];
    selectColorAndLetter(element, selected, names, colors, letters);
  }
}

/**
 * Checks color and letters
 *
 * @param {string} element
 * @param {array} selected
 * @param {array} names
 * @param {array} colors
 * @param {array} letters
 */
function selectColorAndLetter(element, selected, names, colors, letters) {
  if (element["name"] == selected) {
    names.push(element["name"]);
    if (element["color"] == undefined) {
      colors.push(element["colors"]);
    } else {
      colors.push(element["color"]);
    }
    if (element["firstLetters"] == undefined) {
      letters.push(element["firstletter"]);
    } else {
      letters.push(element["firstLetters"]);
    }
  }
}

/**
 * Checks if all fields have a value
 */
function allFieldsFilled() {
  let title = document.getElementById("title-input");
  let description = document.getElementById("description-input");
  let category = document.getElementById("select-category"); // .innerHTML.includes('Select')
  let date = document.getElementById("select-date-task"); // value
  contacts = selectedContacts; // length

  let result = "";
  if (fieldsFilled(title, description, category, date, contacts)) {
    setTimeout(allFieldsFilled, 250);
  }
  if (fieldsFilled(title, description, category, date, contacts)) {
    buttonImportanceCheck();
  } else {
    let btn = document.getElementById("submit-btn");
    btn.classList.add("opacity");
  }
}

/**
 * This function returns if all filed filled
 *
 * @param {string} title title of the task
 * @param {string} description of the task
 * @param {string} category of the task
 * @param {number} date of the task
 * @returns boolean
 */
function fieldsFilled(title, description, category, date, contacts) {
  if (
    title.value.length > 0 &&
    description.value.length > 0 &&
    !category.innerHTML.includes("Select") &&
    date.value.length > 0 &&
    contacts.length >= 1
  ) {
    filled = true;
  } else {
    filled = false;
  }
  return (
    title.value.length > 0 &&
    description.value.length > 0 &&
    !category.innerHTML.includes("Select") &&
    date.value.length > 0 &&
    contacts.length >= 1
  );
}

/**
 * Transmitted the documents to check
 */
function buttonImportanceCheck() {
  let buttonUrgent = document.getElementById("importance-button1");
  let buttonMedium = document.getElementById("importance-button2");
  let buttonLow = document.getElementById("importance-button3");
  let result;

  if (checkButtonImportanceAddTask(buttonUrgent, buttonMedium, buttonLow)) {
    importanceRemoveOpa();
  } else {
    importanceAddOpa();
  }
}

/**
 * Add a class to the submit button
 */
function importanceAddOpa() {
  let btn = document.getElementById("submit-btn");
  btn.classList.add("opacity");
}

/**
 * Removes the class from submit button
 */
function importanceRemoveOpa() {
  let btn = document.getElementById("submit-btn");
  btn.classList.remove("opacity");
  filled = true;
}

/**
 * This function will return if the buttons contains d-none in class
 *
 * @param {variable} buttonUrgent importance button
 * @param {variable} buttonMedium importance button
 * @param {Variable} buttonLow importance button
 * @returns boolean
 */
function checkButtonImportanceAddTask(buttonUrgent, buttonMedium, buttonLow) {
  return (
    buttonUrgent.classList.contains("d-none") ||
    buttonMedium.classList.contains("d-none") ||
    buttonLow.classList.contains("d-none")
  );
}

/**
 * This function add the class d-none to the task added button
 */
function resetAddedButton() {
  let result = allFieldsFilled();
  if (result) {
    document.getElementById("task-added-to-board").classList.add("d-none");
  }
}

/**
 * This function is to reset the inputs
 *
 * @param {variable} title title of the task
 * @param {array} selectedContacts array of selected
 * @param {number} date selceted date
 * @param {number} categoryColor color of the category
 * @param {string} description the description of the task
 * @param {array} selectedSubtasks and the selected subtask
 */
function resetTasksInputs(
  title,
  selectedContacts,
  date,
  categoryColor,
  description,
  selectedSubtasks
) {
  title.value = "";
  selectedContacts = [];
  date.value = "";
  categoryColor = "";
  categoryColorTrue = "";
  description.value = "";
  selectedSubtasks = [];
  document.getElementById("select-category").innerHTML = resetCategory();
}

function resetImportanceButtons() {
  let importance1 = document.getElementById("importance-button1");
  let importance2 = document.getElementById("importance-button2");
  let importance3 = document.getElementById("importance-button3");
  let importance1Colored = document.getElementById(
    "importance-button1-colored"
  );
  let importance2Colored = document.getElementById(
    "importance-button2-colored"
  );
  let importance3Colored = document.getElementById(
    "importance-button3-colored"
  );

  setImportanceButtons(
    importance1,
    importance2,
    importance3,
    importance1Colored,
    importance2Colored,
    importance3Colored
  );
}

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

/**
 * Check if contains allready
 *
 * @param {number} color of the category
 * @returns boolean
 */
function containsCategoryColor(color) {
  let newCategory = document.getElementById("category-color-" + color);

  return newCategory.classList.contains("select-new-category-color");
}

/**
 * This wil make the category visible
 *
 * @param {number} color
 */
function showCategoryColor(color) {
  let newCategory = document.getElementById("category-color-" + color);

  newCategory.classList.toggle("select-new-category-color");
}

function renderNewCategories(categoryName, categoryColorTrue) {
  let cDropDown = document.getElementById("categories-drop-down");
  cDropDown.innerHTML += generateHTMLcategory(categoryName, categoryColorTrue);
}

/**
 * Make it possible by changing input field to add subtask
 */
function createNewSubtask() {
  let plus = document.getElementById("plus-icon");
  let accept = document.getElementById("new-subtask-accept");
  plus.classList.add("d-none");
  accept.classList.remove("d-none");
}

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
  selectedContacts.push(invateNewContactName);
  await invateCreateNewContact(invateNewContactName, email, id);
  setTimeout(contactsCheckboxUpdate, 400, id);

  getCheckboxValue(invateNewContactName);
  renderContactsSelection(invateNewContactName);
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
  renderContactsSelection(contacts);
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

function setCheckboxValue(checkedIndex, checkedEdit) {
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
  selectedContacts.push(invateNewContactName);
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
      firstLetters = firstLetters.toUpperCase();
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
