let tasks = [];
let selectedContacts = [];
let importance;
let subtasks = [];
let selectedSubtasks = [];
let newCategories = [];
let categoryName;
let categoryColor;
let categoryColorTrue;
let contacts;
let newContactAddTaskActive = true;
let urgentCounter;
let importance1;
let importance2;
let importanc3;
let importance1Colored;
let importance2Colored;
let importance3Colored;
let contactsRendered = false;
let email;

setURL("https://join.goekay-sahin.de/smallest_backend_ever/");

/**
 * Init function to set all syncron
 */
async function init() {
  await includeHTML();
  checkSize();
  await renderContacts();
  hoverAddTaskHtml();
  await downloadFromServer();
  tasks = (await JSON.parse(backend.getItem("tasks"))) || [];
  contacts = (await JSON.parse(backend.getItem("contacts"))) || [];
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("select-date").setAttribute("min", today);
  getUrgentCounter();
  setTimeout(setImportanceButton, 250);
}

/**
 * This Function is use to get the urgentCounter from backend in a global variable
 */
async function getUrgentCounter() {
  urgentCounter = (await backend.getItem("urgentCounter")) || 0;
  urgentCounter = parseInt(urgentCounter);
}

/**
 * This function is to check if contact must be checked
 * @returns {boolean}
 */
function controlContactCheckbox() {
  let list = document.getElementsByClassName("contacts-list-elem");
  for (let i = 0; i < list.length; i++) {
    element = document.getElementById(`contacts-checkbox-${i}`);
    if (element == null) {
      return;
    }
    if (element.checked) {
      return true;
    }
  }
  return false;
}

/**
 * This function is to check if date is set or not
 * @returns {boolean}
 */
function controlDateInput() {
  if (document.getElementById("select-date").value.length > 0) {
    return true;
  } else {
    return false;
  }
}

/**
 * This function is to check if a Importance button is selected
 * @returns {boolean}
 */
function controlImportanceBtn() {
  for (let i = 1; i < 4; i++) {
    let importanceBtn = document.getElementById(`importance-button${i}`);
    if (importanceBtn.style.display.includes("none")) {
      return true;
    }
  }
  return false;
}

/**
 * This function is to check if something is writen in description
 * @returns {boolean}
 */
function controlDescriptionInput() {
  let description = document.getElementById("description-input").value;
  if (description.length > 0) {
    return true;
  } else {
    return false;
  }
}

/**
 * This function returns if a category is settet or if still select-category stands there
 * @returns {boolean}
 */
function controlCategorySelect() {
  let category = document
    .getElementById("select-category")
    .innerHTML.includes("Select task");
  return !category;
}

/**
 * This function is used to clear the small contact view after creating a Task
 */
function clearContacts() {
  document.getElementById("contacts_box").innerHTML = "";
}

/**
 * This function is control if all fields are filled and activate the creat task button
 * @returns {boolean}
 */
function checkInpAddTask() {
  let title = document.getElementById("title-input").value.length > 0;
  let contacts = controlContactCheckbox();
  let date = controlDateInput();
  let importanceBtn = controlImportanceBtn();
  let description = controlDescriptionInput();
  let category = controlCategorySelect();
  /* let category =  */
  if (title && contacts && date && importanceBtn && description && category) {
    activateCreatTaskButton();
    return true;
  } else {
    deactivateCreatTaskButton();
    return false;
  }
}

setInterval(() => {
  checkInpAddTask();
}, 250);

/**
 * This function will add the blue color to the creat task button
 */
function activateCreatTaskButton() {
  let btn = document.getElementById("create-task-btn");
  btn.classList.add("creat-task-btn-manual-hover");
}

/**
 * This function will remove the blue color and let it ingray
 */
function deactivateCreatTaskButton() {
  let btn = document.getElementById("create-task-btn");
  btn.classList.remove("creat-task-btn-manual-hover");
}

/**
 * This function is to creat a new task, it checks if all is filled and than set ist to creatNewTask
 */
async function addToTasks() {
  let contactsSmalView = document.getElementById("contacts_box");
  let category = document.getElementById("select-category");
  let title = document.getElementById("title-input");
  let date = document.getElementById("select-date");
  let description = document.getElementById("description-input");

  if (checkInpAddTask()) {
    await creatNewTask(title, date, category, description, contactsSmalView);
  } else {
    return;
  }
}

/**
 * This function is used to set the var's that global are created
 */
function setImportanceButton() {
  importance1 = document.getElementById("importance-button1");
  importance2 = document.getElementById("importance-button2");
  importanc3 = document.getElementById("importance-button3");
  importance1Colored = document.getElementById("importance-button1-colored");
  importance2Colored = document.getElementById("importance-button2-colored");
  importance3Colored = document.getElementById("importance-button3-colored");
}

/**
 * This function is used to creat the task itself, and show the animation, check urgent importance for summary and reset
 * the inputs. At the end it Save the urgent counter and the tasks
 */
