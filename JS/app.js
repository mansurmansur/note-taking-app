"use strict";

//global
const global = {
  currentPage: window.location.pathname,
};

//DOM
const notesEl = document.querySelector(".notes"); //container with notes
const closeBtn = document.querySelector(".close");
const newNotePage = document.querySelector(".new-note-overlay");
const newNoteBtn = document.querySelector(".new-note-button");
const clearBtn = document.querySelector(".clear");
const saveBtn = document.querySelector(".save");
const titleTxtArea = document.querySelector("#title");
const noteTxtArea = document.querySelector("#note");
const errorEL = document.querySelector(".error");
const errorTxt = document.querySelector(".error p");
const notes = document.querySelectorAll(".note");

//routes
//home page & adding note & editing existing note
document.addEventListener("DOMContentLoaded", (_) => {
  switch (global.currentPage) {
    case "/":
    case "/index.html":
      //render the notes.
      renderNotes();
      break;
    case "/note.html":
      //ontyping
      titleTxtArea.addEventListener("change", () => (errorEL.display = "none"));
      noteTxtArea.addEventListener("change", () => (errorEL.display = "none"));
      saveBtn.addEventListener("click", addNote);
      clearBtn.addEventListener("click", () => reset());
      break;
    default:
      break;
  }
});

//validate user input and post it to the data file
function addNote() {
  if (titleTxtArea.value === "" && noteTxtArea.value === "") {
    errorEL.style.display = "block";
    errorTxt.innerHTML = "Both title and note are empty. Please enter both !!!";
  } else if (titleTxtArea === "" && noteTxtArea !== "") {
    errorTxt.innerHTML = "Both title is empty. Please enter title !!!";
  } else if (titleTxtArea !== "" && noteTxtArea === "") {
    errorTxt.innerHTML = "Both note is empty. Please enter note !!!";
  } else {
    //add data to the json file
    const newnote = {
      title: `${titleTxtArea.value}`,
      notes: `${noteTxtArea.value}`,
    };
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
  errorEL.style.display = "none";
  titleTxtArea.value = "";
  noteTxtArea.value = "";
}

//fetch data
async function getNotes() {
  const results = await fetch("https://notes-738m.onrender.com/notes");

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
  const list = await getNotes();

  let notes = "";
  list.forEach((element) => {
    notes += `
    <div class="note">
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
}
