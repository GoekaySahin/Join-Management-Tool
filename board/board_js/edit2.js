/**
 * This function will run if edit is done to save the edits and render after that
 * @param {numebr} id of the map
 */
async function editDone(id) {
  addEditClasses();
  toggleEditTitle();
  checkExistContact(id);
  let titleEdit = document.getElementById("popup_title_edit").value;
  let descriptionEdit = document.getElementById("popup_description_edit").value;
  let dateEdit = document.getElementById("select-date").value;
  let button = checkPrioBtnEdit(id);
  let section = wichSection(id);
  let contactsEdit = selectedContacts;
  let category = section.get(`${id}`)["category"];
  let categorycolor = section.get(`${id}`)["categorycolor"];
  let colors = await contactToSave(selectedContacts);
  let letters = getFirstLetter(selectedContacts, id);
  letters = letters.get(`${id}`)["letters"];
  let subtask = section.get(`${id}`)["subtask"];
  let subtaskStatus = globalProgress;

  titleEdit = titleLengthCheck(titleEdit, section, id);
  descriptionEdit = descriptionLengthCheck(descriptionEdit, section, id);
  dateEdit = dateLengthCheck(dateEdit, section, id);
  button = buttonEditCheck(button, section, id);
  colors = colors[1];

  saveIn(
    titleEdit,
    descriptionEdit,
    dateEdit,
    contactsEdit,
    button,
    section,
    category,
    categorycolor,
    colors,
    letters,
    subtask,
    subtaskStatus,
    id
  );

  generatePopup(id);
  doneSum = 0;
  currentProgress = 0;
  selectedContacts = [];
}

function saveInTodosMap(
  id,
  titleEdit,
  descriptionEdit,
  dateEdit,
  contactsEdit,
  button,
  section,
  category,
  categorycolor,
  colors,
  letters,
  subtask,
  subtaskStatus
) {
  todosMap.set(`${id}`, {
    category: `${category}`,
    categorycolor: `${categorycolor}`,
    colors: `${colors}`,
    contacts: `${contactsEdit}`,
    date: `${dateEdit}`,
    description: `${descriptionEdit}`,
    importance: `${button}`,
    letters: `${letters}`,
    subtask: `${subtask}`,
    subtaskStatus: `${subtaskStatus}`,
    title: `${titleEdit}`,
  });
}

function saveInFeedbackMap(
  titleEdit,
  descriptionEdit,
  dateEdit,
  contactsEdit,
  button,
  section,
  category,
  categorycolor,
  colors,
  letters,
  subtask,
  subtaskStatus,
  id
) {
  feedbacksMap.set(`${id}`, {
    category: `${category}`,
    categorycolor: `${categorycolor}`,
    colors: `${colors}`,
    contacts: `${contactsEdit}`,
    date: `${dateEdit}`,
    description: `${descriptionEdit}`,
    importance: `${button}`,
    letters: `${letters}`,
    subtask: `${subtask}`,
    subtaskStatus: `${subtaskStatus}`,
    title: `${titleEdit}`,
  });
}

function saveInProgressMap(
  titleEdit,
  descriptionEdit,
  dateEdit,
  contactsEdit,
  button,
  section,
  category,
  categorycolor,
  colors,
  letters,
  subtask,
  subtaskStatus,
  id
) {
  progressesMap.set(`${id}`, {
    category: `${category}`,
    categorycolor: `${categorycolor}`,
    colors: `${colors}`,
    contacts: `${contactsEdit}`,
    date: `${dateEdit}`,
    description: `${descriptionEdit}`,
    importance: `${button}`,
    letters: `${letters}`,
    subtask: `${subtask}`,
    subtaskStatus: `${subtaskStatus}`,
    title: `${titleEdit}`,
  });
}

function saveInDonesMap(
  titleEdit,
  descriptionEdit,
  dateEdit,
  contactsEdit,
  button,
  section,
  category,
  categorycolor,
  colors,
  letters,
  subtask,
  subtaskStatus,
  id
) {
  donesMap.set(`${id}`, {
    category: `${category}`,
    categorycolor: `${categorycolor}`,
    colors: `${colors}`,
    contacts: `${contactsEdit}`,
    date: `${dateEdit}`,
    description: `${descriptionEdit}`,
    importance: `${button}`,
    letters: `${letters}`,
    subtask: `${subtask}`,
    subtaskStatus: `${subtaskStatus}`,
    title: `${titleEdit}`,
  });
}

