async function init() {
  await includeHTML();
  checkSize();
}

function hoverLegalNoticeHtml() {
  let legalNotice = document.getElementById("legal-notice-html");
  legalNotice.classList.add("legal_notice_html");
}

function goBackToLastPage() {
  window.history.back();
}

function hoverNoticeHtml() {
  let noticeBG = document.getElementById("notice_bg");
  noticeBG.classList.add("section-background-normal");
  noticeBG.classList.remove("section-background");
}

function hoverNoticeRespons() {
  let noticeBG = document.getElementById("notice_bg");
  noticeBG.classList.remove("section-background-normal");
  noticeBG.classList.add("section-background");
}

function checkSize() {
  let size = window.innerWidth;
  console.log(size);
  if (size <= 1024) {
    console.log("smaller than 1024");
    sidebarTabled();
  } else if (size > 1024) {
    console.log("bigger than 1024");

    sidebarDesktop();
    hoverNoticeHtml();
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

function draggableFalse() {
  let cards = document.getElementsByClassName("card");
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    card.setAttribute("draggable", false);
  }
}

function draggableTrue() {
  let cards = document.getElementsByClassName("card");
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    card.setAttribute("draggable", true);
    card.onmousedown = "";
  }
}
