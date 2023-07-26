class Note {
    #name;
    #category;
    static categories = ['Task', 'Random Thought', 'Idea'];
    #description;
    #creationTime;
    #dates;
    constructor(name, category, description, creationTime = null) {
        this.name = name;
        this.description = description;
        // mark the creation time, from the arguments or automatically
        if (creationTime == null)
            this.creationTime = Date.now();
        else
            this.creationTime = creationTime;
        // check if is has a valid category
        this.category = category;
    }

    get name() { return this.#name; }
    set name(value) { this.#name = value; }
    get category() { return this.#category; }
    set category(value) {
        if (Note.categories.indexOf(value) === -1) {
            throw new Error('Trying to make a Note with an invalid category');
        }
        this.#category = value;
    }

    get creationTime() { return this.#creationTime; }
    set creationTime(value) { this.#creationTime = value; }

    get description() { return this.#description; }
    set description(value) {
        this.#description = value;
        this.#dates = Note.#getDatesFromText(value);
    }
    get dates() { return this.#dates; }
    set dates(value) { this.#dates = value; }

    static #getDatesFromText(s) {
        let results = [];
        let resultsISO = [];
        const regex = /(\d{1,2}([.\-/])\d{1,2}([.\-/])\d{4})/g;
        // corresponds to DD.MM.YYYY or DD/MM/YYYY etc., the final "g" is a flag marking that we want multiple matches
        let matches = s.match(regex);
        if (matches != null) {
            // parse substrings into Date
            results = matches.map(match => {
                let [dd, mm, yyyy] = match.split(/[\.\-\/]/);
                return new Date(yyyy, mm, dd);
            });
        }
        const regexISO = /(\d{4}([.\-/])\d{1,2}([.\-/])\d{1,2})/g;
        // corresponds to the YYYY.MM.DD format
        let matchesISO = s.match(regexISO);
        if (matchesISO != null) {
            // parse substrings into Date
            resultsISO = matchesISO.map(match => {
                let [yyyy, mm, dd] = match.split(/[\.\-\/]/);
                return new Date(yyyy, mm, dd);
            });
        }
        return results.concat(resultsISO);
    }
}
