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

console.log(createNoteElement(data[0]));