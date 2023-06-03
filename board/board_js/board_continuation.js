/**
 *  This function will split the name and get the firstletters
 * @param {map} key is the map of the contact
 * @returns
 */
function splitName(key) {
  if (key["letters"] == null || key["letters"][0] == null) {
    let contactsLetter = key["contacts"];
    contactsLetter = checkIfString(contactsLetter);
    namesSplit = getFirstLetter(contactsLetter, idCounter);
  } else {
    namesSplit = new Map();
    namesSplit.set(`${idCounter}`, { letters: `${key["letters"]}` });
  }
  if (namesSplit.get(`${idCounter}`) == undefined) {
    location.reload();
  }
  return namesSplit;
}

/**
 * This function will creat the map in the right section and later it will saved
 *
 * @param {map} map the map itself
 * @param {number} key key of the map
 * @param {number} colors color of the contact
 * @param {map} namesSplit name and firstletters
 * @param {array} doneCoordinates of the subtasks done or not
 */
function setNewCard(map, key, colors, namesSplit, doneCoordinates) {
  if (namesSplit.get(`${idCounter}`)["letters"] == undefined) {
    location.reload();
  }
  map.set(`${idCounter}`, {
    category: key["category"],
    categorycolor: key["categorycolor"],
    contacts: key["contacts"],
    colors: colors,
    letters: namesSplit.get(`${idCounter}`)["letters"],
    date: key["date"],
    description: key["description"],
    importance: key["importance"],
    subtask: key["subtasks"],
    subtaskStatus: doneCoordinates,
    title: key["title"],
    progressStatus: key[0],
  });
}

/**
 * This function will render the card in the right section
 *
 * @param {string} section string of the section where it will be rendered
 */
function setCardTodo(section) {
  let todo = document.getElementById("todo-board");
  todo.innerHTML = "";
  for (const [key, value] of todosMap) {
    if (!(key === "x")) {
      cardContent(section, key);
      checkSubtasks(key, todosMap);
      renderContacts(section, key);
    }
  }
}

/**
 * This function will render the card in the right section
 *
 * @param {string} section string of the section where it will be rendered
 */
function setCardProgress(section) {
  let progress = document.getElementById("progress-board");
  progress.innerHTML = ``;
  for (const [key, value] of progressesMap) {
    if (!(key === "x")) {
      cardContent(section, key);
      checkSubtasks(key, progressesMap);
      renderContacts(section, key);
    }
  }
}

/**
 * This function will render the card in the right section
 *
 * @param {string} section string of the section where it will be rendered
 */
function setCardFeedback(section) {
  let feedback = document.getElementById("feedback-board");
  feedback.innerHTML = ``;
  for (const [key, value] of feedbacksMap) {
    if (!(key === "x")) {
      cardContent(section, key);
      checkSubtasks(key, feedbacksMap);
      renderContacts(section, key);
    }
  }
}

/**
 * This function will render the card in the right section
 *
 * @param {string} section string of the section where it will be rendered
 */
function setCardDone(section) {
  let done = document.getElementById("done-board");
  done.innerHTML = "";
  for (const [key, value] of donesMap) {
    if (!(key === "x")) {
      cardContent(section, key);
      checkSubtasks(key, donesMap);
      renderContacts(section, key);
    }
  }
}

function setCards(section) {
  if (section === "todo") {
    setCardTodo(section);
  }
  if (section === "progress") {
    setCardProgress(section);
  }
  if (section === "feedback") {
    setCardFeedback(section);
  }
  if (section === "done") {
    setCardDone(section);
  }
}

function cardContent(section, id) {
  if (section === "todo") {
    creatCardContent(section, id, todosMap);
  } else if (section === "progress") {
    creatCardContent(section, id, progressesMap);
  } else if (section === "feedback") {
    creatCardContent(section, id, feedbacksMap);
  } else if (section === "done") {
    creatCardContent(section, id, donesMap);
  }
}

/**
 * This function checks the importance and render it
 *
 * @param {number} id of the map
 */
function setCardImportanc(id) {
  let footer = document.getElementById(`importance_footer${id}`);
  if (donesMap.get(`${id}`)["importance"] === "urgent") {
    footer.innerHTML = ` <img class="img-position" src="img-board/${importance}.png">
                        <img src="img-board/${importance}.png">`;
  }
}

/**
 *
 * This function will creat the subtask of the cards and submit the variables to render it
 * @param {map} mapCategory
 * @param {map} mapCatColor
 * @param {map} mapTitle
 * @param {map} mapDescription
 * @param {number} totalSub
 * @param {number} doneSum
 * @param {string} importance
 * @param {string} sectionBoard
 * @param {map} map
 * @param {number} id
 * @param {string} section
 */
function creatCardSubs(
  mapCategory,
  mapCatColor,
  mapTitle,
  mapDescription,
  totalSub,
  doneSum,
  importance,
  sectionBoard,
  map,
  id,
  section
) {
  totalSub = checkIfString(totalSub);
  totalSub = totalSub.length;
  let progressStatus = map.get(`${id}`)["subtaskStatus"];
  progressStatus = checkIfString(progressStatus);

  for (let i = 0; i < progressStatus.length; i++) {
    const element = progressStatus[i];
    if (element == `add_sub${i}` && !(doneSum == null)) {
      doneSum = parseInt(doneSum.innerHTML);
      doneSum++;
    }
  }
  document.getElementById(`${section}-board`).innerHTML += setCardHTML(
    mapCategory,
    mapCatColor,
    mapTitle,
    mapDescription,
    totalSub,
    doneSum,
    id,
    importance
  );
}

