# rad-task1
a notes app in JS
(used Express.js to host it as a static site from the folder /public, requires starting the server with *node index.js*)

- logic.js defines a class Note, that contains the fields of a note and 
- data.js is an array of Note objects that fakes a data storage containing the initial notes to display
- index.js contains functions that display the GUI and calls render() that forms the tables for the first time and then upon modifications of notes
