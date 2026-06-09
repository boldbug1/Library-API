//auth.js
const { books } = require('../data/booksData.js')

function validateCreateBook (req, res, next) {
  const { title, author } = req.body

  //Check if any of the fileds are missing
  if (!title || !author) {
    return res.status(400).send('Title or author missing')
  }
  //check if the input type is string
  if (typeof title !== 'string' || typeof author !== 'string') {
    return res.status(400).json('Invalid input')
  }

  //trimmed input fields for comparison
  const trimmedTitle = title.trim()
  const trimmedAuthor = author.trim()

  if (trimmedTitle === '' || trimmedAuthor === '') {
    return res.status(400).send('Fields cannot be empty')
  }

  let isDuplicate

  if (title && author) {
    isDuplicate = books.find(
      book =>
        book.title.trim().toLowerCase() === trimmedTitle.toLowerCase() &&
        book.author.trim().toLowerCase() === trimmedAuthor.toLowerCase()
    )
  }

  if (isDuplicate) {
    return res.status(400).json('Book with this name and author already exists')
  }
  next()
}

function validateUpdateBook (req, res, next) {
  const { title, author } = req.body

  if (!title && !author) {
    return res.status(400).json('Both fields cannot be empty')
  }

  if (title !== undefined) {
    if (typeof title !== "string" || title.trim() === "") {
      return res.status(400).json('Invalid or empty title')
    }
  }

  if (author !== undefined) {
    if (typeof author !== "string" || author.trim() === "") {
      return res.status(400).json('Invalid or empty author')
    }
  }

  if (title && author) {
    const isDuplicate = books.find(
      book =>
        book.title.trim().toLowerCase() === title.trim().toLowerCase() &&
        book.author.trim().toLowerCase() === author.trim().toLowerCase()
    )

    if (isDuplicate) {
      return res
        .status(400)
        .json({ error: 'Book with this title and author already exists' })
    }
  }

  next()
}

module.exports = {
  validateCreateBook,
  validateUpdateBook
}
