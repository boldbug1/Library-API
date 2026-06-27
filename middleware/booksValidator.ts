import type {Request,Response,NextFunction} from 'express';


interface BookBody{
  title?: string,
  author? : string
}

export function validateCreateBook(req:Request, res:Response, next:NextFunction) {

  const {title , author} = req.body as BookBody;

  if (!title || !author) {
    return res.status(400).send('Title or author missing');
  }

  if (
    typeof title !== 'string' ||
    typeof author !== 'string'
  ) {
    return res.status(400).send('Invalid input');
  }

  if (
    title.trim() === '' ||
    author.trim() === ''
  ) {
    return res.status(400).send('Fields cannot be empty');
  }

  next();
}

export function validateUpdateBook(req : Request, res : Response, next : NextFunction) {
  const { title, author } = req.body as BookBody;

  if (title === undefined && author === undefined) {
    return res.status(400).send('No fields provided');
  }

  if (
    title !== undefined &&
    (typeof title !== 'string' || title.trim() === '')
  ) {
    return res.status(400).send('Invalid or empty title');
  }

  if (
    author !== undefined &&
    (typeof author !== 'string' || author.trim() === '')
  ) {
    return res.status(400).send('Invalid or empty author');
  }

  next();
}
