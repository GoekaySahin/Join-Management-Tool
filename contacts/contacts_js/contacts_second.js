/**
 * This function will show the editable version from the contact that seleted
 * @param {number} i index of the contact that opens on edit
 */
function openEditContact(i) {
  selectedContact = contacts[i];
  selectedColor = selectedContact["color"];
  selectedContactIndex = i;

  let nameInput = document.getElementById("input-name-edit");
  let mailInput = document.getElementById("input-mail-edit");
  let phoneInput = document.getElementById("input-phone-edit");
  let mobileRight = document.getElementById("mobile_right");

  setEditContact(nameInput, mailInput, selectedContact, phoneInput);

  removeBlurscreen();
  animateEditContact();
}

/**
 * This function will save the changes after editing
 * @param {string} contacts to safe
 * @param {string} name_input name
 * @param {string} mail_input mail
 * @param {string} phone_input phone number
 * @param {string} firstLetter letters
 */
async function setToSaveEditContact(
  contacts,
  name_input,
  mail_input,
  phone_input,
  firstLetter
) {
  let contact = {
    name: name_input.value,
    mail: mail_input.value,
    mobil: phone_input.value,
    color: selectedColor,
    firstLetters: firstLetter,
  };

  await deleteSelectedContact(contact);
  await saveMaps();
  selectedContact = null;
  setContactListByResponsive();
  renderContactList();
  closeBlurScreen();
  closeContactRight();
  setTimeout(() => {
    renderOpenDetail();
  }, 200);
}

async function saveEditContact() {
  let contacts = await JSON.parse(backend.getItem("contacts"));
  let name_input = document.getElementById("input-name-edit");
  let mail_input = document.getElementById("input-mail-edit");
  let phone_input = document.getElementById("input-phone-edit");
  let firstLetters = name_input.value.split(/\s+/).map((word) => word[0]);
  let firstLetter = firstLetters.join("");

  await setToSaveEditContact(
    contacts,
    name_input,
    mail_input,
    phone_input,
    firstLetter
  );
}
/**
 * This function will delete the specific contact
 * @param {string} contact name of the contact
 */
async function deleteSelectedContact(contact) {
  contacts[selectedContactIndex] = contact;
  await backend.setItem("contacts", JSON.stringify(contacts));
  await getMaps();
  searchMapsForContact(contact);
}

function setTodoGetMaps(todos) {
  if (todos.length > 1) {
    todosMap = new Map(Object.entries(JSON.parse(todos)));
  }
}

function setProgressGetMap(progresses) {
  if (progresses.length > 1) {
    progressesMap = new Map(Object.entries(JSON.parse(progresses)));
  }
}

function setFeedbacksGetMap(feedbacks) {
  if (feedbacks.length > 1) {
    feedbacksMap = new Map(Object.entries(JSON.parse(feedbacks)));
  }
}

function setDonesGetMap(dones) {
  if (dones.length > 1) {
    donesMap = new Map(Object.entries(JSON.parse(dones)));
  }
}

async function getMaps() {
  let todos = (await JSON.parse(backend.getItem("todoJson"))) || [];
  let progresses = (await JSON.parse(backend.getItem("progressJson"))) || [];
  let feedbacks = (await JSON.parse(backend.getItem("feedbackJson"))) || [];
  let dones = (await JSON.parse(backend.getItem("doneJson"))) || [];

  setTodoGetMaps(todos);
  setProgressGetMap(progresses);
  setFeedbacksGetMap(feedbacks);
  setDonesGetMap(dones);

  maps = [todosMap, progressesMap, feedbacksMap, donesMap];
}

/**
 * This function will check the right name for the map
 * @param {string} contacts name of the contact
 * @param {map} map the right
 * @param {number} index of the contact
 * @returns if contact is undefined
 */
function checkSetupMapsContact(contacts, map, index) {
  if (index.contacts == undefined) {
    return;
  } else {
    if (index.contacts.indexOf(selectedContact.name) >= 0) {
      let i = index.contacts.indexOf(selectedContact.name);
      index.contacts.splice(i, 1);
      if (typeof index.letters == "string") {
        index.letters = index.letters.split(",");
      }
      index.letters.splice(i, 1);
      index.letters.splice(i, 0, contacts.firstLetters);
      index.contacts.splice(i, 0, contacts.name);
    }
  }
}

function searchMapsForContact(contacts) {
  maps.forEach((map) => {
    map.forEach((index) => {
      checkSetupMapsContact(contacts, map, index);
    });
  });
}

function setContactListByResponsive() {
  const bodyWidth = document.body.offsetWidth;

  if (bodyWidth <= 800) {
    setTimeout(() => {
      document
        .getElementById("contact_list_container")
        .classList.remove("d-none");
      document.getElementById("new_contact_btn").classList.remove("d-none");
    }, 400);
  }
}

async function saveMaps() {
  const todos = JSON.stringify(Object.fromEntries(todosMap));
  await backend.setItem("todoJson", JSON.stringify(todos));
  const progresses = JSON.stringify(Object.fromEntries(progressesMap));
  await backend.setItem("progressJson", JSON.stringify(progresses));
  const feedbackes = JSON.stringify(Object.fromEntries(feedbacksMap));
  await backend.setItem("feedbackJson", JSON.stringify(feedbackes));
  const dones = JSON.stringify(Object.fromEntries(donesMap));
  await backend.setItem("doneJson", JSON.stringify(dones));
}

/**
 * This function will get the right date
 */
function dateFuture() {
  const today = new Date().toISOString().split("T")[0];
  let dateTask = document.getElementById("select-date-task");

  dateTask.setAttribute("min", today);
}

function removeBlurscreen() {
  let blurScreen = document.getElementById("blur_screen-edit");
  blurScreen.classList.remove("d-none");
}

function addBlurscreen() {
  let blurScreen = document.getElementById("blur_screen-edit");
  blurScreen.classList.add("d-none");
}

//  Render HMTL

/**
 * This function is to creat a string  and splice the comma
 * @param {value} element convert to string
 * @returns a string
 */
function checkIfString(element) {
  if (typeof element === "string") {
    element = element.split(",");
  }
  return element;
}

async function deleteActualContact(i) {
  let conatctDetail = document.getElementById("contact_right");
  contacts = await JSON.parse(backend.getItem("contacts"));
  contacts.splice(i, 1);
  await backend.setItem("contacts", JSON.stringify(contacts));
  conatctDetail.innerHTML = "";
  renderContactList();
}
