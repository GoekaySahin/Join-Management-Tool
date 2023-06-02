setURL(
  "https://goekay-nuri-sahin.developerakademie.com/join/smallest_backend_ever"
);
let startposition;
let todosMap = new Map();
todosMap.set("x", { value: "none" });
let progressesMap = new Map();
progressesMap.set("x", { value: "none" });
let feedbacksMap = new Map();
feedbacksMap.set("x", { value: "none" });
let donesMap = new Map();
donesMap.set("x", { value: "none" });
let mapsList = [todosMap, progressesMap, feedbacksMap, donesMap];
let maps = [];
let mapsValue = ["description", "title"];
let comeFrom;
let comeTo;
let searchHits = [];
let searchInputs = [];
let contactsEdit = [];
let globalProgress = [];
let todo = "todo";
let feedback = "feedback";
let progress = "progress";
let done = "done";
let idCounter = 0;
let actualContacts;
let globalId;

/**
 * This function Initialized some functions that need to run with onload of the body
 *
 */
async function init() {
  await includeHTML();
  await downloadFromServer();
  draggableTrue();
  setTimeout(activateDragAndDrop, 400); /* setCards(); */
  await getMaps();
  generateCards();
  checkIfEmpty();
  tasks = (await JSON.parse(backend.getItem("tasks"))) || [];
  actualContacts = (await JSON.parse(backend.getItem("contacts"))) || [];
  getUrgentCounter();
  getCurrentContacts();
  setTimeout(load, 500);
  checkSize();
}

/**
 * This function will start the popup function to show big view
 *
 * @param {number} id of the map
 */
function openPopup(id) {
  generatePopup(id);
  popup();
  dateFutureTask();
  setId(id);
}

/**
 * This function returns if value is null otherwise it will change the section bg
 *
 * @returns return if no value
 */
function hoverBoardHtml() {
  let boardBG = document.getElementById("board_bg");
  if (boardBG == null) {
    return;
  }

  boardBG.classList.add("section-background-normal");
  boardBG.classList.remove("section-background");
}

/**
 * This function will change the background for responsive view
 *
 * @returns if value is null
 */
function hoverBoardRespons() {
  let boardBG = document.getElementById("board_bg");
  if (boardBG == null) {
    return;
  }
  boardBG.classList.remove("section-background-normal");
  boardBG.classList.add("section-background");
}

/**
 * Remove the display none from the div's and show the popup
 * scroll to the top for good view
 * block scolling while view on popup
 */
function popup(id) {
  let background = document.getElementById("popup");
  let card = document.getElementById("popup_card");
  let editPrio = document.getElementById("edit_priority");
  let title = document.getElementById("popup_title");
  let content = document.getElementById("card_content");

  editPrio.classList.remove("correctPrio");
  title.classList.remove("card-content-popup");
  content.classList.remove("set-content");

  setupForPopup(card, background);
  toggleArrows();
}

/**
 * This function is to apply the standart view on the popup
 *
 * @param {variable} card to show or hide
 * @param {*} background show or hide
 */
function setupForPopup(card, background) {
  window.scrollTo(0, 0);
  card.classList.toggle("d-none");
  background.classList.toggle("d-none");
  activateDragAndDrop();
  newContactAddTaskActive = true;
  selectedContacts = [];
}

/*  
/**
 * check size by onload and on resize window too and start the function
 * to set the sidebar and deactivate the dragAndDrop
 */
function checkSize() {
  let size = window.innerWidth;

  if (size <= 1024) {
    //addArrows();
    sidebarTabled();
    draggableFalse();
    hoverBoardRespons();
    //setTimeout(toggleArrows, 250);
  } else if (size > 1024) {
    draggableTrue();
    sidebarDesktop();
    hoverBoardHtml();
    if (activateDragAndDrop == undefined) {
      location.reload();
    } else {
      activateDragAndDrop();
    }
    //setTimeout(toggleArrows, 250);
  }
}

/**
 * set The Sidebar to the Bottom
 */
