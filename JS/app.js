"use strict";
import data from './data.js';

//DOM
const mainEl = document.querySelector(".main .container");

//array
let list = JSON.parse(data);

console.log(list[0].notes.length)

//put all list in a variable
let notes = '';
list.forEach(element => {
   notes  += `
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



//function utilities
function checkText (text){
    if(text.length > 300 )
    {
        return text.substring(0,301) + "...";
    } else{
        return text
    }
}