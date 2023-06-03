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
  let a = document.getElementById("a");
  let b = document.getElementById("b");
  let c = document.getElementById("c");
  let d = document.getElementById("d");
  let e = document.getElementById("e");
  let f = document.getElementById("f");
  let g = document.getElementById("g");
  let h = document.getElementById("h");
  let i = document.getElementById("i");
  let j = document.getElementById("j");
  let k = document.getElementById("k");
  let l = document.getElementById("l");
  let m = document.getElementById("m");
  let n = document.getElementById("n");
  let o = document.getElementById("o");
  let p = document.getElementById("p");
  let q = document.getElementById("q");
  let r = document.getElementById("r");
  let s = document.getElementById("s");
  let t = document.getElementById("t");
  let u = document.getElementById("u");
  let v = document.getElementById("v");
  let w = document.getElementById("w");
  let x = document.getElementById("x");
  let y = document.getElementById("y");
  let z = document.getElementById("z");

  let aContainer = document.getElementById("a_container");
  let bContainer = document.getElementById("b_container");
  let cContainer = document.getElementById("c_container");
  let dContainer = document.getElementById("d_container");
  let eContainer = document.getElementById("e_container");
  let fContainer = document.getElementById("f_container");
  let gContainer = document.getElementById("g_container");
  let hContainer = document.getElementById("h_container");
  let iContainer = document.getElementById("i_container");
  let jContainer = document.getElementById("j_container");
  let kContainer = document.getElementById("k_container");
  let lContainer = document.getElementById("l_container");
  let mContainer = document.getElementById("m_container");
  let nContainer = document.getElementById("n_container");
  let oContainer = document.getElementById("o_container");
  let pContainer = document.getElementById("p_container");
  let qContainer = document.getElementById("q_container");
  let rContainer = document.getElementById("r_container");
  let sContainer = document.getElementById("s_container");
  let tContainer = document.getElementById("t_container");
  let uContainer = document.getElementById("u_container");
  let vContainer = document.getElementById("v_container");
  let wContainer = document.getElementById("w_container");
  let xContainer = document.getElementById("x_container");
  let yContainer = document.getElementById("y_container");
  let zContainer = document.getElementById("z_container");
  if (a.innerHTML < 1) {
    aContainer.classList.add("d-none");
  } else {
    aContainer.classList.remove("d-none");
  }
  if (b.innerHTML < 1) {
    bContainer.classList.add("d-none");
  } else {
    bContainer.classList.remove("d-none");
  }
  if (document.getElementById("c").innerHTML < 1) {
    cContainer.classList.add("d-none");
  } else {
    cContainer.classList.remove("d-none");
  }
  if (document.getElementById("d").innerHTML < 1) {
    dContainer.classList.add("d-none");
  } else {
    dContainer.classList.remove("d-none");
  }
  if (document.getElementById("e").innerHTML < 1) {
    eContainer.classList.add("d-none");
  } else {
    eContainer.classList.remove("d-none");
  }
  if (document.getElementById("f").innerHTML < 1) {
    fContainer.classList.add("d-none");
  } else {
    fContainer.classList.remove("d-none");
  }
  if (document.getElementById("g").innerHTML < 1) {
    gContainer.classList.add("d-none");
  } else {
    gContainer.classList.remove("d-none");
  }
  if (document.getElementById("h").innerHTML < 1) {
    hContainer.classList.add("d-none");
  } else {
    hContainer.classList.remove("d-none");
  }
  if (document.getElementById("i").innerHTML < 1) {
    iContainer.classList.add("d-none");
  } else {
    iContainer.classList.remove("d-none");
  }
  if (document.getElementById("j").innerHTML < 1) {
    jContainer.classList.add("d-none");
  } else {
    jContainer.classList.remove("d-none");
  }
  if (document.getElementById("k").innerHTML < 1) {
    kContainer.classList.add("d-none");
  } else {
    kContainer.classList.remove("d-none");
  }
  if (document.getElementById("l").innerHTML < 1) {
    lContainer.classList.add("d-none");
  } else {
    lContainer.classList.remove("d-none");
  }
  if (document.getElementById("m").innerHTML < 1) {
    mContainer.classList.add("d-none");
  } else {
    mContainer.classList.remove("d-none");
  }
  if (document.getElementById("n").innerHTML < 1) {
    nContainer.classList.add("d-none");
  } else {
    nContainer.classList.remove("d-none");
  }
  if (document.getElementById("o").innerHTML < 1) {
    oContainer.classList.add("d-none");
  } else {
    oContainer.classList.remove("d-none");
  }
  if (document.getElementById("p").innerHTML < 1) {
    pContainer.classList.add("d-none");
  } else {
    pContainer.classList.remove("d-none");
  }
  if (document.getElementById("q").innerHTML < 1) {
    qContainer.classList.add("d-none");
  } else {
    qContainer.classList.remove("d-none");
  }
  if (document.getElementById("r").innerHTML < 1) {
    rContainer.classList.add("d-none");
  } else {
    rContainer.classList.remove("d-none");
  }
  if (document.getElementById("s").innerHTML < 1) {
    sContainer.classList.add("d-none");
  } else {
    sContainer.classList.remove("d-none");
  }
  if (document.getElementById("t").innerHTML < 1) {
    tContainer.classList.add("d-none");
  } else {
    tContainer.classList.remove("d-none");
  }
  if (document.getElementById("u").innerHTML < 1) {
    uContainer.classList.add("d-none");
  } else {
    uContainer.classList.remove("d-none");
  }
  if (document.getElementById("v").innerHTML < 1) {
    vContainer.classList.add("d-none");
  } else {
    vContainer.classList.remove("d-none");
  }
  if (document.getElementById("w").innerHTML < 1) {
    wContainer.classList.add("d-none");
  } else {
    wContainer.classList.remove("d-none");
  }
  if (document.getElementById("x").innerHTML < 1) {
    xContainer.classList.add("d-none");
  } else {
    xContainer.classList.remove("d-none");
  }
  if (document.getElementById("y").innerHTML < 1) {
    yContainer.classList.add("d-none");
  } else {
    yContainer.classList.remove("d-none");
  }
  if (document.getElementById("z").innerHTML < 1) {
    zContainer.classList.add("d-none");
  } else {
    zContainer.classList.remove("d-none");
  }
}
