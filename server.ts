import express from 'express';
const app = express();
import logger from './middleware/logger.js';
import booksRouter from './routes/booksRoutes.js';
//Middleware
app.use(express.json());
app.use(express.static("public"));
app.use(logger);
app.use("/books", booksRouter);


app.listen(3000,()=>{
    console.log("Server running...");
})
