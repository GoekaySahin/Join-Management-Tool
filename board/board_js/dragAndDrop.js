let dragItem = null;
let secTodo = document.getElementById("todo-board");
let secProgress = document.getElementById("progress-board");
let secFeedback = document.getElementById("feedback-board");
let secDone = document.getElementById("done-board");
let draggedItem;

/**
 * This function will make it possible for the drag and drop function
 * ist takes the field where drag and drop is possible
 */
async function activateDragAndDrop() {
  let card = document.getElementsByClassName("card");
  let choice = document.getElementsByClassName("choice");

  for (let i of card) {
    i.addEventListener("dragstart", dragStart);
    i.addEventListener("dragend", dragEnd);
  }

  for (j of choice) {
    j.addEventListener("dragover", dragOver);
    j.addEventListener("dragenter", dragEnter);
    j.addEventListener("dragleave", dragLeave);
    j.addEventListener("drop", Drop);
  }
}

/**
 * Where the card come from where it goes
 */
function setFeedback() {
  secTodo.addEventListener("dragend", (event) => {
    event.preventDefault();
    comeTo = "todo";
  });
  secTodo.addEventListener("dragstart", (event) => {
    event.preventDefault();
    comeFrom = "todo";
  });

  secProgress.addEventListener("dragend", (event) => {
    event.preventDefault();
    comneTo = "progress";
  });

  secProgress.addEventListener("dragstart", (event) => {
    event.preventDefault();
    comeFrom = "progress";
  });

  secFeedback.addEventListener("dragend", (event) => {
    event.preventDefault();
    comeTo = "feedback";
  });

  secFeedback.addEventListener("dragstart", (event) => {
    event.preventDefault();
    comeFrom = "feedback";
  });

  secDone.addEventListener("dragend", (event) => {
    event.preventDefault();
    comeTo = "done";
  });

  secDone.addEventListener("dragstart", (event) => {
    event.preventDefault();
    comeFrom = "done";
  });
}

/**
 * This function will be able the dragstart and make the card on the place invisible
 *
 * @returns if screen width is smaller tahn 1024px dragstar ist not able
 */
function dragStart() {
  if (window.innerWidth < 1024) {
    return;
  }
  dragItem = this;
  comeFrom = this.parentNode;
  draggedItem = this;

  setTimeout(() => (this.style.display = "none"), 0);
}

/**
 * This functionset the card on drag end and make it visible on the right place
 * @returns if screen width is smaller tahn 1024px dragstar ist not able
 */
function dragEnd() {
  if (window.innerWidth < 1024) {
    return;
  }
  setTimeout(() => (this.style.display = "block"), 0);

  dragItem = null;
  checkCards();
  saveMaps();
}

async function Drop() {
  if (window.innerWidth < 1024) {
    return;
  }
  this.append(dragItem);
  this.classList.remove("hover");
  comeTo = this.parentNode;
  /*   setTimeout(ScrollbarExist, 250); */
}

function dragOver(e) {
  if (window.innerWidth < 1024) {
    return;
  }
  this.classList.add("hover");
  e.preventDefault();
}

function dragEnter(e) {
  if (window.innerWidth < 1024) {
    return;
  }
  e.preventDefault();
}

function dragLeave() {
  if (window.innerWidth < 1024) {
    return;
  }
  this.classList.remove("hover");
}
