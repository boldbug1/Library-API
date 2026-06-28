import express from 'express';
const router = express.Router();
import path from 'path';
import type {Request,Response} from 'express';
import db from '../database/db.js';
import { validateCreateBook, validateUpdateBook } from '../middleware/booksValidator.js';


interface Book {
  id: number;
  title: string;
  author: string;
}

router.get('/', (req : Request, res : Response) => {
  const books = db.prepare(`
    SELECT *
    FROM books
  `).all();

  res.json(books);
});

router.get('/search', (req  : Request, res:Response) => {
  const bookName = req.query.title;

  const book = db.prepare(`
    SELECT *
    FROM books
    WHERE LOWER(title) = LOWER(?)
  `).get(bookName) as Book;

  if (!book) {
    return res.status(404).send('Book not found');
  }

  res.json(book);
});

router.get('/:id/view', (req :Request, res:Response) => {
  res.sendFile(
    path.join(__dirname, '..', 'public', 'book.html')
  );
});

router.get('/:id', (req:Request, res:Response) => {
  const id = Number(req.params.id);

  const book = db.prepare(`
    SELECT *
    FROM books
    WHERE id = ?
  `).get(id) as Book;

  if (!book) {
    return res.status(404).send('Book not found');
  }

  res.json(book);
});

router.post('/', validateCreateBook, (req:Request, res:Response) => {
  const title = req.body.title.trim();
  const author = req.body.author.trim();

  const duplicate = db.prepare(`
    SELECT *
    FROM books
    WHERE LOWER(title) = LOWER(?)
      AND LOWER(author) = LOWER(?)
  `).get(title, author) as Book;

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

router.delete('/:id', (req:Request, res:Response) => {
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

router.patch('/:id', validateUpdateBook, (req:Request, res:Response) => {
  const id = Number(req.params.id);

  const book = db.prepare(`
    SELECT *
    FROM books
    WHERE id = ?
  `).get(id) as Book;

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

export default router;