async function creatNewTask(
  title,
  date,
  category,
  description,
  contactsSmalView
) {
  triggerAddedToBoardButton();
  checkImportance();

  let task = creatTask(title, date, category, description);
  selectedContacts = [];
  tasks.push(task);
  resetTasksInputs(
    title,
    selectedContacts,
    date,
    categoryColor,
    selectedSubtasks
  );
  clearContacts();
  resetImportanceButtons();
  clearSubtasksAddTask();
  contactsSmalView.innerHTML = "";

  await saveCounterAndTasks(tasks);
}

/**
 * This function reset the importace buttons from colored-clicked to uncolored-unclicked
 */
function resetImportanceButtons() {
  for (let i = 1; i < 4; i++) {
    const btn = document.getElementById(`importance-button${i}`);
    btn.style = "";
  }
  for (let j = 1; j < 4; j++) {
    const btn = document.getElementById(`importance-button${j}-colored`);
    btn.style = "display: none";
  }
}

/**
 * This function is to save the data in backend
 * @param {array} tasks that will created, urgentCounter set and saved in backend
 */
async function saveCounterAndTasks(tasks) {
  await backend.setItem("tasks", JSON.stringify(tasks));
  await backend.setItem("urgentCounter", JSON.stringify(urgentCounter));
}

/**
 * The creation of the task seperat in a small function
 * @param {variable} title of the task wich will created
 * @param {variable} date of the task wich will created
 * @param {variable} category of the task wich will created
 * @param {variable} description of the task wich will created
 * @returns
 */
function creatTask(title, date, category, description) {
  return {
    title: title.value,
    contacts: selectedContacts,
    date: date.value,
    category: category.innerText,
    categorycolor: categoryColor,
    importance: importance,
    description: description.value,
    subtasks: selectedSubtasks,
  };
}

/**
 * Reset the subtask in add task if needed
 * @returns if no value to clear
 */
function clearSubtasksAddTask() {
  let subs = document.getElementById("subtask-content");
  if (subs == undefined) {
    return;
  } else {
    subs.innerHTML = "";
  }
}

/**
 * This funtion set the global var ++
 */
function checkImportance() {
  if (importance == "urgent") {
    urgentCounter++;
  }
}

/**
 * This function change the background if needed
 */
function hoverAddtaskHtml() {
  let addTask = document.getElementById("add-task-html");
  let addTaskBG = document.getElementById("addtask_bg");

  addTask.classList.add("section-background-normal");
  addTaskBG.classList.remove("section-background");
}

/**
 * This function is to respons with bg hover
 */
function hoverAddtaskRespons() {
  let boardBG = document.getElementById("board_bg");
  let addTaskBG = document.getElementById("addtask_bg");

  boardBG.classList.remove("section-background-normal");
  addTaskBG.classList.add("section-background");
}

/**
 * This function shows the added animation
 */
function triggerAddedToBoardButton() {
  let taskToBoard = document.getElementById("task-added-to-board");

  taskToBoard.classList.remove("d-none");
  setTimeout(resetAddedButton, 3000);
}

/**
 * This function hide the added animation
 */
function resetAddedButton() {
  let taskToBoard = document.getElementById("task-added-to-board");

  taskToBoard.classList.add("d-none");
}

/**
 * This function will reset all the inputs from title to subtasks
 *
 * @param {title} title title of add task
 * @param {date} date date wich will reset
 */
function resetTasksInputs(
  title,
  selectedContacts,
  date,
  categoryColor,
  selectedSubtasks
) {
  let descriptionInput = document.getElementById("description-input");
  let category = document.getElementById("select-category");

  title.value = "";
  selectedContacts = [];
  date.value = "";
  categoryColor = "";
  categoryColorTrue = "";
  descriptionInput.value = "";
  selectedSubtasks = [];
  category.innerHTML = resetCategory();
  resetCheckboxes();
}

/**
 * This function gets the document to reset the importance button
 *
 * @param {variable} importance1 button urgent
 * @param {variable} importance2 button medium
 * @param {variable} importanc3 button low
 * @param {variable} importance1Colored button urgent colored clicked
 * @param {variable} importance2Colored button medium colored clicked
 * @param {variable} importance3Colored button low colored clicked
 */
function setButtonsDnone(
  importance1,
  importance2,
  importanc3,
  importance1Colored,
  importance2Colored,
  importance3Colored
) {
  importance1.style = "display: flex;";
  importance1Colored.style = "display: none;";
  importance2.style = "display: flex;";
  importance2Colored.style = "display: none;";
  importanc3.style = "display: flex;";
  importance3Colored.style = "display: none;";
}

function hoverAddTaskHtml() {
  let addTaskHtml = document.getElementById("add-task-html");
  addTaskHtml.classList.add("add_task_html");
}

/**
 * This function is used to check the screen size
 */
function checkSize() {
  let size = window.innerWidth;
  if (size <= 1024) {
    sidebarTabled();
    hoverAddtaskRespons();
  } else if (size > 1024) {
    enableSidebar();
    hoverAddtaskHtml();
  }
}
