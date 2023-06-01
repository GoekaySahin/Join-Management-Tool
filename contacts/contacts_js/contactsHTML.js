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
                    <div>
                        <div class="contact-char">C</div>
                        <hr class="underline" />
                    </div>
                    <div id="c"></div>
                </div>

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
                </div>
                <div id="o"></div>

                <div id="p_container">
                    <div class="contact-char">P</div>
                    <hr class="underline" />
                </div>
                <div id="p"></div>

                <div id="q_container">
                    <div class="contact-char">Q</div>
                    <hr class="underline" />
                </div>
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
                <div onclick="openAddTask()" class="name-addTask">
                    <img class="cross" src="img/cross.png" alt="" />
                    <p>Add Task</p>
                    
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
            <div onclick="openEditContact(${i})" id="edit_contact_pencil" class="edit-contact">
                <img src="img/pencil.png" alt="" />
                <p>Edit Contact</p>
            </div>
        </div>
        <button class="save-btn deleteBTN" onclick="deleteActualContact(${i})" >delete</button>
        <img onclick="openEditContact(${i})" src="img/edit-contact.png" id="edit_contact" class="d-none" alt="" />
    `;
}

function renderDetailHTML(name, email, phone, acronym, color) {
  document.getElementById("contact_right").classList.remove("d-none");
  document.getElementById("name_right").innerHTML = name;
  document.getElementById("mail_right").innerHTML = email;

  if (phone == undefined) {
    document.getElementById("mobil_right").innerHTML = "";
  } else {
    document.getElementById("mobil_right").innerHTML = `${phone}`;
  }
  document.getElementById("circle_right").innerHTML = acronym.toUpperCase();
  document.getElementById("circle_right").style.background = color;
}

function renderDetailHTMLRespons() {
  document.getElementById("new_contact_btn").classList.add("d-none");
  document.getElementById("contact_list_container").classList.add("d-none");
  document.getElementById("edit_contact_pencil").classList.add("d-none");
  document.getElementById("backarrow").classList.remove("d-none");
  document.getElementById("edit_contact").classList.remove("d-none");
  document.getElementById("contact_right").classList.remove("d-none");
}

function disableContactContainer() {
  if (document.getElementById("a").innerHTML < 1) {
    document.getElementById("a_container").classList.add("d-none");
  } else {
    document.getElementById("a_container").classList.remove("d-none");
  }
  if (document.getElementById("b").innerHTML < 1) {
    document.getElementById("b_container").classList.add("d-none");
  } else {
    document.getElementById("b_container").classList.remove("d-none");
  }
  if (document.getElementById("c").innerHTML < 1) {
    document.getElementById("c_container").classList.add("d-none");
  } else {
    document.getElementById("c_container").classList.remove("d-none");
  }
  if (document.getElementById("d").innerHTML < 1) {
    document.getElementById("d_container").classList.add("d-none");
  } else {
    document.getElementById("d_container").classList.remove("d-none");
  }
  if (document.getElementById("e").innerHTML < 1) {
    document.getElementById("e_container").classList.add("d-none");
  } else {
    document.getElementById("e_container").classList.remove("d-none");
  }
  if (document.getElementById("f").innerHTML < 1) {
    document.getElementById("f_container").classList.add("d-none");
  } else {
    document.getElementById("f_container").classList.remove("d-none");
  }
  if (document.getElementById("g").innerHTML < 1) {
    document.getElementById("g_container").classList.add("d-none");
  } else {
    document.getElementById("g_container").classList.remove("d-none");
  }
  if (document.getElementById("h").innerHTML < 1) {
    document.getElementById("h_container").classList.add("d-none");
  } else {
    document.getElementById("h_container").classList.remove("d-none");
  }
  if (document.getElementById("i").innerHTML < 1) {
    document.getElementById("i_container").classList.add("d-none");
  } else {
    document.getElementById("i_container").classList.remove("d-none");
  }
  if (document.getElementById("j").innerHTML < 1) {
    document.getElementById("j_container").classList.add("d-none");
  } else {
    document.getElementById("j_container").classList.remove("d-none");
  }
  if (document.getElementById("k").innerHTML < 1) {
    document.getElementById("k_container").classList.add("d-none");
  } else {
    document.getElementById("k_container").classList.remove("d-none");
  }
  if (document.getElementById("l").innerHTML < 1) {
    document.getElementById("l_container").classList.add("d-none");
  } else {
    document.getElementById("l_container").classList.remove("d-none");
  }
  if (document.getElementById("m").innerHTML < 1) {
    document.getElementById("m_container").classList.add("d-none");
  } else {
    document.getElementById("m_container").classList.remove("d-none");
  }
  if (document.getElementById("n").innerHTML < 1) {
    document.getElementById("n_container").classList.add("d-none");
  } else {
    document.getElementById("n_container").classList.remove("d-none");
  }
  if (document.getElementById("o").innerHTML < 1) {
    document.getElementById("o_container").classList.add("d-none");
  } else {
    document.getElementById("o_container").classList.remove("d-none");
  }
  if (document.getElementById("p").innerHTML < 1) {
    document.getElementById("p_container").classList.add("d-none");
  } else {
    document.getElementById("p_container").classList.remove("d-none");
  }
  if (document.getElementById("q").innerHTML < 1) {
    document.getElementById("q_container").classList.add("d-none");
  } else {
    document.getElementById("q_container").classList.remove("d-none");
  }
  if (document.getElementById("r").innerHTML < 1) {
    document.getElementById("r_container").classList.add("d-none");
  } else {
    document.getElementById("r_container").classList.remove("d-none");
  }
  if (document.getElementById("s").innerHTML < 1) {
    document.getElementById("s_container").classList.add("d-none");
  } else {
    document.getElementById("s_container").classList.remove("d-none");
  }
  if (document.getElementById("t").innerHTML < 1) {
    document.getElementById("t_container").classList.add("d-none");
  } else {
    document.getElementById("t_container").classList.remove("d-none");
  }
  if (document.getElementById("u").innerHTML < 1) {
    document.getElementById("u_container").classList.add("d-none");
  } else {
    document.getElementById("u_container").classList.remove("d-none");
  }
  if (document.getElementById("v").innerHTML < 1) {
    document.getElementById("v_container").classList.add("d-none");
  } else {
    document.getElementById("v_container").classList.remove("d-none");
  }
  if (document.getElementById("w").innerHTML < 1) {
    document.getElementById("w_container").classList.add("d-none");
  } else {
    document.getElementById("w_container").classList.remove("d-none");
  }
  if (document.getElementById("x").innerHTML < 1) {
    document.getElementById("x_container").classList.add("d-none");
  } else {
    document.getElementById("x_container").classList.remove("d-none");
  }
  if (document.getElementById("y").innerHTML < 1) {
    document.getElementById("y_container").classList.add("d-none");
  } else {
    document.getElementById("y_container").classList.remove("d-none");
  }
  if (document.getElementById("z").innerHTML < 1) {
    document.getElementById("z_container").classList.add("d-none");
  } else {
    document.getElementById("z_container").classList.remove("d-none");
  }
}
