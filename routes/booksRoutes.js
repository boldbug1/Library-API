const express = require('express');
const router = express.Router();
const path = require('path');

const db = require('../database/db');

const {
  validateCreateBook,
  validateUpdateBook
} = require('../middleware/booksValidator.js');

router.get('/', (req, res) => {
  const books = db.prepare(`
    SELECT *
    FROM books
  `).all();

  res.json(books);
});

router.get('/search', (req, res) => {
  const bookName = req.query.title;

  const book = db.prepare(`
    SELECT *
    FROM books
    WHERE LOWER(title) = LOWER(?)
  `).get(bookName);

  if (!book) {
    return res.status(404).send('Book not found');
  }

  res.json(book);
});

router.get('/:id/view', (req, res) => {
  res.sendFile(
    path.join(__dirname, '..', 'public', 'book.html')
  );
});

router.get('/:id', (req, res) => {
  const id = Number(req.params.id);

  const book = db.prepare(`
    SELECT *
    FROM books
    WHERE id = ?
  `).get(id);

  if (!book) {
    return res.status(404).send('Book not found');
  }

  res.json(book);
});

router.post('/', validateCreateBook, (req, res) => {
  const title = req.body.title.trim();
  const author = req.body.author.trim();

  const duplicate = db.prepare(`
    SELECT *
    FROM books
    WHERE LOWER(title) = LOWER(?)
      AND LOWER(author) = LOWER(?)
  `).get(title, author);

  if (duplicate) {
    return res
      .status(400)
      .json('Book with this title and author already exists');
  }

  const result = db.prepare(`
    INSERT INTO books(title, author)
    VALUES (?, ?)
  `).run(title, author);

  res.status(201).json({
    id: result.lastInsertRowid,
    title,
    author
  });
});

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);

  const result = db.prepare(`
    DELETE FROM books
    WHERE id = ?
  `).run(id);

  if (result.changes === 0) {
    return res.status(404).send('Book not found');
  }

  res.status(204).send();
});

router.patch('/:id', validateUpdateBook, (req, res) => {
  const id = Number(req.params.id);

  const book = db.prepare(`
    SELECT *
    FROM books
    WHERE id = ?
  `).get(id);

  if (!book) {
    return res.status(404).send('Book not found');
  }

  const updatedTitle =
    req.body.title?.trim() ?? book.title;

  const updatedAuthor =
    req.body.author?.trim() ?? book.author;

  const duplicate = db.prepare(`
    SELECT *
    FROM books
    WHERE LOWER(title) = LOWER(?)
      AND LOWER(author) = LOWER(?)
      AND id != ?
  `).get(
    updatedTitle,
    updatedAuthor,
    id
  );

  if (duplicate) {
    return res
      .status(400)
      .json('Book with this title and author already exists');
  }

  db.prepare(`
    UPDATE books
    SET title = ?, author = ?
    WHERE id = ?
  `).run(
    updatedTitle,
    updatedAuthor,
    id
  );

  const updatedBook = db.prepare(`
    SELECT *
    FROM books
    WHERE id = ?
  `).get(id);

  res.json(updatedBook);
});


module.exports = router;