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

setURL(
  "https://goekay-nuri-sahin.developerakademie.com/join/smallest_backend_ever"
);

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

/**
 * This function checks if sidebar must show on responsive or not
 *
 * @returns {boolean}
 */
function sidebarTabled() {
  let sidebar = document.getElementById("sidebar");
  let helpBtn = document.getElementById("help-section-btn");
  let headerRes = document.getElementById("header-name-resp");
  let creatRes = document.getElementById("create-btn-responsive");

  sidebar.classList.remove("sidebar");
  sidebar.classList.add("tablet-sidebar");
  helpBtn.classList.add("d-none");
  headerRes.classList.remove("d-none");

  if (creatRes == null) {
    return;
  } else {
    creatRes.classList.remove("d-none");
  }
}

/**
 * This function is to set the sidebar buttons in a desktop version or not
 *
 * @returns {none} return to get out of function if creatRes is null
 */
function enableSidebar() {
  let sidebar = document.getElementById("sidebar");
  let helpBtn = document.getElementById("help-section-btn");
  let headerRes = document.getElementById("header-name-resp");
  let creatRes = document.getElementById("create-btn-responsive");

  sidebar.classList.add("sidebar");
  sidebar.classList.remove("tablet-sidebar");
  helpBtn.classList.remove("d-none");
  headerRes.classList.add("d-none");
  if (creatRes == null) {
    return;
  } else {
    creatRes.classList.add("d-none");
  }
}

/**
 * This function is used to load the contacts and sort it after that it start the rendering
 */
async function renderContacts() {
  contacts = (await JSON.parse(backend.getItem("contacts"))) || [];

  // list contacts in alphabetical order
  contacts.sort((a, b) => (a.name > b.name ? 1 : -1));

  for (let i = 0; i < contacts.length; i++) {
    const element = contacts[i];
    document.getElementById("contacts-drop-down").innerHTML +=
      generateHTMLcontacts(element, i);
  }
}

function clearContactsBeforeRendering() {
  for (let i = 0; i < contacts.length; i++) {
    const element = contacts[i];
    document.getElementById(`selected-contact-${i}`).parentElement.remove();
  }
}

/**
 * Thi function checks if conatct is in selected if so remove else add used for both ways
 *
 * @param {number} i is the number of the id used for contacts-checkbox-" + i
 */
function addContactToTask(i) {
  let contact = document.getElementById("contacts-checkbox-" + i).value;

  if (selectedContacts.indexOf(contact) > -1) {
    let index = selectedContacts.indexOf(contact);
    selectedContacts.splice(index, 1);
  } else {
    selectedContacts.push(contact);
  }
  renderContactsSelection(contacts);
}

/**
 * This function is used to fill the category of sales
 *
 * @param {variable} categoryField is the document that will be manipulated
 */
function fillSales(categoryField) {
  categoryField.innerHTML = "";
  categoryField.innerHTML += setCategoryToSales();
  openCategoriesToSelect();
  categoryColor = "#df1c9f";
}

/**
 * This function is used to fill the category of backoffice
 *
 * @param {variable} categoryField is the document that will be manipulated
 */
function fillBackoffice(categoryField) {
  categoryField.innerHTML = "";
  categoryField.innerHTML += setCategoryToBackoffice();
  openCategoriesToSelect();
  categoryColor = "#22bfc7";
}

/**
 * This function is used to fill a random category
 *
 * @param {variable} categoryField is the document that will be manipulated
 */
function fillNewCategory(categoryField) {
  categoryField.innerHTML = "";
  categoryField.innerHTML += setCategoryToNewCategory(
    categoryName,
    categoryColorTrue
  );
  openCategoriesToSelect();
}

/**
 * This function make the decision in wich way it will be move on
 *
 * @param {variable} category show wich have been selected to move on in the right way
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

/**
 * This function shows the creat new category section
 */
function createNewCategory() {
  let categoryInp = document.getElementById("new-category-input");
  let categoryContent = document.getElementById("new-category-content");
  let dropdown = document.getElementById("drop-down-arrow-categories");
  let categoryAccept = document.getElementById("new-category-accept");

  categoryInp.value = "";
  openCategoriesToSelect();
  categoryInp.classList.remove("d-none");
  categoryContent.classList.remove("d-none");
  dropdown.classList.add("d-none");
  categoryAccept.classList.remove("d-none");
}

/**
 * This function is used to reset the category section
 */
function goBackToSelectCategory() {
  let categoryInp = document.getElementById("new-category-input");
  let categoryContent = document.getElementById("new-category-content");
  let dropdown = document.getElementById("drop-down-arrow-categories");
  let categoryAccept = document.getElementById("new-category-accept");
  let select = document.getElementById("select-category");

  categoryInp.classList.add("d-none");
  categoryContent.classList.add("d-none");
  dropdown.classList.remove("d-none");
  categoryAccept.classList.add("d-none");
  select.innerHTML = "Select task category";
  categoryColor = "";
  categoryColorTrue = "";
  categorySelectReset();
}

/**
 * This function set the variable and transmitted to the next function
 */
function addNewCategory() {
  let categoryInp = document.getElementById("new-category-input");
  let categoryContent = document.getElementById("new-category-content");
  let categoryAccept = document.getElementById("new-category-accept");
  let creatTask = document.getElementById("create-task-btn");
  let dropdown = document.getElementById("drop-down-arrow-categories");
  let select = document.getElementById("select-category");

  checkNewCategory(
    categoryInp,
    categoryContent,
    categoryAccept,
    creatTask,
    dropdown,
    select
  );
  categorySelectReset();
}

