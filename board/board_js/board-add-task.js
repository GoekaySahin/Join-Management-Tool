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
setURL("https://gruppe-417.developerakademie.net/join/smallest_backend_ever");

async function getUrgentCounter() {
  urgentCounter = (await backend.getItem("urgentCounter")) || 0;
  urgentCounter = parseInt(urgentCounter);
}

async function getCurrentContacts() {
  currentContacts = await JSON.parse(backend.getItem("contacts"));
}

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

function checkFilled() {
  if (filled == false) {
    return;
  }
}

async function addToTasks(section) {
  checkFilled();
  load();
  let task = await setNewTask();
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
  document.getElementById("subtask-content").innerHTML = "";
  await saveTaskAndCounter();
  tasks = [];
  resetAddTask();
}

function resetAddTask() {
  closeAddTask();
  setTasks(section);
  setTimeout(activateDragAndDrop, 400); /* setCards(); */
  setTimeout(load, 500);
}

async function saveTaskAndCounter() {
  await backend.setItem("urgentCounter", JSON.stringify(urgentCounter));
  await backend.setItem("tasks", JSON.stringify(tasks));
}

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

  let task = {
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
  return task;
}

let checkedList = [];
function subtaskChecked() {
  subtasks.forEach((task, i) => {
    checkedList.push(document.getElementById(`subtasks-checkbox-${i}`).checked);
  });
}

async function contactToSave(selectedContacts) {
  let names = [];
  let colors = [];
  let letters = [];
  let list = await JSON.parse(backend.getItem("contacts"));
  checkColorAndLetter(selectedContacts, list);
  let data = [names, colors, letters];
  return data;
}

