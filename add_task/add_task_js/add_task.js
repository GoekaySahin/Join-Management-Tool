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

setURL(
  "https://goekay-nuri-sahin.developerakademie.com/join/smallest_backend_ever"
);

async function getUrgentCounter() {
  urgentCounter = (await backend.getItem("urgentCounter")) || 0;
  urgentCounter = parseInt(urgentCounter);
}

function controlContactCheckbox() {
  let list = document.getElementsByClassName("contacts-list-elem");
  for (let i = 0; i < list.length - 1; i++) {
    element = document.getElementById(`contacts-checkbox-${i}`);
    if (element.checked) {
      return true;
    }
    return false;
  }
}

function controlDateInput() {
  if (document.getElementById("select-date").value.length > 0) {
    return true;
  } else {
    return false;
  }
}

function controlImportanceBtn() {
  for (let i = 1; i < 4; i++) {
    let importanceBtn = document.getElementById(`importance-button${i}`);
    if (importanceBtn.style.display.includes("none")) {
      return true;
    }
  }
  return false;
}

function controlDescriptionInput() {
  let description = document.getElementById("description-input").value;
  if (description.length > 0) {
    return true;
  } else {
    return false;
  }
}

function controlCategorySelect() {
  let category = document
    .getElementById("select-category")
    .innerHTML.includes("Select task");
  return !category;
}

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

function activateCreatTaskButton() {
  let btn = document.getElementById("create-task-btn");
  btn.classList.add("creat-task-btn-manual-hover");
}

function deactivateCreatTaskButton() {
  let btn = document.getElementById("create-task-btn");
  btn.classList.remove("creat-task-btn-manual-hover");
}

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

function setImportanceButton() {
  importance1 = document.getElementById("importance-button1");
  importance2 = document.getElementById("importance-button2");
  importanc3 = document.getElementById("importance-button3");
  importance1Colored = document.getElementById("importance-button1-colored");
  importance2Colored = document.getElementById("importance-button2-colored");
  importance3Colored = document.getElementById("importance-button3-colored");
}

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
    description,
    selectedSubtasks
  );
  resetImportanceButtons();
  clearSubtasksAddTask();
  contactsSmalView.innerHTML = "";

  await saveCounterAndTasks(tasks);
}

async function saveCounterAndTasks(tasks) {
  await backend.setItem("tasks", JSON.stringify(tasks));
  await backend.setItem("urgentCounter", JSON.stringify(urgentCounter));
}

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

function clearSubtasksAddTask() {
  let subs = document.getElementById("subtask-content");
  if (subs == undefined) {
    return;
  } else {
    subs.innerHTML = "";
  }
}

function checkImportance() {
  if (importance == "urgent") {
    urgentCounter++;
  }
}

function hoverAddtaskHtml() {
  let addTask = document.getElementById("add-task-html");
  let addTaskBG = document.getElementById("addtask_bg");

  addTask.classList.add("section-background-normal");
  addTaskBG.classList.remove("section-background");
}

function hoverAddtaskRespons() {
  let boardBG = document.getElementById("board_bg");
  let addTaskBG = document.getElementById("addtask_bg");

  boardBG.classList.remove("section-background-normal");
  addTaskBG.classList.add("section-background");
}

function triggerAddedToBoardButton() {
  let taskToBoard = document.getElementById("task-added-to-board");

  taskToBoard.classList.remove("d-none");
  setTimeout(resetAddedButton, 3000);
}

function resetAddedButton() {
  let taskToBoard = document.getElementById("task-added-to-board");

  taskToBoard.classList.add("d-none");
}

