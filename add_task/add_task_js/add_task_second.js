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
