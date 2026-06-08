const express = require("express");
const { getNextId ,books} = require("../data/booksData");
const router = express.Router();

router.get("/",(req,res)=>{
    res.json(books);
})

router.post("/",(req,res)=>{
    if (!req.body.title || !req.body.author) {
        return res.status(400).send("Missing title or author");
    }
    
    const book = {
        id : getNextId(),
        title : req.body.title,
        author : req.body.author,
    }
    books.push(book);
    res.status(201).json(book);
    
    
})

router.get("/search",(req,res)=>{
    const bookName = req.query.title;
    
    const book = books.find(book=>book.title.toLowerCase()===bookName.toLowerCase());
    if(!book){
        return res.status(404).send("Book not found");
    }
    res.json(book);
});

router.get("/:id",(req,res)=>{
    const id = Number(req.params.id);
    
    const book = books.find(book=>book.id===id);
    
    if(!book){
        return res.status(404).send("Not found");
    }
    
    res.json(book);
})


router.delete("/:id",(req,res)=>{
    const id = Number(req.params.id);
    const index = books.findIndex(book=>book.id===id);
    
    if(index === -1){
        return res.status(404).send("Book not found");
    }
    
    books.splice(index,1);
    
    res.status(204).send();
})

router.patch("/:id",(req,res)=>{
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

module.exports = router;