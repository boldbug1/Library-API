const books = [];
let nextId = 1;

module.exports = {
    books,
    getNextId: () => nextId++
};