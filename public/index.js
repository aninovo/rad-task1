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
    let buttonViewArchivedContent = document.createTextNode('view archived');
    buttonViewArchived.appendChild(buttonViewArchivedContent);
    buttonViewArchived.onclick = function () { viewArchived = !viewArchived; render(); };

    // a button that deletes all the archived/unarchived notes  (that is all that are displayed)
    let buttonDeleteAll = document.createElement('button');
    buttonDeleteAll.type = 'button';
    let buttonDeleteAllContent = document.createTextNode('delete');
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
    let buttonEditContent = document.createTextNode('edit');
    buttonEdit.appendChild(buttonEditContent);
    buttonEdit.onclick = function () {  render(note); };
    // a button that toggles showing archived notes
    let buttonArchive = document.createElement('button');
    buttonArchive.type = 'button';
    let buttonArchiveContent = document.createTextNode('archive');
    buttonArchive.appendChild(buttonArchiveContent);
    buttonArchive.onclick = function () { note.archived = !note.archived; render(); };
    // a button to delete a note

    let buttonDelete = document.createElement('button');
    buttonDelete.type = 'button';
    let buttonDeleteContent = document.createTextNode('delete');
    buttonDelete.appendChild(buttonDeleteContent);
    let currentNote = note;
    buttonDelete.onclick = function () { notes = notes.filter(note => note != currentNote); render(); };

    container.appendChild(buttonEdit);
    container.appendChild(buttonArchive);
    container.appendChild(buttonDelete);
    return container;
}

/*
* NOTES table
*/

const dateDisplayOptions = { year: 'numeric', month: 'long', day: 'numeric' };
function createNoteElement(note, createNoteButtonsFunction = null) {
    let fields = {
        Name: note.name,
        Created: note.creationTime.toLocaleDateString('uk', dateDisplayOptions),
        Category: note.category,
        Content: note.description,
        Dates: note.dates.map(date => date.toLocaleDateString('uk', dateDisplayOptions)).join(', '),
    };

    let tableRow = document.createElement('tr');
    for (const field in fields) {
        let tableTD = document.createElement('td');
        let text = document.createTextNode(fields[field]);
        tableTD.appendChild(text);
        tableRow.appendChild(tableTD);
    }


    let buttonsTD = document.createElement('td');
    if (createNoteButtonsFunction != null) 
        buttonsTD.appendChild(createNoteButtonsFunction(note));

    tableRow.appendChild(buttonsTD);
    return tableRow;
}
function createEditedNoteElement(note) {

    let tableRow = document.createElement('tr');

    let fields = {
        Name: note.name,
        Created: note.creationTime.toLocaleDateString('uk', dateDisplayOptions),
        Category: note.category,
        Content: note.description,
        Dates: note.dates.map(date => date.toLocaleDateString('uk', dateDisplayOptions)).join(', '),
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
    let created_text = document.createTextNode(note.creationTime.toLocaleDateString('uk', dateDisplayOptions));
    created_tableTD.appendChild(created_text);
    tableRow.appendChild(created_tableTD);
    // Category editable field TODO select
    let category_tableTD = document.createElement('td');
    let category_select = document.createElement('select');
    const options = ['Task', 'Idea', 'Random Thought'];
    for (const option of options) {
        let optionElement = document.createElement('option');
        optionElement.value = option;
        let text = document.createTextNode(option);
        optionElement.appendChild(text);
        optionElement.selected = option === note.category;
        category_select.appendChild(optionElement);
    }
    category_select.onchange = function () {
        try {
            note.category = category_select.value;
        } catch {
            console.log('Can\'t assign category ' + category_select.value);
        }
    };
    category_tableTD.appendChild(category_select);
    tableRow.appendChild(category_tableTD);
    // content editable field

    let content_tableTD = document.createElement('td');
    let content_input = document.createElement('textarea'); // textarea for multiline input

    content_input.innerText = note.description; // textarea doesn't support the "value" attribute
    content_input.rows = 6;
    content_input.oninput = function () { note.description = content_input.value; };
    content_tableTD.appendChild(content_input);
    tableRow.appendChild(content_tableTD);
    // dates
    let dates_tableTD = document.createElement('td');
    let dates_text = document.createTextNode(note.dates.map(date => date.toLocaleDateString('uk', dateDisplayOptions)).join(', '));
    dates_tableTD.appendChild(dates_text);
    tableRow.appendChild(dates_tableTD);
    // confirm button
    let buttonEdit = document.createElement('button');
    buttonEdit.type = 'button';
    let buttonEditContent = document.createTextNode('edit');
    buttonEdit.appendChild(buttonEditContent);
    buttonEdit.onclick = function () { render(); };


    let buttonsTD = document.createElement('td');
    buttonsTD.appendChild(buttonEdit);
    tableRow.appendChild(buttonsTD);
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
    let buttonsTD = document.createElement('td');
    buttonsTD.appendChild(createHeaderButtons());
    tableHeaderRow.appendChild(buttonsTD);

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

/*
* STATS table
*/
function createCategoryStatElement(notes, category) {
    let fields = {
        Category: category,
        Active: notes.filter(note => note.category == category && !note.archived).length.toString(),
        Archived: notes.filter(note => note.category == category && note.archived).length.toString(),
    };

    let tableRow = document.createElement('tr');
    for (const field in fields) {
        let tableTD = document.createElement('td');
        let text = document.createTextNode(fields[field]);
        tableTD.appendChild(text);
        tableRow.appendChild(tableTD);
    }

    return tableRow;
}

function createStatTable(notes) {
    let fields = ['Category', 'Active', 'Archived'];
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
    let categoriesToDisplay = Note.categories;
    for (const category of categoriesToDisplay) {
        let catTD = createCategoryStatElement(notes, category);
        table.appendChild(catTD);
    }
    return table;
}

// finding GUI elements

let mainTableContainer = document.getElementById('main-table-container');
let statTableContainer = document.getElementById('stat-table-container');
let createNoteButton = document.getElementById('new-note-button-container');
createNoteButton.onclick = function () {
    let newNote = new Note('', 'Idea', '');
    notes.push(newNote);
    viewArchived = false;
    render(newNote);
}
function render(editedNote = null) {
    // render the table with editable notes
    mainTableContainer.innerHTML = '';
    let table = createNoteTable(notes, viewArchived, editedNote);
    mainTableContainer.appendChild(table);

    // render the table with statistics

    statTableContainer.innerHTML = '';
    let tableStats = createStatTable(notes);
    statTableContainer.appendChild(tableStats);

}
render();