function checkColorAndLetter(selectedContacts, list) {
  for (let j = 0; j < selectedContacts.length; j++) {
    const selected = selectedContacts[j];
    for (let i = 0; i < list.length; i++) {
      const element = list[i];
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
  }
}

function allFieldsFilled() {
  let title = document.getElementById("title-input");
  let description = document.getElementById("description-input");
  let category = document.getElementById("select-category"); // .innerHTML.includes('Select')
  let date = document.getElementById("select-date-task"); // value
  contacts = selectedContacts; // length

  let result = "";
  if (fieldsFilled(title, description, category, date)) {
    setTimeout(allFieldsFilled, 250);
  }
  if (checkFieldsFilled()) {
    buttonImportanceCheck(title, description, category, date);
  } else {
    let btn = document.getElementById("submit-btn");
    btn.classList.add("opacity");
  }
}

function checkFieldsFilled(title, description, category, date) {
  return (
    title.value.length > 0 &&
    description.value.length > 0 &&
    !category.innerHTML.includes("Select") &&
    date.value.length > 0 &&
    contacts.length >= 1
  );
}

function fieldsFilled(title, description, category, date) {
  return (
    title.value.length > 0 &&
    description.value.length > 0 &&
    !category.innerHTML.includes("Select") &&
    contacts.length >= 1 &&
    date.value.length == 0
  );
}

async function buttonImportanceCheck() {
  let buttonUrgent = document.getElementById("importance-button1");
  let buttonMedium = document.getElementById("importance-button2");
  let buttonLow = document.getElementById("importance-button3");
  let result;

  if (
    buttonUrgent.classList.contains("d-none") ||
    buttonMedium.classList.contains("d-none") ||
    buttonLow.classList.contains("d-none")
  ) {
    let btn = document.getElementById("submit-btn");
    btn.classList.remove("opacity");
    filled = true;
  } else {
    let btn = document.getElementById("submit-btn");
    btn.classList.add("opacity");
  }
}

function resetAddedButton() {
  let result = allFieldsFilled();
  if (result) {
    document.getElementById("task-added-to-board").classList.add("d-none");
  }
}

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

function setImportanceButtons(
  importance1,
  importance2,
  importance2,
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

async function renderContactsAddTask(invateNewContactName) {
  let dropdown = document.getElementById("contacts-drop-down");
  contacts = (await JSON.parse(backend.getItem("contacts"))) || [];
  contacts.sort((a, b) => (a.name > b.name ? 1 : -1));
  loopForContacts(contacts);
  checkedSetting(invateNewContactName);
}

function loopForContacts(contacts) {
  for (let i = 0; i < contacts.length; i++) {
    const element = contacts[i];
    if (dropdown == null) {
      dropdown = document.getElementById("contacts-drop-down-edit");
    }
    dropdown.innerHTML += generateHTMLcontactsBoard(element, i);
  }
}

let contactsOnTask = [];

async function addContactToTaskBoard(i) {
  let contact = document.getElementById("contacts-checkbox" + i).value;
  getCheckboxValue(contact);

  checkSelectedContacts(contact);
  await safeEdit(undefined, selectedContacts);
  contactsOnTask = selectedContacts;
  renderContactsSelection(selectedContacts);
}

function checkSelectedContacts(contact) {
  if (selectedContacts.indexOf(contact) > -1) {
    let index = selectedContacts.indexOf(contact);
    selectedContacts.splice(index, 1);
  } else if (selectedContacts.indexOf(contact) == -1) {
    selectedContacts.push(contact);
  }
}

function cBoxSetting(cBox) {
  if (
    cBox == null ||
    cBox == undefined ||
    addTask.classList.contains("d-none")
  ) {
    cBox = document.getElementById("invite_contacts_select_edit");
  }
}

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
  return invateContact;
}

async function renderContactsSelection(contacts) {
  conatcts = checkContacts();
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

function setColorForDots(inviteContacts, cBox) {
  if (inviteContacts.length > 2) {
    for (let i = 0; i < 2; i++) {
      cBox.innerHTML += `<p class="invate-contact font-contact" style="background-color: ${inviteContacts[i]["color"]};">${inviteContacts[i]["firstLetters"]}</p>`;
    }
    changedColorForDots = "#FFAA00";
    cBox.innerHTML += `<p class="invate-contact font-contact" style="background-color: ${changedColorForDots};">...</p>`;
  } else if (inviteContacts.length == 2) {
    for (let i = 0; i < inviteContacts.length; i++) {
      cBox.innerHTML += `<p class="invate-contact font-contact" style="background-color: ${inviteContacts[i]["color"]};">${inviteContacts[i]["firstLetters"]}</p>`;
    }
  } else {
    for (let i = 0; i < inviteContacts.length; i++) {
      cBox.innerHTML += `<p class="invate-contact font-contact" style="background-color: ${inviteContacts[i]["color"]};">${inviteContacts[i]["firstLetters"]}</p>`;
    }
  }
}

function checkContacts(contacts) {
  if (contacts[0] == "") {
    contacts.splice(0, 1);
  }
  if (selectedContacts.length > 0) {
    if (selectedContacts[0] == "") {
      selectedContacts.splice(0, 1);
    }
  }
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

function showErrorCategory() {
  let messageInput = document.getElementById("error_value_cat");
  messageInput.classList.toggle("d-none");
}

function showErrorColor() {
  let messageColor = document.getElementById("error_value_col");
  messageColor.classList.toggle("d-none");
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

function renderNewCategories(categoryName, categoryColorTrue) {
  document.getElementById("categories-drop-down").innerHTML +=
    generateHTMLcategory(categoryName, categoryColorTrue);
}

function createNewSubtask() {
  document.getElementById("plus-icon").classList.add("d-none");
  document.getElementById("new-subtask-accept").classList.remove("d-none");
}

function addSubtask() {
  let newSubtask = document.getElementById("add-subtask").value;
  let plus = document.getElementById("plus-icon");
  let subtask_accept = document.getElementById("new-subtask-accept");
  subtasks.push(newSubtask);
  if (selectedSubtasks.indexOf(newSubtask) == -1) {
    selectedSubtasks.push(newSubtask);
  }
  subtaskDescription();
  renderSubtasks();
  newSubtask.value = "";
  plus.classList.remove("d-none");
  subtask_accept.classList.add("d-none");
}

let descript = 0;
function subtaskDescription() {
  if (descript == 0) {
    descript++;
    document.getElementById("add-subtask").placeholder =
      "Uncheck it, to remove the subtask!";
    subtaskToggleRed();
    setTimeout(subtaskSetBack, 1850);
  }
}

function subtaskToggleRed() {
  let subtask = document.getElementById("add-subtask");
  subtask.classList.toggle("add-subtask-red");
}

function subtaskSetBack() {
  let subatsk = document.getElementById("add-subtask");
  subatsk.placeholder = "Add new subtask";
  subtaskToggleRed();
}

function subtaskReturn() {
  return false;
}

function backToSubtasks() {
  let plus = document.getElementById("plus-icon");
  let new_subtask = document.getElementById("new-subtask-accept");
  let add_subtask = document.getElementById("add-subtask");

  plus.classList.remove("d-none");
  new_subtask.classList.add("d-none");
  add_subtask.value = "";
}
let subCounterAdd = 0;

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

function addSubtaskToTask(i) {
  let subtask = document.getElementById("subtasks-checkbox-" + i).value;

  if (selectedSubtasks.includes(subtask)) {
    selectedSubtasks.splice(i, 1);
  } else {
    selectedSubtasks.push(subtask);
  }
}

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

function fillImportanceButton(nr) {
  let pushed;
  let pushedColored;
  checkAndResetImpotance(nr);
  setImportanceBoard(pushed);
  pushed.classList.toggle("d-none");
  pushedColored.classList.toggle("d-none");
}

function checkAndResetImpotance(nr) {
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

function openContactsToSelect() {
  document.getElementById("categories-drop-down").classList.add("d-none");
  var element = document.getElementById("contacts-drop-down");
  element.classList.toggle("d-none");
  allFieldsFilled();
}

function openCategoriesToSelect() {
  document.getElementById("contacts-drop-down").classList.add("d-none");
  var element = document.getElementById("categories-drop-down");
  element.classList.toggle("d-none");
}

function generateHTMLcontactsBoard(element, i) {
  return `
      <div class="contacts-list-elem">
        <label class="control control-checkbox" id="selected-contact${i}">
          <div class="contacts-list-elem-box" id="${element["name"]}">
            <span class="rendered-contact-name">${element["name"]}</span>
            <input onclick="addContactToTaskBoard(${i})" id="contacts-checkbox${i}" type="checkbox" value="${element["name"]}" />
            <div id="control-indicator-${i}" class="control-indicator"></div>
          </div>
        </label>
      </div>
      `;
}

function generateHTMLcategory(categoryName, categoryColorTrue) {
  return `
  <div onclick="fillCategory('${categoryName}')" class="categories-list-elem">
    ${categoryName}
    <img src="../add_task/img-add_task/circle_${categoryColorTrue}.png" />
  </div>
  `;
}

function setCategoryToSales() {
  return `
      <div class="selected-category">
        Sales
        <img src="../add_task/img-add_task/circle_pink.png" />
      </div>
      `;
}

function setCategoryToBackoffice() {
  return `
      <div class="selected-category">
        Backoffice
        <img src="../add_task/img-add_task/circle_turquois.png" />
      </div>
      `;
}

function setCategoryToNewCategory(categoryName, categoryColorTrue) {
  return `
    <div class="selected-category">
      ${categoryName}
      <img src="../add_task/img-add_task/circle_${categoryColorTrue}.png" />
    </div>
    `;
}

function generateHTMLnewCategoryNameAndColor(categoryName, categoryColorTrue) {
  return `
  <div class="selected-category">
    ${categoryName}
    <img src="../add_task/img-add_task/circle_${categoryColorTrue}.png" />
  </div>
  `;
}

function resetCategory() {
  return `
    <div class="selected-category">
      Select task category
    </div>
    `;
}

function generateHTMLsubtask(subtask, i) {
  return `
      <div class="subtask-list-elem">
        <label class="control control-checkbox" id="selected-subtask">
          <div class="subtask-list-elem-box">
            <input onclick="addSubtaskToTask(${i})" id="subtasks-checkbox-${i}" type="checkbox" value="${subtask}" checked/>
            <span class="rendered-subtask-name">${subtask}</span>
            <div class="control-indicator-subtask"></div>
          </div>
        </label>
      </div>
      `;
}

function newContactAddTask(index) {
  if (newContactAddTaskActive == true) {
    let invateContact;
    if (index == 1) {
      invateContact = document.getElementById("new_contact");
    } else if (index == 0) {
      invateContact = document.getElementById("new_contact-edit");
    }
    invateContact.innerHTML = `<div class="new-contact-add-task">
                                    <input onkeyup="" type="email" placeholder="Add Contact Email" class="add-subtask correct-width" id="add_task_email"> 
                                      <div id="new-subtask-accept" class="new-subtask-accept m-i-e">
                                        <img onmouseup="newContactAddTaskReturn()" src="../add_task/img-add_task/x_blue.png">
                                        <span>|</span>
                                        <img onclick="addNameNewContact()" src="../add_task/img-add_task/check_blue.png">
                                     </div>
                                  </div>`;
    invateContact.classList.remove("contacts-list-elem");
    invateContact.classList.remove("new-contact");
    invateContact.classList.add("invate-class");

    newContactAddTaskActive = false;
  }
}

function newContactEdit(index) {
  if (newContactAddTaskActive == true) {
    let invateContact;
    if (index == 1) {
      invateContact = document.getElementById("new_contact");
    } else if (index == 0) {
      invateContact = document.getElementById("new_contact-edit");
    }
    invateContact.innerHTML = `<div class="new-contact-add-task">
                                    <input onkeyup="" type="email" placeholder="Add Contact Email" class="add-subtask correct-width" id="add_task_email"> 
                                      <div id="new-subtask-accept" class="new-subtask-accept m-i-e">
                                        <img onmouseup="newContactAddTaskReturn()" src="../add_task/img-add_task/x_blue.png">
                                        <span>|</span>
                                        <img onclick="addNameNewContactEdit(${index})" src="../add_task/img-add_task/check_blue.png">
                                     </div>
                                  </div>`;
    invateContact.classList.remove("contacts-list-elem");
    invateContact.classList.remove("new-contact");
    invateContact.classList.add("invate-class");

    newContactAddTaskActive = false;
  }
}

function newContactAddTaskReturn() {
  let invateContact = document.getElementById("new_contact");
  let addTask = document.getElementById("add_task");

  if (addTask == null || addTask.classList.contains("d-none")) {
    invateContact = document.getElementById("new_contact-edit");
  }
  invateContact.classList.add("contacts-list-elem");
  invateContact.classList.add("new-contact");
  invateContact.classList.remove("invate-class");
  invateContact.innerHTML = `
  <span class="rendered-contact-name">Invite new contact</span>
    <img src="../add_task/img-add_task/contact_blue.png" />`;
  newContactAddTaskActive = true;
}

let email;

function addNameNewContact() {
  let emailInput = document.getElementById("add_task_email").value;
  if (!emailInput.includes(".")) {
    return;
  }
  let invateNewContactEmail = document.getElementById("add_task_email").value;
  email = [String(invateNewContactEmail)];
  let invateContact = document.getElementById("new_contact");
  if (invateContact == null) {
    invateContact = document.getElementById("new_contact-edit");
  }
  invateContact.innerHTML = `<div class="new-contact-add-task">
                                  <input onkeyup="" type="text" placeholder="First and Lastname" class="add-subtask correct-width" id="add_task_name"> 
                                    <div id="new-subtask-accept" class="new-subtask-accept m-i-e">
                                      <img onmouseup="newContactAddTaskReturn()" src="../add_task/img-add_task/x_blue.png">
                                      <span>|</span>
                                      <img onmouseup="creatNewContactAddTask()" src="../add_task/img-add_task/check_blue.png">
                                   </div>
                                </div>`;
}

function addNameNewContactEdit(index) {
  let emailInput = document.getElementById("add_task_email").value;
  if (!emailInput.includes(".")) {
    return;
  }
  let invateNewContactEmail = document.getElementById("add_task_email").value;
  email = [String(invateNewContactEmail)];
  let invateContact = document.getElementById("new_contact-edit");

  invateContact.innerHTML = `<div class="new-contact-add-task">
                                  <input onkeyup="" type="text" placeholder="First and Lastname" class="add-subtask correct-width" id="add_task_name"> 
                                    <div id="new-subtask-accept" class="new-subtask-accept m-i-e">
                                      <img onmouseup="newContactAddTaskReturn()" src="../add_task/img-add_task/x_blue.png">
                                      <span>|</span>
                                      <img onmouseup="creatNewContactEdit(${index})" src="../add_task/img-add_task/check_blue.png">
                                   </div>
                                </div>`;
}

let checkedIndex = [];
async function creatNewContactAddTask() {
  let invateNewContactName = document.getElementById("add_task_name").value;
  if (invateNewContactName == "") {
    return;
  }
  await invateCreateNewContact(invateNewContactName, email);
  getCheckboxValue(invateNewContactName);
  allFieldsFilled();
}

async function creatNewContactEdit(id) {
  let invateNewContactName = document.getElementById("add_task_name").value;
  selectedContacts.push(invateNewContactName);
  await invateCreateNewContact(invateNewContactName, email, id);
  setTimeout(contactsCheckboxUpdate, 400, id);

  getCheckboxValue(invateNewContactName);
  renderContactsSelection(invateNewContactName);
}

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
  checkIfNewContactExist(contact);

  newContactAddTaskReturn();
  clearContactsBeforeRendering(indexLength);
  renderContactsAddTask(invateNewContactName);
  renderContactsSelection(contacts);
}

async function checkIfNewContactExist() {
  exist = (await JSON.parse(backend.getItem("contacts"))) || [];
  exist.push(contact);
  await backend.setItem("contacts", JSON.stringify(exist));
  /*   let currentContactsEdit = (await JSON.parse(backend.getItem("contacts"))) || [];
  let indexLength; */

  if (exist.length > 0) {
    indexLength = exist.length;
  }
}

function ContactsDivDisplay(displayContacts) {
  for (let i = 0; i < displayContacts.length; i++) {
    let contactsCard = document.getElementById(`contactsDiv${i}`);
    contactsCard.classList.add("d-none");
  }
}

async function getCheckboxValue(invateNewContactName) {
  if (invateNewContactName == undefined) {
    invateNewContactName = selectedContacts;
  }
  checkedIndex = [];
  checkedEdit = [];
  if (currentContacts == null) {
    checkedIndex.push(0);
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
    for (let i = 0; i < selectedContacts.length; i++) {
      const names = selectedContacts[i];
      let docElement = document.getElementById(names);
      docElement.childNodes[3].checked = true;
    }
  } else {
    let docElement = document.getElementById(invateNewContactName);
    docElement.childNodes[3].checked = true;
  }
}

function clearContactsBeforeRendering(indexLength) {
  if (exist.length > 0) {
    for (let i = 0; i < indexLength - 1; i++) {
      // const element = contacts[i];
      let contact = document.getElementById(`selected-contact${i}`);
      if (contact == null) {
        continue;
      }
      contact.parentElement.remove();
    }
  }
}

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

function getFirstLetterInvate(contact) {
  let contacts = contact;
  let letterList;
  let firstLetters;
  if (contacts.length == 0) {
    return;
  }

  contact = checkIfString(contact);
  contact = spliceEmptyObject(contact);

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

function getNewColorContacts() {
  let color = "#";
  const symbols = "0123456789ABCDEF";
  for (let f = 0; f < 6; f++) {
    color += symbols[Math.floor(Math.random() * 16)];
  }
  return color;
}

function loadAtStartTask() {
  let nameTest = JSON.parse(backend.getItem("currentUser")) || [];
  if (nameTest.length < 2) {
    showCurrentUserNameForSummery = "Max Kebabman";
  } else {
    showCurrentUserNameForSummery = nameTest;
  }
  return showCurrentUserNameForSummery;
}
