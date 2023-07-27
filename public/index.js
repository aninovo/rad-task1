import { data } from "./data.js";
import { Note } from "./logic.js";

function createNoteElement(note) {

    let fields = {
        Name: note.name,
        Created: note.creationTime.toLocaleDateString(),
        Category: note.category,
        Content: note.description,
        Dates: note.dates.map(date => date.toLocaleDateString()).join(', '),
    };

    let tableRow = document.createElement('tr');
    for (const field in fields) {
        let tableTD = document.createElement('td');
        let text = document.createTextNode(fields[field]);
        tableTD.appendChild(text);
        tableRow.appendChild(tableTD);
    }
    // todo the buttons
    return tableRow;
}

function createNoteTable(notes, archived = false) {
    let fields = ['Name', 'Created', 'Category', 'Content', 'Dates'];
    // create a <table>
    let table = document.createElement('table');
    // create a row for its header part
    let tableHeaderRow = document.createElement('tr');
    table.appendChild(tableHeaderRow);

    for (const field of fields) {
        let tableTH = document.createElement('th');
        let text = document.createTextNode(field);
        tableTH.appendChild(text);
        tableHeaderRow.appendChild(tableTH);
    }
    // form its body

    let notesToDisplay = notes.filter(note => note.archived === archived);
    for (const note of notesToDisplay) {
        let noteTR = createNoteElement(note);
        table.appendChild(noteTR);
    }
    return table;
}

document.body.appendChild(createNoteTable(data));