function saveIn(
  titleEdit,
  descriptionEdit,
  dateEdit,
  contactsEdit,
  button,
  section,
  category,
  categorycolor,
  colors,
  letters,
  subtask,
  subtaskStatus,
  id
) {
  if (todosMap.has(`${id}`)) {
    saveInTodosMap(
      id,
      titleEdit,
      descriptionEdit,
      dateEdit,
      contactsEdit,
      button,
      section,
      category,
      categorycolor,
      colors,
      letters,
      subtask,
      subtaskStatus
    );
    setTimeout(activateDragAndDrop, 150);
    return;
  } else if (progressesMap.has(`${id}`)) {
    saveInProgressMap(
      titleEdit,
      descriptionEdit,
      dateEdit,
      contactsEdit,
      button,
      section,
      category,
      categorycolor,
      colors,
      letters,
      subtask,
      subtaskStatus,
      id
    );
    setTimeout(activateDragAndDrop, 150);
    return;
  } else if (feedbacksMap.has(`${id}`)) {
    saveInFeedbackMap(
      titleEdit,
      descriptionEdit,
      dateEdit,
      contactsEdit,
      button,
      section,
      category,
      categorycolor,
      colors,
      letters,
      subtask,
      subtaskStatus,
      id
    );
    setTimeout(activateDragAndDrop, 150);
    return;
  } else if (donesMap.has(`${id}`)) {
    saveInDonesMap(
      titleEdit,
      descriptionEdit,
      dateEdit,
      contactsEdit,
      button,
      section,
      category,
      categorycolor,
      colors,
      letters,
      subtask,
      subtaskStatus,
      id
    );
    setTimeout(activateDragAndDrop, 150);
    return;
  }
}

function editContacts(id) {
  let map = wichSection(id);
  let contacts = map.get(`${id}`)["contacts"].split(",");
  return contacts;
}

function subtaskLayout(id) {
  let div = document.getElementById(`progress_text${id}`);
  let task = document.getElementById(`task${id}`);

  div.classList.add("progress-text-edit");
  task.classList.add("task-edit");
}

/**
 * This function check wich priority the card task has
 *
 * @param {number} id of the map
 * @returns
 */
function checkPrioBtn(id) {
  let map = wichSection(id);
  let currentPrio = map.get(`${id}`)["importance"];
  let urgent = document.getElementById("importance-button1-colored");
  let medium;
  let low;
  let result;
  let test = document.getElementById("importance-button1-colored");
  if (test == null) {
    return;
  }
  result = checkPrioBtnDetail(id, currentPrio, urgent, medium, low, result);
  return result;
}

function checkPrioBtnDetail(id, currentPrio, urgent, medium, low, result) {
  urgent = document.getElementById("importance-button1-colored").style.cssText;
  medium = document.getElementById("importance-button2-colored").style.cssText;
  low = document.getElementById("importance-button3-colored").style.cssText;
  if (urgent.includes("flex")) {
    result = "urgent";
  } else if (medium.includes("flex")) {
    result = "medium";
  } else if (low.includes("flex")) {
    result = "low";
  } else {
    result = currentPrio;
  }
  return result;
}

function checkPrioEditDeitail(result, map, currentPrio, urgent, medium, low) {
  if (!urgent.value.includes("d-none")) {
    result = "urgent";
  } else if (!medium.value.includes("d-none")) {
    result = "medium";
  } else if (!low.value.includes("d-none")) {
    result = "low";
  } else {
    result = currentPrio;
  }
  return result;
}

/**
 * This function will check prio in edit version
 * @param {number} id of the map
 * @returns
 */
function checkPrioBtnEdit(id) {
  let result;
  let map = wichSection(id);
  let currentPrio = map.get(`${id}`)["importance"];
  let urgent = document.getElementById(
    "importance-button-colored-edit-4"
  ).classList;
  let medium = document.getElementById(
    "importance-button-colored-edit-5"
  ).classList;
  let low = document.getElementById(
    "importance-button-colored-edit-6"
  ).classList;

  result = checkPrioEditDeitail(result, map, currentPrio, urgent, medium, low);
  return result;
}

/* Musst check function if i need it */

function setPriority(importance) {
  if (importance === "urgent") {
    priority.innerHTML = buttonURGENT();
  } else if (importance === "medium") {
    priority.innerHTML = buttonMEDIUM();
  } else if (importance === "low") {
    priority.innerHTML = buttonLOW();
  }
}
// EDIT END ____________________________________________________________________________________|