/**
 *
 * This function will creat the hole content on the card
 * @param {string} section of the section
 * @param {number} id of the map
 * @param {map} map map itself with correct section
 */
function creatCardContent(section, id, map) {
  let mapCategory = map.get(`${id}`)["category"];
  let mapCatColor = map.get(`${id}`)["categorycolor"];
  let mapTitle = map.get(`${id}`)["title"];
  let mapDescription = map.get(`${id}`)["description"];
  let totalSub = map.get(`${id}`)["subtask"];
  let doneSum = document.getElementById(`subtask_done${id}`);
  let importance = map.get(`${id}`)["importance"];
  let sectionBoard = document.getElementById(`${section}-board`);

  if (!Array.isArray(totalSub) && totalSub.length > 0) {
    totalSub = totalSub.split(",");
  }
  if (totalSub == "") {
    sectionBoard.innerHTML += setCardHTML(
      mapCategory,
      mapCatColor,
      mapTitle,
      mapDescription,
      undefined,
      undefined,
      id,
      importance
    );
  } else {
    creatCardSubs(
      mapCategory,
      mapCatColor,
      mapTitle,
      mapDescription,
      totalSub,
      doneSum,
      importance,
      sectionBoard,
      map,
      id,
      section
    );
  }
}

/**
 * This function will check the subtasks and set the right height of the card
 *
 * @param {number} id of the map
 * @param {map} map the map itself
 */
function checkSubtasks(id, map) {
  let currentMap = new Map(map);
  let progressId = document.getElementById(`progress_box${id}`);
  let counter = 0;
  let subtaskCards = currentMap.get(`${id}`)["subtaskStatus"];

  if (currentMap.get(`${id}`)["subtask"] == "") {
    progressId.classList.add("d-none");
    addHeight(id);
  } else {
    setSubtasksOnCardVisible(subtaskCards, counter, id);
  }
}

/**
 *  This function will check the subtasks and make it visible
 * @param {array} subtaskCards with the subtasks
 * @param {number} counter to count the subtasks
 * @param {number} id of the map
 */
function setSubtasksOnCardVisible(subtaskCards, counter, id) {
  subtaskCards = checkIfString(subtaskCards);
  for (let i = 0; i < subtaskCards.length; i++) {
    const element = subtaskCards[i];
    if (element.includes("add")) {
      counter++;
    }
  }
  let cardProgress = counter * (100 / subtaskCards.length);
  if (cardProgress == NaN) {
    cardProgress = 0;
  }
  addProgressCard(cardProgress, id, counter);
}

function addHeight(id) {
  let list = document.getElementById(`footer${id}`);
  list.style.height = "55px";
}

/**
 * This function will start the rendering of the contacts in the cards
 *
 * @param {string} section in wich section it will be rendered
 * @param {number} id of the map
 */
function renderContacts(section, id) {
  if (section === "todo") {
    renderContactsCard(id);
  } else if (section === "progress") {
    renderContactsCard(id);
  } else if (section === "feedback") {
    renderContactsCard(id);
  } else if (section === "done") {
    renderContactsCard(id);
  }
}

/**
 * This function will check if it is a string if not convert
 *
 * @param {value} element to check if it is a string
 * @returns a string
 */
function checkIfString(element) {
  if (typeof element === "string") {
    element = element.split(",");
    if (element[0] == "") {
      element.splice(0, 1);
    }
  }
  return element;
}

function contactNewInvisible(contactsNew, id) {
  if (contactsNew.length === 0) {
    let contactsSection = document.getElementById(`contacts_card${id}`);
    contactsSection.classList.add("d-none");
  }
}

function letterNewInvisible(map, id) {
  let letters = map.get(`${id}`)["letters"];
  if (letters.length == 1) {
    letters = [letters[0]];
  } else {
    letters = String(letters).split(",");
  }
  return letters;
}

function renderContactsCardDetail(contactsMap, contactsNew, letters, id, map) {
  contactsMap = checkIfString(contactsMap);
  contactsNew = contactsMap;
  contactNewInvisible(contactsNew, id);
  let contactColor = map.get(`${id}`)["colors"];
  contactColor = checkIfString(contactColor);
  letters = letterNewInvisible(map, id);
  let contactsSection = document.getElementById(`contacts_card${id}`);
  checkForContactNumber(contactsNew, letters, contactsSection, contactColor);
}

/**
 * This function will render the contacts on the right card
 *
 * @param {number} id of the map
 */
async function renderContactsCard(id) {
  let map = wichSection(id);
  let contactsMap = map.get(`${id}`)["contacts"];
  let contactsNew;
  let letters;
  renderContactsCardDetail(contactsMap, contactsNew, letters, id, map);
}

function threeDotsContact(
  colors,
  contactsSection,
  changedColorForDots,
  letters
) {
  for (let i = 0; i < 2; i++) {
    element = colors[i];

    contactsSection.innerHTML += `<p class="invate font" style="background-color: ${colors[i]};">${letters[i]}</p>`;
  }
  changedColorForDots = "#FFAA00";
  contactsSection.innerHTML += `<p class="invate font" style="background-color: ${changedColorForDots};">...</p>`;
}
