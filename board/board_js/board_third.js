function addProgressCounter(doneCoordinates, counter) {
  for (let i = 0; i < doneCoordinates.length; i++) {
    const element = doneCoordinates[i];
    if (element.includes("add")) {
      counter++;
    }
  }
}

function addProgressVariable(doneCoordinates, counter, pct) {
  let currentProgress = document.getElementById("progress_edit").style.width;
  currentProgress = Number(currentProgress.slice(0, -1));

  if (typeof doneCoordinates[counter] == "string") {
    if (doneCoordinates.lenght == 1) {
      doneCoordinates = doneCoordinates.split(",");
      debugger;
    }
    currentProgress += counter * pct;
  }
  return currentProgress;
}

function setProgressToZero(progressPct, pct, id, doneSum, currentProgress, i) {
  progressPct.style = `width: ${pct}%;`;
  addProgressCard(pct, id, doneSum);
  currentProgress = pct;
  toggleSelecter(i);
  doneSum++;
  doneCoordinates = checkIfString(doneCoordinates);
  doneCoordinates.splice(i, 1, `add_sub${i}`);
  renderSubtaskStatus(id, doneSum);
  return doneSum;
}

function setProgressInBeetween(
  doneSum,
  id,
  currentProgress,
  doneSum,
  i,
  pct,
  progressPct,
  doneCoordinates
) {
  doneSum = parseInt(document.getElementById(`subtask_done${id}`).innerHTML);
  let theProgress = document.getElementById("progress_edit").style.width;

  theProgress = theProgress.split("%");
  currentProgress = parseInt(theProgress) + parseInt(pct);
  progressPct.style = `width: ${currentProgress}%;`;
  toggleSelecter(i);
  doneSum++;
  addProgressCard(currentProgress, id, doneSum);
  doneCoordinates = checkIfString(doneCoordinates);
  doneCoordinates.splice(i, 1, `add_sub${i}`);
  renderSubtaskStatus(id, doneSum);
  return doneSum;
}

/**
 * This function will add the progress on the subtask
 *
 * @param {number} i index of the subtask wich will be progress added
 * @param {number} id of the map
 */
function addProgress(i, id) {
  let doneSum = document.getElementById(`subtask_done${id}`).innerHTML;
  let subSum = document.getElementsByClassName("subtext");
  let pct = 100 / subSum.length;
  let progressPct = document.getElementById("progress_edit");
  let map = wichSection(id);
  let counter = 0;
  doneCoordinates = map.get(`${id}`)["subtaskStatus"];

  doneCoordinates = checkIfString(doneCoordinates);
  currentProgress = counter * pct;
  counter = subtaskCounter(doneCoordinates, counter);
  if (progressPct.style.width == "0%") {
    doneCoordinates = subtaskPctZero(
      progressPct,
      pct,
      id,
      doneSum,
      currentProgress,
      i
    );
  } else if (
    !(progressPct.style.width == "100%") &&
    !(progressPct.style.width == "0%")
  ) {
    doneCoordinates = subtaskInBetween(
      doneSum,
      id,
      currentProgress,
      pct,
      progressPct,
      i
    );
  }
  globalProgress = doneCoordinates;
  qickSaveMap(id);
}

function subtaskInBetween(doneSum, id, currentProgress, pct, progressPct, i) {
  doneSum = parseInt(document.getElementById(`subtask_done${id}`).innerHTML);
  let theProgress = document.getElementById("progress_edit").style.width;
  theProgress = theProgress.split("%");
  currentProgress = parseInt(theProgress) + parseInt(pct);
  progressPct.style = `width: ${currentProgress}%;`;
  toggleSelecter(i);
  doneSum++;
  addProgressCard(currentProgress, id, doneSum);
  doneCoordinates.splice(i, 1, `add_sub${i}`);
  renderSubtaskStatus(id, doneSum);
  return doneCoordinates;
}

function subtaskPctZero(progressPct, pct, id, doneSum, currentProgress, i) {
  progressPct.style = `width: ${pct}%;`;
  addProgressCard(pct, id, doneSum);
  currentProgress = pct;
  toggleSelecter(i);
  doneSum++;
  doneCoordinates.splice(i, 1, `add_sub${i}`);
  renderSubtaskStatus(id, doneSum);
  return doneCoordinates;
}

function subtaskCounter(doneCoordinates, counter) {
  for (let i = 0; i < doneCoordinates.length; i++) {
    const element = doneCoordinates[i];
    if (element.includes("add")) {
      counter++;
    }
    return counter;
  }
}

function renderSubtaskStatus(id, doneSum) {
  document.getElementById(`subtask_done${id}`).innerHTML = doneSum;
}

function addProgressCard(number, id, doneSum) {
  let progressStatusCard = document.getElementById(`progress_card_done${id}`);
  let bar = document.getElementById(`progress_card${id}`);

  progressStatusCard.innerHTML = doneSum;
  bar.style = `width: ${number}%;`;
}

/**
 * This function checks from the id wich map it is
 *
 * @param {number} id of the map
 * @returns the right map
 */
function checkMap(id) {
  let currentMap = new Map();
  if (todosMap.has(`${id}`)) {
    currentMap = new Map(todosMap);
  } else if (progressesMap.has(`${id}`)) {
    currentMap = new Map(progressesMap);
  } else if (feedbacksMap.has(`${id}`)) {
    currentMap = new Map(feedbacksMap);
  } else {
    currentMap = new Map(donesMap);
  }
  return currentMap;
}

