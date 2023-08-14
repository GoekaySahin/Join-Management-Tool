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

/**
 * Check if dropdown add task for contacts are open
 */

function checkDropDownAddTaskBoard() {
  let dropDown = document.getElementById("contacts-drop-down");

  if (!dropDown.classList.contains("d-none")) {
    dropDown.classList.add("d-none");
  }
}
