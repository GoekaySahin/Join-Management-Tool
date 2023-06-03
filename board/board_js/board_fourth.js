/**
 * This function will make sure that the right contacts will return in a rigth way
 *
 * @param {number} id of the map
 * @returns correct array of contacts
 */
function checkContacts(id) {
  let newContacts = selectedContacts;
  let map = wichSection(id);
  let currentContacts = map.get(`${id}`)["contacts"];

  selectedContacts = checkIfString(selectedContacts);
  currentContacts = checkIfString(currentContacts);

  if (currentContacts == selectedContacts) {
    return currentContacts;
  }
  currentContacts = checkSelectedContacts(currentContacts);

  return currentContacts;
}

async function setColorsExist() {
  let contacts = await JSON.parse(backend.getItem("contacts"));
  let colorList = [];
  for (let i = 0; i < selectedContacts.length; i++) {
    const taskName = selectedContacts[i];
    for (let j = 0; j < contacts.length; j++) {
      const contactsName = contacts[j]["name"];
      if (contactsName.includes(taskName)) {
        colorList.push(contacts[j]["color"]);
      }
    }
  }
  return colorList;
}

function titleLengthCheck(titleEdit, section, id) {
  if (titleEdit.length == 0) {
    titleEdit = section.get(`${id}`)["title"];
  }

  return titleEdit;
}

function descriptionLengthCheck(descriptionEdit, section, id) {
  if (descriptionEdit.length == 0) {
    descriptionEdit = section.get(`${id}`)["description"];
  }
  return descriptionEdit;
}

function dateLengthCheck(dateEdit, section, id) {
  if (dateEdit.length == 0) {
    dateEdit = section.get(`${id}`)["date"];
  }
  return dateEdit;
}

function buttonEditCheck(button, section, id) {
  if (button == undefined) {
    button = section.get(`${id}`)["importance"];
  }
  return button;
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
