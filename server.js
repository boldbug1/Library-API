const express = require("express");
const app = express();
const logger = require("./middleware/logger.js")
const booksRouter = require("./routes/books.js")
//Middleware
app.use(express.json());
app.use(express.static("public"));
app.use(logger);
app.use("/books", booksRouter);


app.listen(3000,()=>{
    console.log("Server running...");
})
