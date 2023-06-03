function openContactsOnContactsHtml() {
  renderContactsAddTask();
  openContactsToSelect();
}

function renderContactsRasterHTML() {
  return `
         <div id="contact-list-id" class="contact-list-inner-container">
           <div id="a_container">
              <div class="contact-char">A</div>
              <hr class="underline" />
            </div>
            <div id="a"></div>

            <div id="b_container">
              <div class="contact-char">B</div>
              <hr class="underline" />
            </div>
            <div id="b"></div>

            <div id="c_container">
              <div class="contact-char">C</div>
              <hr class="underline" />
            </div>
            <div id="c"></div>

            <div id="d_container">
              <div class="contact-char">D</div>
              <hr class="underline" />
            </div>
            <div id="d"></div>

            <div id="e_container">
              <div class="contact-char">E</div>
              <hr class="underline" />
            </div>
            <div id="e"></div>

            <div id="f_container">
              <div class="contact-char">F</div>
              <hr class="underline" />
            </div>
            <div id="f"></div>

            <div id="g_container">
              <div class="contact-char">G</div>
              <hr class="underline" />
            </div>
            <div id="g"></div>

            <div id="h_container">
              <div class="contact-char">H</div>
              <hr class="underline" />
            </div>
            <div id="h"></div>

            <div id="i_container">
              <div class="contact-char">I</div>
              <hr class="underline" />
            </div>
            <div id="i"></div>

            <div id="j_container">
              <div class="contact-char">J</div>
              <hr class="underline" />
            </div>
            <div id="j"></div>

            <div id="k_container">
              <div class="contact-char">K</div>
              <hr class="underline" />
            </div>
            <div id="k"></div>

            <div id="l_container">
              <div class="contact-char">L</div>
              <hr class="underline" />
            </div>
            <div id="l"></div>

            <div id="m_container">
              <div class="contact-char">M</div>
              <hr class="underline" />
            </div>
            <div id="m"></div>

            <div id="n_container">
              <div class="contact-char">N</div>
              <hr class="underline" />
            </div>
            <div id="n"></div>

            <div id="o_container">
              <div class="contact-char">O</div>
              <hr class="underline" />
            <div>
            <div id="o"></div>

            <div id="p_container">
              <div class="contact-char">P</div>
              <hr class="underline" />
            </div>
            <div id="p"></div>

            <div id="q_container">
              <div class="contact-char">Q</div>
              <hr class="underline" />
            <div>
            <div id="q"></div>

            <div id="r_container">
              <div class="contact-char">R</div>
              <hr class="underline" />
            </div>
            <div id="r"></div>

            <div id="s_container">
              <div class="contact-char">S</div>
              <hr class="underline" />
            </div>
            <div id="s"></div>

            <div id="t_container">
              <div class="contact-char">T</div>
              <hr class="underline" />
            </div>
            <div id="t"></div>

            <div id="u_container">
              <div class="contact-char">U</div>
              <hr class="underline" />
            </div>
            <div id="u"></div>

            <div id="v_container">
              <div class="contact-char">V</div>
              <hr class="underline" />
             </div>
            <div id="v"></div>

            <div id="w_container">
              <div class="contact-char">W</div>
              <hr class="underline" />
            </div>
            <div id="w"></div>

            <div id="x_container">
              <div class="contact-char">X</div>
              <hr class="underline" />
            </div>
            <div id="x"></div>

            <div id="y_container">
              <div class="contact-char">Y</div>
              <hr class="underline" />
            </div>
            <div id="y"></div>

            <div id="z_container">
              <div class="contact-char">Z</div>
              <hr class="underline" />
            </div>
            <div id="z"></div>
          </div>
            `;
}

function showNoContacts() {
  document.getElementById("contact_list_container").innerHTML = `
    <div class="no-contacts">
      <h4>No contacts yet. <br> Please add a new contact!</h4>
    </div>
    `;
}

function ContactListHTML(id, acronym, i, element) {
  document.getElementById(id).innerHTML += `
    <div class="contact" id="contact${i}" onclick="openContactDetail(${i})">
      <div id="circle_contacts${i}" class="circle">${acronym.toUpperCase()}</div>
      <div class="contact-info-container">
      <span class="contact-name">${element["name"]}</span>
      <span id="contact-email-${i}" class="contact-email">${
    element["mail"]
  }</span>
      </div>
    </div>
    `;
}

function renderOpenDetail(i) {
  document.getElementById("contact_right").innerHTML = `
    <img onclick="closeDetail()" class="d-none" id="backarrow" src="img/backarrow.png" alt="" />
    <div class="name-container">
      <div class="circle-right" id="circle_right"></div>
      <div class="name">
        <h1 id="name_right"></h1>
        <div class="name-addTask">
          <div onclick="openAddTask()"  class="add-task-opener">
              <img class="cross" src="img/cross.png" alt="" />
              <p>Add Task</p>
          </div>
          <div onclick="openEditContact(${i})" id="edit_contact_pencil" class="edit-contact">
            <img src="img/pencil.png" alt="" />
            <p>Edit Contact</p>
          </div>
        </div>
      </div>
    </div>

    <div class="contact-information-container">
      <div class="contact-information">
        <h2>Contact Information</h2>
        <div class="info-email">
          <p>Email</p>
          <span id="mail_right"></span>
        </div>
        <div class="info-mobil">
          <p>Mobil</p>
          <span id="mobil_right"></span>
        </div>
      </div>
    </div>
    <button class="save-btn deleteBTN" onclick="deleteActualContact(${i})" >delete</button>
    <img onclick="openEditContact(${i})" src="img/edit-contact.png" id="edit_contact" class="d-none" alt="" />
    `;
}

function renderDetailHTML(name, email, phone, acronym, color) {
  let cRight = document.getElementById("contact_right");
  let nRight = document.getElementById("name_right");
  let mRight = document.getElementById("mail_right");
  let circleRight = document.getElementById("circle_right");
  let mobileRight = document.getElementById("mobil_right");

  cRight.classList.remove("d-none");
  nRight.innerHTML = name;
  mRight.innerHTML = email;

  if (phone == undefined) {
    mobileRight.innerHTML = "";
  } else {
    mobileRight.innerHTML = `${phone}`;
  }
  circleRight.innerHTML = acronym.toUpperCase();
  circleRight.style.background = color;
}

function renderDetailHTMLRespons() {
  let newBtn = document.getElementById("new_contact_btn");
  let contactList = document.getElementById("contact_list_container");
  let editPush = document.getElementById("edit_contact_pencil");
  let back = document.getElementById("backarrow");
  let editContact = document.getElementById("edit_contact");
  let contactRight = document.getElementById("contact_right");

  newBtn.classList.add("d-none");
  contactList.classList.add("d-none");
  editPush.classList.add("d-none");
  back.classList.remove("d-none");
  contactRight.classList.remove("d-none");
  editContact.classList.remove("d-none");
}

function disableContactContainer() {
  let alphabet = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "x",
    "y",
    "z",
  ];

  alphabet.forEach((letter) => {
    let container = `${letter}_container`;
    if (document.getElementById(`${letter}`).innerHTML < 1) {
      document.getElementById(container).classList.add("d-none");
    } else {
      document.getElementById(container).classList.remove("d-none");
    }
  });
}