/**
 * Checks if by creation of new category is a name and a color defined
 *
 * @param {variable} categoryInp this is the document that gets manipulated
 * @param {variable} categoryContent this is the document that gets manipulated
 * @param {variable} categoryAccept this is the document that gets manipulated
 * @param {variable} creatTask this is the document that gets manipulated
 * @param {variable} dropdown this is the document that gets manipulated
 * @param {variable} select this is the document that gets manipulated
 */
function checkNewCategory(
  categoryInp,
  categoryContent,
  categoryAccept,
  creatTask,
  dropdown,
  select
) {
  if (categoryInp.value == "") {
    alert("Please select a new category name!");
    creatTask.disabled = true;
  } else if (categoryColor == undefined) {
    alert("Please select a new category color!");
    creatTask.disabled = true;
  } else {
    generateCategory(
      categoryInp,
      categoryContent,
      categoryAccept,
      creatTask,
      dropdown,
      select
    );
  }
}

/**
 *
 * This function will set and transmitted to render the new Category and  start rendering
 *
 * @param {variable} categoryInp vaule of the section
 * @param {variable} categoryContent vaule of the section
 * @param {variable} categoryAccept vaule of the section
 * @param {variable} creatTask vaule of the section
 * @param {variable} dropdown vaule of the section
 * @param {variable} select vaule of the section
 */
function generateNewCategory(
  categoryInp,
  categoryContent,
  categoryAccept,
  creatTask,
  dropdown,
  select
) {
  creatTask.disabled = false;
  categoryName = categoryInp.value;
  categoryInp.classList.add("d-none");
  categoryContent.classList.add("d-none");
  dropdown.classList.remove("d-none");
  categoryAccept.classList.add("d-none");

  select.innerHTML = "";
  select.innerHTML = generateHTMLnewCategoryNameAndColor(
    categoryName,
    categoryColor,
    categoryColorTrue
  );
}

/**
 *
 * This function will transmitted to set the new Category to render it
 *
 * @param {variable} categoryInp vaule of the section
 * @param {variable} categoryContent vaule of the section
 * @param {variable} categoryAccept vaule of the section
 * @param {variable} creatTask vaule of the section
 * @param {variable} dropdown vaule of the section
 * @param {variable} select vaule of the section
 */
function generateCategory(
  categoryInp,
  categoryContent,
  categoryAccept,
  creatTask,
  dropdown,
  select
) {
  generateNewCategory(
    categoryInp,
    categoryContent,
    categoryAccept,
    creatTask,
    dropdown,
    select
  );
  newCategories.push(categoryName, categoryColor, categoryColorTrue);
  renderNewCategories(categoryName, categoryColor, categoryColorTrue);
}

/**
 * This function will set a new color for new category
 *
 * @param {number} color hash number of color
 */
function selectCategoryColor(color) {
  categorySelectReset();
  let colorElement = document.getElementById("category-color-" + color);
  colorElement.classList.toggle("select-new-category-color");
  if (colorElement.classList.contains("select-new-category-color")) {
    categoryColor = color;
    categoryColorTrue = color;
  } else {
    categoryColor = "";
    categoryColorTrue = "";
  }
}

function categorySelectReset() {
  let categoryColorsList = [
    "turquoise",
    "red",
    "green",
    "orange",
    "pink",
    "blue",
  ];

  for (let i = 0; i < categoryColorsList.length; i++) {
    const element = categoryColorsList[i];
    let categoryColorId = document.getElementById(`category-color-${element}`);
    if (categoryColorId.classList.value.includes("select-new-category-color")) {
      categoryColorId.classList.remove("select-new-category-color");
    }
  }
}

/**
 * This function will get the name and color of the new created category and transmitted to render it
 *
 * @param {string} categoryName name of the new category
 * @param {string} categoryColor color of the new category
 */
function renderNewCategories(categoryName, categoryColor) {
  let dropdown = document.getElementById("categories-drop-down");

  dropdown.innerHTML += generateHTMLcategory(categoryName, categoryColor);
}

/**
 * This function will set the input field right to set a new subtask
 */
function createNewSubtask() {
  let plus = document.getElementById("plus-icon");
  let accept = document.getElementById("new-subtask-accept");

  plus.classList.add("d-none");
  accept.classList.remove("d-none");
}

/**
 * This function will started if new subtask is created it clear the input and start rendering in the bottom of the input
 */
function addSubtask() {
  let newSubtask = document.getElementById("add-subtask").value;
  let addSub = document.getElementById("add-subtask");
  let plus = document.getElementById("plus-icon");
  let accept = document.getElementById("new-subtask-accept");

  subtasks.push(newSubtask);
  if (selectedSubtasks.indexOf(newSubtask) == -1) {
    selectedSubtasks.push(newSubtask);
  }
  addSub.value = "";
  plus.classList.remove("d-none");
  accept.classList.add("d-none");
  renderSubtasks();
}

/**
 * Change the input field to set subtasks
 */
function backToSubtasks() {
  let plus = document.getElementById("plus-icon");
  let accept = document.getElementById("new-subtask-accept");
  let addSub = document.getElementById("add-subtask");

  plus.classList.remove("d-none");
  accept.classList.add("d-none");
  addSub.value = "";
}

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
