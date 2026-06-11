const express = require('express')
const { getNextId, books } = require('../data/booksData.js')
const router = express.Router()
const {
  validateCreateBook,
  validateUpdateBook
} = require('../middleware/booksValidator.js')
const path = require("path");

router.get('/', (req, res) => {
  res.json(books)
})

router.get("/:id/view", (req, res) => {
  res.sendFile(
    path.join(__dirname, "..", "public", "book.html")
  );
});

router.post('/', validateCreateBook, (req, res) => {
  const book = {
    id: getNextId(),
    title: req.body.title,
    author: req.body.author
  }
  books.push(book)
  res.status(201).json(book)
})

router.get('/search', (req, res) => {
  const bookName = req.query.title

  const book = books.find(
    book => book.title.toLowerCase() === bookName.toLowerCase()
  )
  if (!book) {
    return res.status(404).send('Book not found')
  }
  res.json(book)
})

router.get('/:id', (req, res) => {
  const id = Number(req.params.id)

  const book = books.find(book => book.id === id)

  if (!book) {
    return res.status(404).send('Not found')
  }

  res.json(book);
})

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id)
  const index = books.findIndex(book => book.id === id)

  if (index === -1) {
    return res.status(404).send('Book not found')
  }

  books.splice(index, 1)

  res.status(204).send()
})

router.patch('/:id', validateUpdateBook, (req, res) => {
  const id = Number(req.params.id)
  const book = books.find(book => book.id === id)

  if (!book) {
    return res.status(404).send('Book not found')
  }
  if (req.body.title) {
    book.title = req.body.title
  }
  if (req.body.author) {
    book.author = req.body.author
  }

  res.json(book)
})



module.exports = router