function sidebarTabled() {
  let sidebar = document.getElementById("sidebar");
  if (sidebar == null) {
    return;
  }

  sidebar.classList.remove("sidebar");
  sidebar.classList.add("tablet-sidebar");
}

/**
 * set the sidebar to the left
 */
function sidebarDesktop() {
  let sidebar = document.getElementById("sidebar");
  if (sidebar == null) {
    return;
  }

  sidebar.classList.add("sidebar");
  sidebar.classList.remove("tablet-sidebar");
}

/**
 * disable the dragAndDrop function
 */
function draggableFalse() {
  let cards = document.getElementsByClassName("card");

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    card.setAttribute("draggable", false);
  }
}

/**
 * abled the dragAndDrop
 */
function draggableTrue() {
  let cards = document.getElementsByClassName("card");

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    card.setAttribute("draggable", true);
    card.onmousedown = "";
  }
}

/**
 * This function starts the render function for the tasks
 *
 * @param {string} section in wich section it will be rendered
 */
function renderAddTask(section) {
  let addTask = document.getElementById("add_task");
  addTask.innerHTML = renderAddTaskHTML(section);
}

function checkFille() {
  allFieldsFilled();
  setTimeout(checkFille, 250);
}

/**
 * open addTask and remove the d-none class from the div with id add-task
 */
function openAddTask(section) {
  let addTask = document.getElementById("add_task");
  let list = document.getElementsByTagName("html");
  let html = list[0];
  if (section == undefined) {
    section = todosMap;
  }

  addTask.classList.toggle("d-none");
  window.scrollTo(0, 0);
  setTimeout(renderContactsAddTask, 250);
  html.classList.toggle("hide-overflow-y");
  renderAddTask(section);
  dateFutureTask();
  subtasks = [];
}

function clearContactsAndTask() {
  subtasks = [];
  selectedContacts = [];
}

/**
 * close the addTask div and add the d-none class from the div with id add-task
 */
function closeAddTask() {
  let addBoard = document.getElementById("add-board");
  let contactAdd = document.getElementById("new_contact").childNodes;

  addBoard.classList.remove("slide-left");
  addBoard.classList.add("slide-right");
  setTimeout(openAddTask, 350);
  clearContactsAndTask();
  subCounterAdd = 0;
  if (contactAdd.length == 1) {
    newContactAddTaskReturn();
  }
  filled = false;
  setTimeout(activateDragAndDrop, 50);
}

/**
 * This function will get the firstletter from all the contactas an return it as an array
 *
 * @param {array} contacts
 * @param {number} idCounter
 * @returns list of splitted names for small view colored background
 */
function getFirstLetter(contacts, idCounter) {
  let namesSplit = new Map();
  let nameList = [];
  let letterList = [];
  let firstLetters;

  nameList = setupForGetFirstLetter(
    contacts,
    firstLetters,
    letterList,
    nameList
  );
  namesSplit.set(`${idCounter}`, {
    contacts: `${nameList}`,
    letters: `${letterList}`,
  });
  return namesSplit;
}

function setupForGetFirstLetter(contacts, firstLetters, letterList, nameList) {
  for (let i = 0; i < contacts.length; i++) {
    const element = contacts[i];
    if (element == "") {
      continue;
    }
    let name = element.split(" ");
    let justName = `${name[0]} ${name[1]}`;
    let firstLetter = name[0].split("");
    if (name[1] == undefined) {
      firstLetters = firstLetter[0];
      firstLetters = firstLetters.toUpperCase();
      letterList.push(firstLetters);
    } else {
      let secondLetter = name[1].split("");
      firstLetters = firstLetter[0] + secondLetter[0];
      firstLetters = firstLetters.toUpperCase();
      letterList.push(firstLetters);
    }

    nameList.push(justName);
  }
  return nameList;
}

/**
 *  This function creats new colors for background of fristletter colored
 * @returns a number of colors after a hastag randomly
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

/**
 * Check the idCounter if empty than set to zero
 */
