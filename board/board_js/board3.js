/**
 *
 * This function is to render the popup view of the tasks
 *
 * @param {string} category of the popup that will shown
 * @param {number} color of the popup that will shown
 * @param {string} title of the popup that will shown
 * @param {string} description of the popup that will shown
 * @param {array} progressStatus of the popup that will shown
 * @param {number} id of the popup that will shown
 * @param {array} colors of the popup that will shown
 * @param {array} contactsSplit of the popup that will shown
 * @param {array} letters of the popup that will shown
 * @param {string} section of the popup that will shown
 * @param {string} importance of the popup that will shown
 */
function renderPopup(
  category,
  color,
  title,
  description,
  progressStatus,
  id,
  colors,
  contactsSplit,
  letters,
  section,
  importance,
  date
) {
  let popupCard = document.getElementById("popup_card");
  popupCard.innerHTML = "";
  popupCard.innerHTML = renderPopupHTML(
    category,
    color,
    title,
    description,
    progressStatus,
    id,
    colors,
    contactsSplit,
    letters,
    section,
    importance,
    date
  );
  renderPopupDetail(
    colors,
    contactsSplit,
    letters,
    setPriority,
    importance,
    id,
    section
  );
}

function renderPopupDetail(
  colors,
  contactsSplit,
  letters,
  setPriority,
  importance,
  id,
  section
) {
  renderPopupContacts(colors, contactsSplit, letters);
  setTimeout(setPriority, 50, importance, id, section);
  checkSubtasksPopup(section, id);
  generateSubtasksSum(id);
  saveMaps();
  generateCards();
}

/**
 * This function will render the all subtasks on the card
 *
 * @param {number} id of the map
 */
function generateSubtasksSum(id) {
  let map = new Map(wichSection(id));
  let totalSub = map.get(`${id}`)["subtask"];
  let done = document.getElementById(`done_status_popup${id}`);

  if (!Array.isArray(totalSub) && totalSub.length > 0) {
    totalSub = totalSub.split(",");
  }
  totalSub = totalSub.length;
  done.innerHTML = `<span id="subtask_done${id}">0</span>/${totalSub} Done`;
  renderPopupProgressStatus(id);
}

function renderPopupProgressStatus(id) {
  let counter = 0;
  let currentMap = wichSection(id);
  let subtaskCards = currentMap.get(`${id}`)["subtaskStatus"];
  let sub_done = document.getElementById(`subtask_done${id}`);
  let progressEdit = document.getElementById("progress_edit");
  let subtaskMap = currentMap.get(`${id}`)["subtask"];
  subtaskMap = checkIfString(subtaskMap);
  subtaskCards = checkIfString(subtaskCards);

  renderPopupProgressStatusDetail(
    subtaskCards,
    counter,
    sub_done,
    progressEdit,
    subtaskMap
  );
}

function renderPopupProgressStatusDetail(
  subtaskCards,
  counter,
  sub_done,
  progressEdit,
  subtaskMap
) {
  for (let i = 0; i < subtaskCards.length; i++) {
    const element = subtaskCards[i];
    if (element.includes("add")) {
      counter++;
    }
  }
  let cardProgress = counter * (100 / subtaskMap.length);
  sub_done.innerHTML = counter;
  progressEdit.style = `width: ${cardProgress}%;`;
}

function checkSubtasksPopup(section, id) {
  let popSub = document.getElementById(`progress_box_popup${id}`);
  if (section.get(`${id}`)["subtask"] == "") {
    popSub.classList.add("d-none");
  }
}

function renderPopupContacts(colors, contactsSplit, letters) {
  let contact = document.getElementById(`assigned`);
  let card = document.getElementById("popup_card");
  let contacts = selectedContacts; //  document.querySelectorAll(".contactsDiv");

  renderPopupContactsCreat(contact, colors, contacts, contactsSplit, letters);
}

function renderPopupContactsCreat(
  contact,
  colors,
  contacts,
  contactsSplit,
  letters
) {
  if (colors[0] == "" && colors.length == 1) {
    for (let i = 0; i < contacts.length; i++) {
      const element = contacts[i];
      element.innerHTML = "";
      selectedContacts = [];
    }
  } else {
    for (let i = 0; i < contactsSplit.length; i++) {
      const element = contactsSplit[i];
      contact.innerHTML += renderPopupContactsHTML(colors, element, i, letters);
    }
  }
}