/**
 * This function is to set the drag and drop right with slicing
 */
function checkCards() {
  let idCard = draggedItem.id.slice(-2);
  if (!(idCard == +idCard)) {
    idCard = draggedItem.id.slice(-1);
  }
  let start = comeFrom.id.split("-")[0];
  let end = comeTo.childNodes[1].id.split("-")[0];
  if (start === "todo") {
    setFromTodo(end, idCard);
  } else if (start === "progress") {
    setFromProgress(end, idCard);
  } else if (start === "feedback") {
    setFromFeedback(end, idCard);
  } else if (start === "done") {
    setFromDone(end, idCard);
  }
  saveMaps();
}

function setFromTodo(end, id) {
  if (end === "progress") {
    progressesMap.set(id, todosMap.get(id));
    todosMap.delete(id);
  } else if (end === "feedback") {
    feedbacksMap.set(id, todosMap.get(id));
    todosMap.delete(id);
  } else if (end === "done") {
    donesMap.set(id, todosMap.get(id));
    todosMap.delete(id);
  }
}

function setFromProgress(end, id) {
  if (end === "todo") {
    todosMap.set(id, progressesMap.get(id));
    progressesMap.delete(id);
  } else if (end === "feedback") {
    feedbacksMap.set(id, progressesMap.get(id));
    progressesMap.delete(id);
  } else if (end === "done") {
    donesMap.set(id, progressesMap.get(id));
    progressesMap.delete(id);
  }
}

function setFromFeedback(end, id) {
  if (end === "todo") {
    todosMap.set(id, feedbacksMap.get(id));
    feedbacksMap.delete(id);
  } else if (end === "progress") {
    progressesMap.set(id, feedbacksMap.get(id));
    feedbacksMap.delete(id);
  } else if (end === "done") {
    donesMap.set(id, feedbacksMap.get(id));
    feedbacksMap.delete(id);
  }
}

function setFromDone(end, id) {
  if (end === "todo") {
    todosMap.set(id, donesMap.get(id));
    donesMap.delete(id);
  } else if (end === "progress") {
    progressesMap.set(id, donesMap.get(id));
    donesMap.delete(id);
  } else if (end === "feedback") {
    feedbacksMap.set(id, donesMap.get(id));
    donesMap.delete(id);
  }
}

async function getTodoMaps() {
  let todos = (await JSON.parse(backend.getItem("todoJson"))) || [];
  if (todos.length > 1) {
    todosMap = new Map(Object.entries(JSON.parse(todos)));
  }
  return todosMap;
}

async function getProgressMap() {
  let progresses = (await JSON.parse(backend.getItem("progressJson"))) || [];
  if (progresses.length > 1) {
    progressesMap = new Map(Object.entries(JSON.parse(progresses)));
  }
  return progressesMap;
}

async function getFeedbackMap() {
  let feedbacks = (await JSON.parse(backend.getItem("feedbackJson"))) || [];
  if (feedbacks.length > 1) {
    feedbacksMap = new Map(Object.entries(JSON.parse(feedbacks)));
  }
  return feedbacksMap;
}

async function getDoneMap() {
  let dones = (await JSON.parse(backend.getItem("doneJson"))) || [];
  if (dones.length > 1) {
    donesMap = new Map(Object.entries(JSON.parse(dones)));
  }
  return donesMap;
}

/**
 * load all maps
 */
async function getMaps() {
  loadCounter();
  let todosMap = await getTodoMaps();
  let progressesMap = await getProgressMap();
  let feedbacksMap = await getFeedbackMap();
  let donesMap = await getDoneMap();

  maps = [todosMap, progressesMap, feedbacksMap, donesMap];
}

async function saveTodo() {
  const todos = JSON.stringify(Object.fromEntries(todosMap));
  await backend.setItem("todoJson", JSON.stringify(todos));
}

async function saveProgress() {
  const progresses = JSON.stringify(Object.fromEntries(progressesMap));
  await backend.setItem("progressJson", JSON.stringify(progresses));
}

async function saveFeedback() {
  const feedbackes = JSON.stringify(Object.fromEntries(feedbacksMap));
  await backend.setItem("feedbackJson", JSON.stringify(feedbackes));
}

async function saveDone() {
  const dones = JSON.stringify(Object.fromEntries(donesMap));
  await backend.setItem("doneJson", JSON.stringify(dones));
}
