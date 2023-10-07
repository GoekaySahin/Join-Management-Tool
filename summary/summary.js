let task_cards = [];
let ShowCurrentUserNameForSummery = [];
const month = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const d = new Date();
setURL("https://join.xn--gkay-sahin-ecb.de/smallest_backend_ever/");

async function init() {
  await includeHTML();
  await downloadFromServer();
  loadAtStart();
  checkSize();
  await getMaps();
  renderCurrentDate();
  task_cards = JSON.parse(backend.getItem("tasks")) || [];
  setTimeout(renderAmountToTasks, 150);
  await greetUser();

  /**
   * Load user or guest to greet user
   */
  function loadAtStart() {
    let nameTest = JSON.parse(backend.getItem("currentUser")) || [];
    if (nameTest.length < 2) {
      ShowCurrentUserNameForSummery = "Guest user";
    } else {
      ShowCurrentUserNameForSummery = nameTest;
    }
  }
}

/**
 * Check size for menu bar
 */
function checkSize() {
  let size = window.innerWidth;

  if (size <= 1024) {
    sidebarTabled();
    hoverSummaryRespons();
  } else if (size > 1024) {
    sidebarDesktop();
    hoverSummaryHtml();
  }
}

function sidebarTabled() {
  let sidebar = document.getElementById("sidebar");
  if (sidebar == null) {
    return;
  }

  sidebar.classList.remove("sidebar");
  sidebar.classList.add("tablet-sidebar");
}

function sidebarDesktop() {
  let sidebar = document.getElementById("sidebar");
  if (sidebar == null) {
    return;
  }

  sidebar.classList.add("sidebar");
  sidebar.classList.remove("tablet-sidebar");
}

function hoverSummaryHtml() {
  let summaryHtml = document.getElementById("summary-html");
  let summaryBg = document.getElementById("summary_bg");

  summaryHtml.classList.add("section-background-normal");
  summaryBg.classList.remove("section-background");
}

function hoverSummaryRespons() {
  let summaryBg = document.getElementById("board_bg");

  summaryBg.classList.remove("section-background-normal");
  summaryBg.classList.add("section-background");
}

/**
 * Greet User function with right time
 */
async function greetUser() {
  let currentTime = new Date().getHours();
  let name = ShowCurrentUserNameForSummery["userName"];
  let greetTime = document.getElementById("greet-at-time");
  let greetUser = document.getElementById("greet-user");

  if (currentTime < 12) {
    greetTime.innerHTML = "Good morning, ";
  } else if (currentTime < 17) {
    greetTime.innerHTML = "Good afternoon, ";
  } else {
    greetTime.innerHTML = "Good evening, ";
  }
  if (name == undefined) {
    greetUser.innerHTML = ShowCurrentUserNameForSummery;
  } else {
    greetUser.innerHTML = ShowCurrentUserNameForSummery["userName"];
  }
}

/**
 * Get current date and time
 */
function renderCurrentDate() {
  let currentYear = new Date().getFullYear().toString();
  let currentDay = new Date().getDate().toString();
  let currentMonth = month[d.getMonth()];
  let dateUrgent = document.getElementById("urgent-date");

  dateUrgent.innerHTML = `${currentMonth} ${currentDay}, ${currentYear}`;
}

/**
 * Get trasks on board and show a small view
 */
async function renderAmountToTasks() {
  let urgentCounter = (await backend.getItem("urgentCounter")) || 0;
  let taskId = document.getElementById("task-id-");
  let todo = document.getElementById("task-to-do-id-");
  let taskBoard = document.getElementById("task-in-board-id-");
  let taskPorgress = document.getElementById("task-in-progress-id-");
  let feedback = document.getElementById("task-awaiting-feedback-id-");
  let done = document.getElementById("task-done-id-");

  taskId.innerHTML = urgentCounter;
  todo.innerHTML = todosMap.size - 1;
  taskBoard.innerHTML =
    todosMap.size + progressesMap.size + feedbacksMap.size + donesMap.size - 4;
  taskPorgress.innerHTML = progressesMap.size - 1;
  feedback.innerHTML = feedbacksMap.size - 1;
  done.innerHTML = donesMap.size - 1;
}

function goToBoard() {
  window.location = "../board/board.html";
}
