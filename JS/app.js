"use strict";

//global
const global = {
  currentPage: window.location.pathname,
};

//routes
//home page & adding note & editing existing note
document.addEventListener("DOMContentLoaded", (_) => {
  switch (global.currentPage) {
    case "/":
    case "/index.html":
      //render the notes & add event listeners
      addEventListener();
      break;
    case "/note.html":
      //DOM
      const errorEL = document.querySelector(".error");
      const clearBtn = document.querySelector(".clear");
      const saveBtn = document.querySelector(".save");
      const titleTxtArea = document.querySelector("#title");
      const noteTxtArea = document.querySelector("#note");
      const editBtn = document.querySelector(".fa-trash");
      const deleteBtn = document.querySelector(".fa-pencil");

      //ontyping
      titleTxtArea.addEventListener("change", () => (errorEL.display = "none"));
      noteTxtArea.addEventListener("change", () => (errorEL.display = "none"));
      saveBtn.addEventListener("click", addNote);
      clearBtn.addEventListener("click", () => reset());

      //TODO:
      // 2. add delete note
      break;
    case "/editnote.html":
      //TODO:
      // 1. add edit note
      let params = new URLSearchParams(document.location.search);
      let id = params.get("id");
      console.log(id);
      renderNote(id);

      break;
    default:
      break;
  }
});

//add note to the backend, and also validate
//TODO
//  1. Proper validation and it should be its own function
function addNote() {
  const errorTxt = document.querySelector(".error p");
  const title = document.querySelector("#title");
  const note = document.querySelector("#note");

  if (title.value === "" && note.value === "") {
    document.querySelector(".error").style.display = "block";
    errorTxt.innerHTML = "Both title and note are empty. Please enter both !!!";
  } else if (title.value === "" && note.value !== "") {
    errorTxt.innerHTML = "Both title is empty. Please enter title !!!";
  } else if (title.value !== "" && note.value === "") {
    errorTxt.innerHTML = "Both note is empty. Please enter note !!!";
  } else {
    //add data to the json file
    const newnote = {
      title: `${title.value}`,
      notes: `${note.value}`,
    };

    //post the data to the backend
    postNote(newnote);
    reset();
  }
}

//function utilities
//returns 300 characters if text is greater than 300 characters
function checkText(text) {
  if (text.length > 300) {
    return text.substring(0, 301) + "...";
  } else {
    return text;
  }
}

//reset the errors and texterrors
function reset() {
  document.querySelector(".error").style.display = "none";
  document.querySelector("#title").value = "";
  document.querySelector("#note").value = "";
}

//fetch data
async function getNotes() {
  const results = await fetch("https://notes-738m.onrender.com/notes");

  const data = await results.json();
  return data;
}

//get a single note
async function getNote(id) {
  console.log(id);
  const results = await fetch(`https://notes-738m.onrender.com/notes/${id}`);

  const data = await results.json();

  return data;
}

//post data to the file
async function postNote(data) {
  console.log(data);
  const response = await fetch("https://notes-738m.onrender.com/notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  console.log(response);
  return response.json();
}

//rendering the notes
async function renderNotes() {
  const notesEl = document.querySelector(".notes"); //container with notes
  const list = await getNotes();

  let notes = "";
  list.forEach((element) => {
    notes += `
    <div class="note id?${element.id}">
    <div class="btns">
      <i class="fa fa-trash" aria-hidden="true"></i>
      <i class="fa fa-pencil" aria-hidden="true"></i>
    </div>
    <div class="note-title">
        <h3>${element.title}</h3>
    </div>
    <div class="note-body">
        <p>
        ${checkText(element.notes)}
        </p>
    </div>
    </div>
    `;
  });
  notesEl.innerHTML = notes;

  return notesEl.children;
}

//adds eventlistner to each node
async function addEventListener() {
  const [...data] = await renderNotes();

  data.forEach((note, index) => {
    //event listener to the note
    note.lastElementChild.addEventListener("click", (ev) => {
      let searchQuery = new URLSearchParams();
      index += 1;
      searchQuery.append("id", index);

      location.href = "/editnote.html?" + searchQuery.toString();
    });

    //event listener to the edit
    [...note.firstElementChild.children].forEach((child) => {
      if (child.classList.contains("fa-trash")) {
        child.addEventListener("click", () => {
          //TODO: delete functionality
        });
      } else {
        child.addEventListener("click", (ev) => {
          let searchQuery = new URLSearchParams();
          index += 1;
          searchQuery.append("id", index);

          location.href = "/editnote.html?" + searchQuery.toString();
        });
      }
    });
  });
}

//populate the note in the text areas
async function renderNote(id) {
  const data = await getNote(id);
  //DOM
  const titleEL =
    document.querySelector(".edit-note").firstElementChild.lastElementChild;
  const bodyEL =
    document.querySelector(".edit-note").firstElementChild.nextElementSibling
      .lastElementChild;

  //add the notes
  titleEL.value = data.title;
  bodyEL.value = data.notes;
}
