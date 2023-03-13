"use strict";
import {getData, addData,show} from './data.js';

//DOM
const mainEl = document.querySelector(".main .container"); //container with notes
const closeBtn = document.querySelector(".close");
const newNotePage = document.querySelector(".new-note-overlay"); 
const newNoteBtn = document.querySelector(".new-note-button");
const clearBtn = document.querySelector(".clear");
const saveBtn = document.querySelector(".save");
const titleTxtArea = document.querySelector("#title");
const noteTxtArea = document.querySelector("#note");
const errorEL = document.querySelector(".error");
const errorTxt = document.querySelector(".error p");

//variables
let list = getData();

//render
renderNotes();

//adds click event listener to close btn
closeBtn.addEventListener("click",()=> { 
    reset();
    newNotePage.style.display = "none";
    document.querySelector(".main").display = "block";
});

//adds click event listener to new note btn
newNoteBtn.addEventListener("click", ()=>{
    document.querySelector(".main").display = "none";
    newNotePage.style.display = "block";
});

//add event listeners to both clear and save buttons
///TODO - add new note to the list, if empty throw an error
saveBtn.addEventListener("click", (ev)=>{
    if(titleTxtArea.value === '' && noteTxtArea.value === '')
    {
        errorEL.style.display = "block";
        errorTxt.innerHTML = "Both title and note are empty. Please enter both !!!"
    } 
    else if (titleTxtArea === '' && noteTxtArea !== ''){
        errorTxt.innerHTML = "Both title is empty. Please enter title !!!"
    }
    else if (titleTxtArea !== '' && noteTxtArea === ''){
        errorTxt.innerHTML = "Both note is empty. Please enter note !!!"
    } else{
        list.push({"title": titleTxtArea.value, "notes": noteTxtArea.value});
        addData(list);
        reset();
        renderNotes();
    }
});
clearBtn.addEventListener("click", () => reset());

//ontyping
titleTxtArea.addEventListener("change", () => errorEL.display = "none");
noteTxtArea.addEventListener("change", () => errorEL.display = "none")

//function utilities
//returns 300 characters if text is greater than 300 characters
function checkText (text){
    if(text.length > 300 )
    {
        return text.substring(0,301) + "...";
    } else{
        return text
    }
}

//reset the errors and texterrors
function reset(){
    errorEL.style.display = "none";
    titleTxtArea.value = '';
    noteTxtArea.value = '';
}

//rendering the notes
function renderNotes() {
    let notes = '';
    list.forEach(element => {
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
    mainEl.innerHTML = notes;
}