function setPopupCard(
  section,
  category,
  color,
  title,
  description,
  progressStatus,
  importance,
  colors,
  contactsSplit,
  letters,
  id,
  date
) {
  colors = colors.split(",");
  letters = letters.split(",");
  contactsSplit = checkIfString(contactsSplit);

  category = section.get(`${id}`)["category"];
  color = section.get(`${id}`)["categorycolor"];
  title = section.get(`${id}`)["title"];
  description = section.get(`${id}`)["description"];
  subtasks = section.get(`${id}`)["subtasks"];
  progressStatus = section.get(`${id}`)["progressStatus"];
  importance = section.get(`${id}`)["importance"];

  renderPopup(
    category,
    color,
    title,
    description,
    progressStatus,
    id,
    colors,
    contactsSplit,
    letters,
    section,
    importance,
    date
  );
}

function generatePopup(id) {
  let section = new Map(wichSection(id));
  let category;
  let color;
  let title;
  let description;
  let progressStatus;
  let importance;
  let colors = String(section.get(`${id}`)["colors"]);
  let contactsSplit = section.get(`${id}`)["contacts"];
  let letters = String(section.get(`${id}`)["letters"]);
  let date = section.get(`${id}`)["date"];
  setPopupCard(
    section,
    category,
    color,
    title,
    description,
    progressStatus,
    importance,
    colors,
    contactsSplit,
    letters,
    id,
    date
  );

  renderSubtasksPopup(id, section);
}

/**
 *  This function will check from wich section the id is
 * @param {number} id of the map every task has his id
 * @returns the right map
 */
function wichSection(id) {
  if (todosMap.has(`${id}`)) {
    return todosMap;
  } else if (progressesMap.has(`${id}`)) {
    return progressesMap;
  } else if (feedbacksMap.has(`${id}`)) {
    return feedbacksMap;
  } else if (donesMap.has(`${id}`)) {
    return donesMap;
  }
}

/**
 * This will render the subtasks in the popup view
 *
 * @param {number} id of the map
 * @param {string} section from wich section it comes
 */
function renderSubtasksPopup(id, section) {
  let taskArray = section.get(`${id}`)[`subtask`];
  let taskLength;

  taskArray = checkIfString(taskArray);

  taskLength = taskArray.length;
  for (let i = 0; i < taskLength; i++) {
    const element = taskArray[i];
    let pText = document.getElementById(`progress_text${id}`);
    pText.innerHTML += renderSubtaskPopupHTML(i, element, id);
  }
  setAfterRenderingSubtaskPopups(id);
}

function setAfterRenderingSubtaskPopups(id) {
  let map = wichSection(id);
  let progressesPopup = map.get(`${id}`)["subtaskStatus"];
  let currentArray = [];
  progressesPopup = checkIfString(progressesPopup);
  setAfterRenderingSubtaskPopupsLoop(progressesPopup, currentArray);
}

function setAfterRenderingSubtaskPopupsLoop(progressesPopup, currentArray) {
  for (let i = 0; i < progressesPopup.length; i++) {
    const element = progressesPopup[i];
    if (element.includes("add")) {
      currentArray.push(1);
    } else {
      currentArray.push(0);
    }
  }
  for (let i = 0; i < currentArray.length; i++) {
    const element = currentArray[i];
    if (element == 1) {
      toggleSelecter(i);
    }
  }
}

function toggleSelecter(i) {
  let cancel = document.getElementById(`cancel_sub${i}`);
  let add = document.getElementById(`add_sub${i}`);
  let span = document.getElementById(`span${i}`);

  cancel.classList.toggle("d-none");
  add.classList.toggle("d-none");
  span.classList.toggle("mr15");
}

function setupRemoveProgress(
  doneSum,
  pct,
  progressPct,
  doneCoordinates,
  id,
  i
) {
  let progressCut = document.getElementById("progress_edit").style.width;
  let cutted = parseInt(progressCut.split("%"));
  currentProgress = parseInt(cutted) - parseInt(pct);
  progressPct.style = `width: ${parseInt(currentProgress)}%;`;
  doneSum--;
  addProgressCard(currentProgress, id, doneSum);
  doneCoordinates.splice(i, 1, `cancel_sub${i}`);
  toggleSelecter(i);
  renderSubtaskStatus(id, doneSum);
  globalProgress = doneCoordinates;
  qickSaveMap(id);
}

/**
 * This function will remove the progress in the subtask if clicked
 *
 * @param {number} i index of the subtask
 * @param {number} id of the map
 * @returns
 */
function removeProgress(i, id) {
  let doneSum = document.getElementById(`subtask_done${id}`).innerHTML;
  let subSum = document.getElementsByClassName("subtext");
  let pct = 100 / subSum.length;
  let progressPct = document.getElementById("progress_edit");
  let map = wichSection(id);
  let doneCoordinates = map.get(`${id}`)["subtaskStatus"];
  doneCoordinates = checkIfString(doneCoordinates);

  if (progressPct.style.width == "0%") {
    return;
  }

  setupRemoveProgress(doneSum, pct, progressPct, doneCoordinates, id, i);
}

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