/**
 * This function shows the contacts in edit popup version
 *
 * @returns wich contacts are in popup
 */
async function editContactsPopup() {
  let map = await JSON.parse(backend.getItem("contacts"));
  if (map == undefined || map == null) {
    return;
  }
  if (typeof map === "string") {
    map = map.split(",");
  }
  let contactsInPopup = [];
  for (let i = 0; i < map.length; i++) {
    const element = map[i]["name"];
    let dok = document.getElementById(`contacts-checkbox${i}`);
    if (dok == null || dok == undefined) {
      return;
    }
    if (contactsInPopup.indexOf(element) < 0) {
      contactsInPopup.push(element);
    }
  }
  return contactsInPopup;
}

/**
 * This function is to set the layout if subtask on it
 * @param {number} id of the map
 */
function setSubtasksLayout(id) {
  let progressText = document.getElementById(`progress_text${id}`);
  let subText = document.getElementById("subtask_id");
  let subP = document.getElementsByClassName("subtext");
  let subCheck = document.getElementsByClassName("sub-checkmark");

  progressText.classList.add("add-colum");
  subText.classList.add("mb");
  subText.classList.add("mt11");
  for (let i = 0; i < subP.length; i++) {
    const element = subP[i];
    element.classList.add("mt0");
    subCheck[i].classList.remove("d-none");
    document.getElementById(`subtask_checking${i}`).classList.add("scw");
  }
}

/**
 * This function will check the selected contacts in the dropdown
 *
 * @param {number} id of the map
 * @returns id dropdown is close
 */
function setSelectedContacts(id) {
  let dropDown = document.getElementById("contacts-drop-down-edit");

  if (dropDown.classList.contains("d-none")) {
    return;
  }
  let map = wichSection(id);
  let contacts = map.get(`${id}`)["contacts"];
  contacts = checkIfString(contacts);
  if (contacts[0] == "") {
    contacts.splice(0, 1);
  } else {
    selectedContacts = contacts;
  }
}

function getContactsForCheckbox(id) {
  let map = wichSection(id);
  let contacts = map.get(`${id}`)["contacts"];
  contacts = checkIfString(contacts);

  for (let j = 0; j < contacts.length; j++) {
    const newElement = contacts[j];
    document.getElementById(newElement).checked = true;
  }
}

function toggleEditTitle() {
  let titleEdit = document.getElementById("popup-card-title");
  titleEdit.classList.toggle("popup-title-for_edit");
}

function dateFuture() {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("select-date").setAttribute("min", today);
}

function dateFutureTask() {
  const today = new Date().toISOString().split("T")[0];
  let dateId = document.getElementById("select-date-task");
  if (dateId == null) {
    return;
  }
  dateId.setAttribute("min", today);
}

/**
 * This function show the old inputs on the editable card
 * @param {string} title of the card or task in popup view to edit
 * @param {string} description of the card task
 * @param {number} id of the card task to edit
 */
function showEdit(title, description, id) {
  let colors = document.getElementById(`c-color`);
  let popupTitle = document.getElementById("popup_title");
  let cardConten = document.getElementById("card_content");
  let popupDescription = document.getElementById("popup_description");
  let date = document.getElementById("date_box");
  let prio = document.getElementById("edit_priority");
  let assing = document.getElementById("edit-assigned");
  let contact = document.getElementById("contact");
  let editBox = document.getElementById("edit_box");

  renderShowEdit(
    colors,
    popupTitle,
    cardConten,
    popupDescription,
    date,
    prio,
    assing,
    contact,
    editBox,
    title,
    description,
    id
  );
}

function deleteTask(id) {
  let map = wichSection(id);
  map.delete(`${id}`);
  generateCards();
  popup();
  saveMaps();
}

function checkItBeforSaving(
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
  if (titleEdit.length == 0) {
    titleEdit = section.get(`${id}`)["title"];
  }
  if (descriptionEdit.length == 0) {
    descriptionEdit = section.get(`${id}`)["description"];
  }
  if (dateEdit.length == 0) {
    dateEdit = section.get(`${id}`)["date"];
  }
  if (contactsEdit.length == 0 || contactsEdit[0] == "") {
    contact = section.get(`${id}`)["contacts"];
    contactsEdit = contact;
  }
  if (button == undefined) {
    button = section.get(`${id}`)["importance"];
  }
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
}

/**
 * This function is to safe the status quo
 *
 * @param {number} id of the map
 */
function qickSaveMap(id) {
  let titleEdit = document.getElementById("popup_title_edit").value;
  let descriptionEdit = document.getElementById("popup_description_edit").value;
  let dateEdit = document.getElementById("select-date").value;
  let contactsEdit = selectedContacts;
  let button = checkPrioBtn(id);
  let section = wichSection(id);

  let category = section.get(`${id}`)["category"];
  let categorycolor = section.get(`${id}`)["categorycolor"];
  let colors = section.get(`${id}`)["colors"];
  let letters = section.get(`${id}`)["letters"];
  let subtask = section.get(`${id}`)["subtask"];
  let subtaskStatus = globalProgress;
  checkItBeforSaving(
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
}

/**
 * This function will add or remove the contacts and return
 * @returns array of correct contat
 */
function checkSelectedContacts() {
  if (selectedContacts.length > 0) {
    for (let i = 0; i < selectedContacts.length; i++) {
      const element = selectedContacts[i];
      if (currentContacts.indexOf(element) == -1) {
        currentContacts.push(element);
      }
    }
  }
  return currentContacts;
}
