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

setURL("https://join.goekay-sahin.de/smallest_backend_ever");

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
  activateDragAndDrop();
}

/**
 * This will start the animation and set the task
 *
 * @param {string} section wich map will used
 */
function resetAddTask(section) {
  setTasks(section);
  activateDragAndDrop(); /* setCards(); */
  setTimeout(load, 500);
  closeAddTask();
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
  setTimeout(
    resetTasksInputs,
    400,
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
