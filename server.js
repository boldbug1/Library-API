const express = require("express");
const app = express();

//Middleware
app.use(express.json());
app.use(express.static("public"));

let nextId = 1;
const books = [];

app.get("/",(req,res)=>{
    res.send("Library API");
})


app.get("/books",(req,res)=>{
    res.json(books);
})






app.post("/books",(req,res)=>{
    if (!req.body.title || !req.body.author) {
        return res.status(400).send("Missing title or author");
    }
    
    const book = {
        id : nextId++,
        title : req.body.title,
        author : req.body.author,
    }
    books.push(book);
    res.status(201).json(book);
    
    
})



app.get("/books/:id",(req,res)=>{
    const id = Number(req.params.id);
    
    const book = books.find(book=>book.id===id);
    
    if(!book){
        return res.status(404).send("Not found");
    }
    
    res.json(book);
})


app.get("/search",(req,res)=>{
    const bookName = req.query.title;
    
    const book = books.find(book=>book.title===bookName);
    if(!book){
        return res.status(404).send("Book not found");
    }
    res.json(book);
});

app.delete("/books/:id",(req,res)=>{
    const id = Number(req.params.id);
    const index = books.findIndex(book=>book.id===id);
    
    if(index === -1){
        return res.status(404).send("Book not found");
    }
    
    books.splice(index,1);
    
    res.status(204).send();
})

app.patch("/books/:id",(req,res)=>{
    const id = Number(req.params.id);
    const book = books.find(book=>book.id===id);
    
    if(!book){
        return res.status(404).send("Book not found");
    }
    if(req.body.title){
        book.title = req.body.title;
    }
    if(req.body.author){
        book.author = req.body.author;
    }
    
    res.json(book);
    })

app.listen(3000,()=>{
    console.log("Server running...");
})
