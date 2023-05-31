function checkMainSize() {
  let size = window.innerWidth;
  if (size < 1024) {
    sidebarMainTabled();
    hoverSummaryRespons();
  } else if (size > 1024) {
    enableMainSidebar();
    hoverSummaryHtml();
  }
}

function hoverSummaryHtml() {
  let summaryHtml = document.getElementById("summary-html");
  let summaryBg = document.getElementById("summary_bg");

  summaryHtml.classList.add("section-background-normal");
  summaryBg.classList.remove("section-background");
}

function hoverSummaryRespons() {
  let summaryBg = document.getElementById("summary_bg");

  summaryBg.classList.remove("section-background-normal");
  summaryBg.classList.add("section-background");
}

function sidebarMainTabled() {
  let sidebar = document.getElementById("sidebar");
  let header = document.getElementById("header-name");
  let helpBtn = document.getElementById("help-section-btn");

  sidebar.classList.remove("sidebar");
  sidebar.classList.add("tablet-sidebar");
  helpBtn.classList.add("d-none");
  header.classList.add("d-none");
}

function enableMainSidebar() {
  let sidebar = document.getElementById("sidebar");
  let header = document.getElementById("header-name");
  let helpBtn = document.getElementById("help-section-btn");

  sidebar.classList.add("sidebar");
  sidebar.classList.remove("tablet-sidebar");
  helpBtn.classList.remove("d-none");
  header.classList.remove("d-none");
}
