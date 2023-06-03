function renderPopupContactsHTML(colors, element, i, letters) {
  return `
        <div class="contactsDiv" id="contactsDiv${i}">
          <p class="invate font" style="background-color: ${colors[i]};">${letters[i]}</p>
          <p class="font fullName">${element}</p>
        </div>`;
}

function generateHTMLcontacts(element, i) {
  return `
    <div class="contacts-list-elem" >
      <label class="control control-checkbox" id="selected-contact${i}" onmouseup="addContactToTaskBoard(${i})">
        <div class="contacts-list-elem-box" id="${element["name"]}edit">
          <span id="name${i}" class="rendered-contact-name">${element["name"]}</span>
          <input id="contacts-checkbox${i}" type="checkbox" value="${element["name"]}" />
          <div id="control-indicator${i}" class="control-indicator control-setup"></div>
        </div>
      </label>
    </div>
    `;
}

function generateHTMLcontactsBoard(element, i, id) {
  return `
      <div class="contacts-list-elem">
        <label class="control control-checkbox" id="selected-contact${i}">
          <div class="contacts-list-elem-box" id="${element["name"]}">
            <span class="rendered-contact-name">${element["name"]}</span>
            <input onclick="addContactToTaskBoard(${i}, ${id})" id="contacts-checkbox${i}" type="checkbox" value="${element["name"]}" />
            <div id="control-indicator-${i}" class="control-indicator"></div>
          </div>
        </label>
      </div>
      `;
}

function generateHTMLcategory(categoryName, categoryColorTrue) {
  return `
  <div onclick="fillCategory('${categoryName}')" class="categories-list-elem">
    ${categoryName}
    <img src="../add_task/img-add_task/circle_${categoryColorTrue}.png" />
  </div>
  `;
}

function setCategoryToSales() {
  return `
      <div class="selected-category">
        Sales
        <img src="../add_task/img-add_task/circle_pink.png" />
      </div>
      `;
}

function setCategoryToBackoffice() {
  return `
      <div class="selected-category">
        Backoffice
        <img src="../add_task/img-add_task/circle_turquoise.png" />
      </div>
      `;
}

function setCategoryToNewCategory(categoryName, categoryColorTrue) {
  return `
    <div class="selected-category">
      ${categoryName}
      <img src="../add_task/img-add_task/circle_${categoryColorTrue}.png" />
    </div>
    `;
}

function generateHTMLnewCategoryNameAndColor(categoryName, categoryColorTrue) {
  return `
  <div class="selected-category">
    ${categoryName}
    <img src="../add_task/img-add_task/circle_${categoryColorTrue}.png" />
  </div>
  `;
}

function resetCategory() {
  return `
    <div class="selected-category">
      Select task category
    </div>
    `;
}

function generateHTMLsubtask(subtask, i) {
  return `
      <div class="subtask-list-elem">
        <label class="control control-checkbox" id="selected-subtask">
          <div class="subtask-list-elem-box">
            <input onclick="addSubtaskToTask(${i})" id="subtasks-checkbox-${i}" type="checkbox" value="${subtask}" checked/>
            <span class="rendered-subtask-name">${subtask}</span>
            <div class="control-indicator-subtask"></div>
          </div>
        </label>
      </div>
      `;
}

function newContactAddTask(index) {
  if (newContactAddTaskActive == true) {
    let invateContact;
    if (index == 1) {
      invateContact = document.getElementById("new_contact");
    } else if (index == 0) {
      invateContact = document.getElementById("new_contact-edit");
    }
    invateContact.innerHTML = `<div class="new-contact-add-task">
                                    <input onkeyup="" type="email" placeholder="Add Contact Email" class="add-subtask correct-width" id="add_task_email"> 
                                      <div id="new-subtask-accept" class="new-subtask-accept m-i-e">
                                        <img onmouseup="newContactAddTaskReturn()" src="../add_task/img-add_task/x_blue.png">
                                        <span>|</span>
                                        <img onclick="addNameNewContact()" src="../add_task/img-add_task/check_blue.png">
                                     </div>
                                  </div>`;
    invateContact.classList.remove("contacts-list-elem");
    invateContact.classList.remove("new-contact");
    invateContact.classList.add("invate-class");

    newContactAddTaskActive = false;
  }
}