function checkIdCounter() {
  loadCounter();
  if (idCounter == "leer") {
    idCounter = 0;
  }
}

/**
 * This function is to check and creat new colors for contacts
 *
 * @param {array} contacts of contacts
 * @returns
 */
async function checkContactsColor(contacts) {
  let contactsBackend = await JSON.parse(backend.getItem("contacts"));
  let contactData = [];

  contactData = creatNewColors(contacts, contactData, contactsBackend);
  return contactData;
}

function creatNewColors(contacts, contactData, contactsBackend) {
  for (let j = 0; j < contacts.length; j++) {
    const contact = contacts[j];
    for (let i = 0; i < contactsBackend.length; i++) {
      const element = contactsBackend[i];
      if (element["name"].includes(contact)) {
        if (element["color"] == undefined) {
          contactData.push(element["colors"]);
        } else {
          contactData.push(element["color"]);
        }
      }
    }
  }
  return contactData;
}

/**
 * This function start the generating of the card in the sections
 */
function generateCards() {
  setTasks("todo");
  setCards("progress");
  setCards("feedback");
  setCards("done");
  toggleArrows();
}

/**
 * This function will creat new tasks that come from add-task.html or direct from board-add-task
 *
 * @param {string} section in wich the task will created
 */
async function setTasks(section) {
  let map = checkWichMap(section);
  let tasks = (await JSON.parse(backend.getItem("tasks"))) || [];
  let doneCoordinates = [];
  let colors = [];

  await checkSetTask(map, tasks, doneCoordinates, colors);
  await saveAndResetCounterAndTask();
  setCards(todo);
  setCards(progress);
  setCards(feedback);
  setCards(done);
  toggleArrows();
}

async function checkSetTask(map, tasks, doneCoordinates, colors) {
  if (tasks.length > 0) {
    for (let i = 0; i < tasks.length; i++) {
      checkIdCounter();
      key = tasks[i];
      await creatNewCard(map, key, colors, doneCoordinates);
    }
  }
}

/**
 * Delete the tasks, that are generated allready, and save the tasks on board
 */
async function saveAndResetCounterAndTask() {
  await backend.deleteItem("tasks");
  tasks = [];
  await saveMaps();
  currentId = idCounter;
}

/**
 * This function is creat the new card on board and save the idcounter
 *
 * @param {string} map the map itself as string
 * @param {number} key of the map
 * @param {string} colors of the contacts small view colored circle
 * @param {array} doneCoordinates wich are done wich should be done
 */
async function creatNewCard(map, key, colors, doneCoordinates) {
  let namesSplit = splitName(key);
  doneCoordinates = setDoneCoordinates(doneCoordinates);
  colors = await defineColors(key);
  setNewCard(map, key, colors, namesSplit, doneCoordinates);
  subtask = map.get(`${idCounter}`)["substack"];
  idCounter++;
  idCounterToBackend();
}

/**
 *  This function is to set the subtasks on the card small view and how much are done or not
 * @param {array} doneCoordinates of the subtasks that are done or not
 * @returns
 */
function setDoneCoordinates(doneCoordinates) {
  let subtaskLength = key["subtasks"].length;
  if (subtaskLength > 0) {
    for (let j = 0; j < subtaskLength; j++) {
      doneCoordinates.push(`cancel_sub${j}`);
    }
  }
  return doneCoordinates;
}

/**
 * This function is to check the color and safe it
 *
 * @param {map} key is the map of the contact
 * @returns
 */
async function defineColors(key) {
  if (key[`colors`] == undefined) {
    return (colors = await checkContactsColor(key["contacts"]));
  } else {
    return (colors = key[`colors`]);
  }
}

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

function twoDotsContact(
  colors,
  contactsSection,
  changedColorForDots,
  letters,
  contacts
) {
  for (let i = 0; i < contacts.length; i++) {
    const element = colors[i];

    contactsSection.innerHTML += `<p class="invate font" style="background-color: ${colors[i]};">${letters[i]}</p>`;
  }
}

