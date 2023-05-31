async function init() {
  await includeHTML();
  checkSize();
}

function hoverPrivacyHtml() {
  let privacy = document.getElementById("privacy-html");
  privacy.classList.add("section-background-normal");
}

function goBackToLastPage() {
  window.history.back();
}

function checkSize() {
  let size = window.innerWidth;
  if (size <= 1024) {
    sidebarTabled();
  } else if (size > 1024) {
    sidebarDesktop();
    hoverPrivacyHtml();
  }
}

function sidebarTabled() {
  let sidebar = document.getElementById("sidebar");
  sidebar.classList.remove("sidebar");
  sidebar.classList.add("tablet-sidebar");
}

function sidebarDesktop() {
  let sidebar = document.getElementById("sidebar");

  sidebar.classList.add("sidebar");
  sidebar.classList.remove("tablet-sidebar");
}
