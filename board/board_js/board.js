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
  let body = document.body;

  body.classList.toggle("hide-overflow-y");
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