function oneDotContact(
  colors,
  contactsSection,
  changedColorForDots,
  letters,
  contacts
) {
  for (let i = 0; i < contacts.length; i++) {
    const element = colors[i];

    contactsSection.innerHTML += `<p class="invate font" style="background-color: ${colors};">${letters[i]}</p>`;
  }
}
/**
 * This function check how much contacts a card have and redner it
 * if it has more than two so the third will be dottet no matter how much are invted there are at the end just
 * three dots
 *
 * @param {array} contacts that will show in small view
 * @param {array} letters letter that are created of the contacts
 * @param {string} contactsSection in wich section the contacts are on the card
 * @param {array} colors color of the background on the circle wich are colored
 */
function checkForContactNumber(contacts, letters, contactsSection, colors) {
  let changedColorForDots = [];
  if (contacts[0] == contacts[1]) {
    contacts.splice(0, 1);
  }
  contactsSection.innerHTML = "";

  if (contacts.length > 2) {
    threeDotsContact(
      colors,
      contactsSection,
      changedColorForDots,
      letters,
      contacts
    );
  } else if (contacts.length == 2) {
    twoDotsContact(
      colors,
      contactsSection,
      changedColorForDots,
      letters,
      contacts
    );
  } else {
    oneDotContact(
      colors,
      contactsSection,
      changedColorForDots,
      letters,
      contacts
    );
  }
}

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

/**
 * This function will start if user will edit
 * is change the layout
 * @param {number} id of the map
 */