function newContactEdit(index) {
  if (newContactAddTaskActive == true) {
    let invateContact;
    if (index == 1) {
      invateContact = document.getElementById("new_contact");
    } else if (index == 0) {
      invateContact = document.getElementById("new_contact-edit");
    }
    invateContact.innerHTML = `<div class="new-contact-add-task">
                                    <input onkeyup="" type="email" placeholder="Add Contact Email" class="add-subtask correct-width" id="add_task_email"> 
                                      <div id="new-subtask-accept" class="new-subtask-accept m-i-e">
                                        <img onmouseup="newContactAddTaskReturn()" src="../add_task/img-add_task/x_blue.png">
                                        <span>|</span>
                                        <img onclick="addNameNewContactEdit(${index})" src="../add_task/img-add_task/check_blue.png">
                                     </div>
                                  </div>`;
    invateContact.classList.remove("contacts-list-elem");
    invateContact.classList.remove("new-contact");
    invateContact.classList.add("invate-class");

    newContactAddTaskActive = false;
  }
}

function newContactAddTaskReturn() {
  let invateContact = document.getElementById("new_contact");
  let addTask = document.getElementById("add_task");

  if (addTask == null || addTask.classList.contains("d-none")) {
    invateContact = document.getElementById("new_contact-edit");
  }
  invateContact.classList.add("contacts-list-elem");
  invateContact.classList.add("new-contact");
  invateContact.classList.remove("invate-class");
  invateContact.innerHTML = `
  <span class="rendered-contact-name">Invite new contact</span>
    <img src="../add_task/img-add_task/contact_blue.png" />`;
  newContactAddTaskActive = true;
}

function addNameNewContact() {
  let emailInput = document.getElementById("add_task_email").value;
  if (!emailInput.includes(".")) {
    return;
  }
  let invateNewContactEmail = document.getElementById("add_task_email").value;
  email = [String(invateNewContactEmail)];
  let invateContact = document.getElementById("new_contact");
  if (invateContact == null) {
    invateContact = document.getElementById("new_contact-edit");
  }
  invateContact.innerHTML = `<div class="new-contact-add-task">
                                  <input onkeyup="" type="text" placeholder="First and Lastname" class="add-subtask correct-width" id="add_task_name"> 
                                    <div id="new-subtask-accept" class="new-subtask-accept m-i-e">
                                      <img onmouseup="newContactAddTaskReturn()" src="../add_task/img-add_task/x_blue.png">
                                      <span>|</span>
                                      <img onmouseup="creatNewContactAddTask()" src="../add_task/img-add_task/check_blue.png">
                                   </div>
                                </div>`;
}

function addNameNewContactEdit(index) {
  let emailInput = document.getElementById("add_task_email").value;
  if (!emailInput.includes(".")) {
    return;
  }
  let invateNewContactEmail = document.getElementById("add_task_email").value;
  email = [String(invateNewContactEmail)];
  let invateContact = document.getElementById("new_contact-edit");

  invateContact.innerHTML = `<div class="new-contact-add-task">
                                  <input onkeyup="" type="text" placeholder="First and Lastname" class="add-subtask correct-width" id="add_task_name"> 
                                    <div id="new-subtask-accept" class="new-subtask-accept m-i-e">
                                      <img onmouseup="newContactAddTaskReturn()" src="../add_task/img-add_task/x_blue.png">
                                      <span>|</span>
                                      <img onmouseup="creatNewContactEdit(${index})" src="../add_task/img-add_task/check_blue.png">
                                   </div>
                                </div>`;
}

function renderSubtaskPopupHTML(i, element, id) {
  return `
      <div id='subtask_checking${i}'>
        <p class="subtext" id="sub_p${i}">${element}</p>
        <div  class="sub-checkmark d-none">
          <img class="sub-img-setup d-none" id="cancel_sub${i}" src="../add_task/img-add_task/x_blue.png" onclick="removeProgress(${i}, ${id})">
          <span id="span${i}">|</span>
          <img  class="sub-img-setup" id="add_sub${i}" src="../add_task/img-add_task/check_blue.png" onclick="addProgress(${i}, ${id})">
        </div>
      </div>`; // beim checken hacken entfernen und das P element mit text-decoration: line-through; durchstreichen
}

function renderShowEdit(
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
) {
  colors.classList.add("d-none");
  popupTitle.innerHTML = `<input type="text" class="popup-title-edit" id="popup_title_edit" value="${title}">`;
  popupTitle.classList.add("set-title");
  cardConten.classList.add("set-content");
  popupDescription.innerHTML = descriptionHTML(description);
  date.innerHTML = dateHTML();
  prio.classList.add("correctPrio");
  prio.innerHTML = priorityHTML();
  assing.innerHTML += assignedHTML(id);
  contact.classList.add("flex-contact");
  editBox.innerHTML += `<button class="ok-text ok" id="ok" onclick="editDone(${id})">Done</button>
                        <button class="ok-text ok ok-delete" id="ok" onclick="deleteTask(${id})">Delete</button>`;
}
