import { data } from "./data.js";
import { Note } from "./logic.js";

let notes = data;

// display parameters
let viewArchived = false;
// buttons with handlers

function createHeaderButtons() {
    // the header's button pannel
    let container = document.createElement('div');
    // a button that toggles showing archived notes
    let buttonViewArchived = document.createElement('button');
    buttonViewArchived.type = 'button';
    let buttonViewArchivedContent = document.createTextNode('VA');
    buttonViewArchived.appendChild(buttonViewArchivedContent);
    buttonViewArchived.onclick = function () { viewArchived = !viewArchived; render(); };

    // a button that deletes all the archived/unarchived notes  (that is all that are displayed)
    let buttonDeleteAll = document.createElement('button');
    buttonDeleteAll.type = 'button';
    let buttonDeleteAllContent = document.createTextNode('DE');
    buttonDeleteAll.appendChild(buttonDeleteAllContent);
    buttonDeleteAll.onclick = function () { notes = notes.filter(note => note.archived != viewArchived); render(); };
    // finish
    container.appendChild(buttonViewArchived);
    container.appendChild(buttonDeleteAll);
    return container;
}

function createNoteButtons(note) {
    // the header's button pannel
    let container = document.createElement('div');

    // a button that enables editing
    let buttonEdit = document.createElement('button');
    buttonEdit.type = 'button';
    let buttonEditContent = document.createTextNode('ED');
    buttonEdit.appendChild(buttonEditContent);
    buttonEdit.onclick = function () {  render(note); };
    // a button that toggles showing archived notes
    let buttonArchive = document.createElement('button');
    buttonArchive.type = 'button';
    let buttonArchiveContent = document.createTextNode('AR');
    buttonArchive.appendChild(buttonArchiveContent);
    buttonArchive.onclick = function () { note.archived = !note.archived; render(); };
    // a button to delete a note

    let buttonDelete = document.createElement('button');
    buttonDelete.type = 'button';
    let buttonDeleteContent = document.createTextNode('DE');
    buttonDelete.appendChild(buttonDeleteContent);
    let currentNote = note;
    buttonDelete.onclick = function () { notes = notes.filter(note => note != currentNote); render(); };

    container.appendChild(buttonEdit);
    container.appendChild(buttonArchive);
    container.appendChild(buttonDelete);
    return container;
}

// render functions
function createNoteElement(note, createNoteButtonsFunction = null) {

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

    if (createNoteButtonsFunction != null) 
        tableRow.appendChild(createNoteButtonsFunction(note));
    return tableRow;
}
function createEditedNoteElement(note) {

    let tableRow = document.createElement('tr');

    let fields = {
        Name: note.name,
        Created: note.creationTime.toLocaleDateString(),
        Category: note.category,
        Content: note.description,
        Dates: note.dates.map(date => date.toLocaleDateString()).join(', '),
    };
    // Name editable field
    let name_tableTD = document.createElement('td');
    let name_input = document.createElement('input');
    name_input.type = 'text';
    name_input.value = note.name;
    name_input.onchange = function () { note.name = name_input.value; };
    name_tableTD.appendChild(name_input);
    tableRow.appendChild(name_tableTD);
    // Created
    let created_tableTD = document.createElement('td');
    let created_text = document.createTextNode(note.creationTime.toLocaleDateString());
    created_tableTD.appendChild(created_text);
    tableRow.appendChild(created_tableTD);
    // Category editable field TODO select


    // content editable field

    let content_tableTD = document.createElement('td');
    let content_input = document.createElement('input');
    content_input.type = 'text';
    content_input.value = note.description;
    content_input.onchange = function () { note.description = content_input.value; };
    content_tableTD.appendChild(content_input);
    tableRow.appendChild(content_tableTD);
    // dates
    let dates_tableTD = document.createElement('td');
    let dates_text = document.createTextNode(note.dates.map(date => date.toLocaleDateString()).join(', '));
    dates_tableTD.appendChild(dates_text);
    tableRow.appendChild(dates_tableTD);
    // confirm button
    let buttonEdit = document.createElement('button');
    buttonEdit.type = 'button';
    let buttonEditContent = document.createTextNode('ED');
    buttonEdit.appendChild(buttonEditContent);
    buttonEdit.onclick = function () { render(); };

    tableRow.appendChild(buttonEdit);
    // TODO
    return tableRow;
}

function createNoteTable(notes, archived = false, editedNote = null) {
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
    tableHeaderRow.appendChild(createHeaderButtons());

    // form its body
    let notesToDisplay = notes.filter(note => note.archived === archived);
    for (const note of notesToDisplay) {
        if (editedNote == note) {
            let noteTR = createEditedNoteElement(note);
            table.appendChild(noteTR);
        }
        else {
            let noteTR = createNoteElement(note, createNoteButtons);
            table.appendChild(noteTR);
        }
    }
    return table;
}

// GUI elements

let mainTableContainer = document.body;
function render (editedNote = null) {
    mainTableContainer.innerHTML = '';
    let table = createNoteTable(notes, viewArchived, editedNote);
    mainTableContainer.appendChild(table);
}
render();