function edit(id) {
  addEditClasses();
  let currentMap = new Map(checkMap(id));
  let popTop = document.getElementById("popup_card");
  let title = currentMap.get(`${id}`)["title"];
  let description = currentMap.get(`${id}`)["description"];
  let names = document.getElementsByClassName("fullName");
  let contactsInEdit = [];

  for (let i = 0; i < names.length; i++) {
    const element = names[i];
    element.classList.add("d-none");
    let contact = element.innerHTML;
    contactsInEdit.push(contact);
  }
  setTimeout(renderContactsSelection, 150, contactsInEdit);
  setTimeout(ContactsDivDisplay, 1, contactsInEdit);

  showEdit(title, description, id);
  dateFuture();
  setSubtasksLayout(id);
  toggleEditTitle();
  checkExistContact(id);
  /*   openEditContactsToSelect(id);
  openEditContactsToSelect(id); */
  setTimeout(checkExistContact, 100, id);
  editDnone();
  setEditPrio(id);
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

/**
 * Safe all maps direct
 */
async function saveMaps() {
  await saveTodo();
  await saveProgress();
  await saveFeedback();
  await saveDone();
}

/**
 * save idCounter in backend
 */
async function idCounterToBackend() {
  await backend.setItem("count", JSON.stringify(idCounter));
}

/**
 * Load idCounter from backend
 */
async function loadCounter() {
  idCounter = parseInt(await JSON.parse(backend.getItem("count"))) || 0;
}

/**
 * if nothing in maps mean empty delete idCounter
 */
async function checkIfEmpty() {
  if (
    todosMap.size === 1 &&
    progressesMap.size === 1 &&
    feedbacksMap.size == 1 &&
    donesMap.size === 1
  ) {
    await backend.deleteItem("count");
    idCounter = 0;
  }
}

// SERACH SECTION
function takeSearch() {
  setTimeout(serach, 200);
}

function emptySearchArrays() {
  searchHits = [];
  searchInputs = [];
}

/**
 * This function searchs the value that will type in on cards tasks
 */
async function serach() {
  emptySearchArrays();
  let input = document.getElementById("inp-board").value;

  if (input === "") {
    generateCards();
    setTimeout(activateDragAndDrop, 150);
  } else {
    checkInput(input);
    highlightAndDone();
  }
}

function checkInput(input) {
  input = input.toLowerCase();

  for (let i = 0; i < maps.length; i++) {
    const map = maps[i];
    searchMaps(map, input);
  }
}

/**
 * This function will highlight the input that are founded on the card task
 *
 * @param {string} input to serach on task card
 * @param {number} key from the card task
 */
function highlightText(input, key) {
  let title = document.getElementById(`title${key}`);
  let description = document.getElementById(`description${key}`);
  let inputs = input;
  inputs = inputs.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  let pattern = new RegExp(`${inputs}`, "gi");

  title.innerHTML = title.textContent.replace(
    pattern,
    (match) => `<mark>${match}</mark>`
  );
  description.innerHTML = description.textContent.replace(
    pattern,
    (match) => `<mark>${match}</mark>`
  );
}

/**
 *
 * @param {map} map to search
 * @param {string} input the type in wich are searched
 */
function searchMaps(map, input) {
  for (const [key, value] of map) {
    if (key == "x") {
      continue;
    }
    searchInValue(value, key, input);
  }
}

/**
 * This function checks if number is type in
 * @returns boolean
 */
function valueAndInputCheck(values, input) {
  return (
    Number.isInteger(parseInt(values)) && Number.isInteger(parseInt(input))
  );
}

function valueAndInputCheckEmpty(values) {
  return values == "" || values === [] || values == undefined;
}

function valueAndInputIsInteger(values, input) {
  return (
    Number.isInteger(parseInt(values)) || Number.isInteger(parseInt(input))
  );
}

function valueArray(value, element, key, input) {
  for (let j = 0; j < values.length; j++) {
    const element = values[j];
    checkIfIncludes(element, key, input);
  }
}

function searchInValue(value, key, input) {
  for (let i = 0; i < mapsValue.length; i++) {
    let values = value[mapsValue[i]];
    if (valueAndInputCheckEmpty(values)) {
      continue;
    }
    if (valueAndInputCheck(values, input)) {
      outputNumber(values, key, input);
    } else if (valueAndInputIsInteger(values, input)) {
      continue;
    } else if (Array.isArray(values)) {
      valueArray(value, element, key, input);
    } else if (mapsValue[i] === "description" || mapsValue[i] === "title") {
      checkIfIncludes(values, key, input);
    } else {
      checkIfNumberIncludes(values, key, input);
      checkIfIncludes(values, key, input);
    }
  }
}

function checkIfIncludes(values, key, input) {
  if (!Number.isInteger(values)) {
    values = values.toLowerCase();
    outputSerach(values, key, input);
  }
}

function outputSerach(values, key, input) {
  if (values.includes(input)) {
    PushInArray(values, key, input);
  }
}

function outputNumber(values, key, input) {
  if (values.includes(input) && firstNumber.includes(input)) {
    highlightText(input, key);
    for (let i = idCounter - 1; i > -1; i--) {
      let card = document.getElementById(`card${i}`);
      card.classList.add("d-none");
    }
    let shine = document.getElementById(`card${key}`);
    shine.classList.remove("d-none");
  }
}

function PushInArray(values, key, input) {
  if (searchHits.indexOf(key) === -1) {
    searchInputs.push(input);
    searchHits.push(key);
  }
}

function highlightAndDone() {
  for (let i = idCounter - 1; i > -1; i--) {
    let card = document.getElementById(`card${i}`);
    if (card == null) {
      debugger;
    }
    card.classList.add("d-none");
  }

  for (let j = 0; j < searchHits.length; j++) {
    let idS = +searchHits[j];
    let inpS = searchInputs[j];
    let shine = document.getElementById(`card${idS}`);
    shine.classList.remove("d-none");
    highlightText(inpS, idS);
  }
}

/**
 * This function is to delete all maps and counter
 */
async function cut() {
  await backend.deleteItem("todoJson");
  await backend.deleteItem("urgentCounter");
  await backend.deleteItem("progressJson");
  await backend.deleteItem("feedbackJson");
  await backend.deleteItem("doneJson");
}

/**
 * This function will check screen size and toggle the edit popup
 */
function addEditClasses() {
  if (screen.width < 500) {
    let editPopup = document.getElementById("popup_card");
    editPopup.classList.toggle("editRespons");
  }
}

function editDnone() {
  let editButton = document.getElementById("edit-none");
  editButton.classList.add("d-none");
}

function setId(id) {
  globalId = id;
}

/**
 * This function will change the section of the card
 * @param {number} id of the map
 * @returns
 */
function turnLeft(id) {
  let parent = document.getElementById(`card${id}`);
  parent.classList.add("d-none");
  if (parent.parentNode.id.includes("todo")) {
    return;
  } else if (parent.parentNode.id.includes("progress")) {
    progressTodo(id);
  } else if (parent.parentNode.id.includes("feedback")) {
    feedbackProgress(id);
  } else if (parent.parentNode.id.includes("done")) {
    doneFeedback(id);
  }
  openPopup(id);
  if (window.innerWidth > 1024) {
    setTimeout(activateDragAndDrop, 50);
  }
  //toggleArrows();
}

function progressTodo(id) {
  todosMap.set(`${id}`, progressesMap.get(`${id}`));
  progressesMap.delete(`${id}`);
}

function feedbackProgress(id) {
  progressesMap.set(`${id}`, feedbacksMap.get(`${id}`));
  feedbacksMap.delete(`${id}`);
}

function doneFeedback(id) {
  feedbacksMap.set(`${id}`, donesMap.get(`${id}`));
  donesMap.delete(`${id}`);
}

/**
 * This function is to set the card one section to right
 *
 * @param {number} id of the map
 * @returns
 */
function turnRight(id) {
  let parent = document.getElementById(`card${id}`);
  parent.classList.add("d-none");
  if (parent.parentNode.id.includes("done")) {
    return;
  } else if (parent.parentNode.id.includes("feedback")) {
    feedbackDone(id);
  } else if (parent.parentNode.id.includes("progress")) {
    progressFeedback(id);
  } else if (parent.parentNode.id.includes("todo")) {
    todoProgress(id);
  }
  openPopup(id);
  if (window.innerWidth > 1024) {
    setTimeout(activateDragAndDrop, 50);
  }
  //toggleArrows();
}

/**
 * This function is used to delete the index from one map and added to another
 *
 * @param {number} id of the map
 */
function todoProgress(id) {
  progressesMap.set(`${id}`, todosMap.get(`${id}`));
  todosMap.delete(`${id}`);
}

/**
 * This function is used to delete the index from one map and added to another
 *
 * @param {number} id of the map
 */
function progressFeedback(id) {
  feedbacksMap.set(`${id}`, progressesMap.get(`${id}`));
  progressesMap.delete(`${id}`);
}

function feedbackDone(id) {
  donesMap.set(`${id}`, feedbacksMap.get(`${id}`));
  feedbacksMap.delete(`${id}`);
}

/**
 * This function is used to delete the index from one map and added to another
 *
 * @param {number} id of the map
 */
function toggleArrows() {
  for (let i = 0; i < idCounter; i++) {
    const arrows = document.getElementById(`arrows_card${i}`);
    if (arrows == null) {
      return;
    }
    if (
      window.innerWidth > 1024 &&
      !arrows.classList.value.includes("d-none")
    ) {
      arrows.classList.add("d-none");
    } else if (
      arrows.classList.value.includes("d-none") &&
      window.innerWidth < 1024
    ) {
      arrows.classList.remove("d-none");
    }
  }
}
function addArrows() {
  for (let i = 0; i < idCounter; i++) {
    const arrows = document.getElementById(`arrows_card${i}`);
    if (arrows == null) {
      return;
    }
    if (window.innerWidth < 1024) {
      arrows.classList.remove("d-none");
    }
  }
}

/**
 * Loading screen
 */
function load() {
  let loader = document.getElementById("loader");
  loader.classList.toggle("d-none");
  //toggleArrows();
}