function resetTasksInputs(title, date) {
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

function hoverAddTaskHtml() {
  document.getElementById("add-task-html").classList.add("add_task_html");
}

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

function fillCategory(category) {
  let categoryField = document.getElementById("select-category");

  if (category == "sales") {
    categoryField.innerHTML = "";
    categoryField.innerHTML += setCategoryToSales();
    openCategoriesToSelect();
    categoryColor = "#df1c9f";
  } else if (category == "backoffice") {
    categoryField.innerHTML = "";
    categoryField.innerHTML += setCategoryToBackoffice();
    openCategoriesToSelect();
    categoryColor = "#22bfc7";
  } else {
    categoryField.innerHTML = "";
    categoryField.innerHTML += setCategoryToNewCategory(
      categoryName,
      categoryColorTrue
    );
    openCategoriesToSelect();
  }
}

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

function generateCategory(
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
  newCategories.push(categoryName, categoryColor, categoryColorTrue);
  renderNewCategories(categoryName, categoryColor, categoryColorTrue);
}

function selectCategoryColor(color) {
  categorySelectReset();
  document
    .getElementById("category-color-" + color)
    .classList.toggle("select-new-category-color");
  if (
    document
      .getElementById("category-color-" + color)
      .classList.contains("select-new-category-color")
  ) {
    categoryColor = color;
    categoryColorTrue = color;
  } else {
    categoryColor = "";
    categoryColorTrue = "";
  }
}

function categorySelectReset() {
  let categoryColorsList = [
    "turquois",
    "red",
    "green",
    "orange",
    "pink",
    "blue",
  ];

  for (let i = 0; i < categoryColorsList.length; i++) {
    const element = categoryColorsList[i];
    let categoryColorId = document.getElementById(`category-color-${element}`);
    categoryColorId.classList.remove("select-new-category-color");
  }
}

function renderNewCategories(categoryName, categoryColor) {
  let dropdown = document.getElementById("categories-drop-down");

  dropdown.innerHTML += generateHTMLcategory(categoryName, categoryColor);
}

function createNewSubtask() {
  let plus = document.getElementById("plus-icon");
  let accept = document.getElementById("new-subtask-accept");

  plus.classList.add("d-none");
  accept.classList.remove("d-none");
}

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

function backToSubtasks() {
  let plus = document.getElementById("plus-icon");
  let accept = document.getElementById("new-subtask-accept");
  let addSub = document.getElementById("add-subtask");

  plus.classList.remove("d-none");
  accept.classList.add("d-none");
  addSub.value = "";
}

function renderSubtasks() {
  let subContent = document.getElementById("subtask-content");

  subContent.innerHTML = "";
  for (let i = 0; i < subtasks.length; i++) {
    const subtask = subtasks[i];
    subContent.innerHTML += generateHTMLsubtask(subtask, i);
  }
}

function addSubtaskToTask(i) {
  let subtask = document.getElementById("subtasks-checkbox-" + i).value;

  if (selectedSubtasks.includes(subtask)) {
    selectedSubtasks.splice(i, 1);
  } else {
    selectedSubtasks.push(subtask);
  }
}

function fillImportanceButton1() {
  importance1.style = "display: none;";
  importance1Colored.style = "display: flex; cursor: pointer;";
  importance2.style = "display: flex;";
  importance2Colored.style = "display: none;";
  importanc3.style = "display: flex;";
  importance3Colored.style = "display: none;";
}

function emptyImportanceButton1() {
  importance = "";
  importance1.style = "display: flex;";
  importance1Colored.style = "display: none;";
}

function fillImportanceButton2() {
  importance = "medium";
  importance2.style = "display: none;";
  importance2Colored.style = "display: flex; cursor: pointer;";
  importance1.style = "display: flex;";
  importance1Colored.style = "display: none;";
  importanc3.style = "display: flex;";
  importance3Colored.style = "display: none;";
}

function emptyImportanceButton2() {
  importance = "";
  importance2.style = "display: flex;";
  importance2Colored.style = "display: none;";
}

function fillImportanceButton3() {
  importance = "low";
  importanc3.style = "display: none;";
  importance3Colored.style = "display: flex; cursor: pointer;";
  importance1.style = "display: flex;";
  importance1Colored.style = "display: none;";
  importance2.style = "display: flex;";
  importance2Colored.style = "display: none;";
}

function emptyImportanceButton3() {
  importance = "";
  importanc3.style = "display: flex;";
  importance3Colored.style = "display: none;";
}

let contactsRendered = false;

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

function openCategoriesToSelect() {
  let ddCategories = document.getElementById("categories-drop-down");
  let overlay = document.getElementById("overlay-categories");
  ddCategories.classList.toggle("d-none");
  ddCategories.classList.toggle("contacts-z");
  overlay.classList.toggle("overlay-z");
}

function resetCheckboxes() {
  for (let i = 0; i < contacts.length; i++) {
    document.getElementById(`contacts-checkbox-${i}`).checked = false;
  }
}

function clearAllInputFields() {
  let contacts = document.getElementById("contacts_box");
  let title = document.getElementById("title-input");
  let select = document.getElementById("select-date");
  let description = document.getElementById("description-input");
  let addSubtask = document.getElementById("add-subtask");
  let accept = document.getElementById("new-subtask-accept");
  let plus = document.getElementById("plus-icon");
  let selectCategory = document.getElementById("select-category");

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
}

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

let email;

function addNameNewContact() {
  let invateNewContactEmail = document.getElementById("add_task_email").value;
  email = [String(invateNewContactEmail)];
  let invateContact = document.getElementById("new_contact");
  invateContact.innerHTML = generateHTMLinviteNewContactName();
}

async function createNewContactAddTask() {
  let invateNewContactName = document.getElementById("add_task_name").value;
  await invateCreateNewContact(invateNewContactName, email);
}

async function invateCreateNewContact(invateNewContactName, email) {
  let invateContacts = [];
  let firstletter = getFirstLetterInvate(invateNewContactName);
  let color = getNewColorContact();
  let contact = {
    name: invateNewContactName,
    mail: email,
    firstLetters: firstletter,
    color: color,
  };
  let exist = (await JSON.parse(backend.getItem("contacts"))) || [];
  // if anweisung mit indexOf
  exist.push(contact);
  await backend.setItem("contacts", JSON.stringify(exist));
  newContactAddTaskReturn();
  clearContactsBeforeRendering();
  renderContacts();
}

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

function getNewColorContact() {
  let symbols, color;
  symbols = "0123456789ABCDEF";
  color = "#";

  for (let f = 0; f < 6; f++) {
    color = color + symbols[Math.floor(Math.random() * 16)];
  }
  return color;
}

async function renderContactsSelection(contacts, letters, colors) {
  let changedColorForDots = [];
  let cBox = document.getElementById("contacts_box");
  let currentContacts = contacts;
  let conatctsShow = [];

  for (let i = 0; i < selectedContacts.length; i++) {
    const current = selectedContacts[i];
    for (let j = 0; j < currentContacts.length; j++) {
      const contactData = currentContacts[j]["name"];
      if (contactData == current) {
        conatctsShow.push(currentContacts[j]);
      }
    }
  }
  if (selectedContacts == "") {
    cBox.innerHTML = "";
    return;
  }
  cBox.innerHTML = "";
  if (conatctsShow.length > 2) {
    for (let i = 0; i < 2; i++) {
      cBox.innerHTML += `<p class="invate-contact font-contact" style="background-color: ${conatctsShow[i]["color"]};">${conatctsShow[i]["firstLetters"]}</p>`;
    }
    changedColorForDots = "#FFAA00";
    cBox.innerHTML += `<p class="invate-contact font-contact" style="background-color: ${changedColorForDots};">...</p>`;
  } else if (conatctsShow.length == 2) {
    for (let i = 0; i < conatctsShow.length; i++) {
      cBox.innerHTML += `<p class="invate-contact font-contact" style="background-color: ${conatctsShow[i]["color"]};">${conatctsShow[i]["firstLetters"]}</p>`;
    }
  } else {
    for (let i = 0; i < conatctsShow.length; i++) {
      cBox.innerHTML += `<p class="invate-contact font-contact" style="background-color: ${conatctsShow[i]["color"]};">${conatctsShow[i]["firstLetters"]}</p>`;
    }
  }
}
