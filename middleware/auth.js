
function validateCreateBook(req,res,next){
    if(!req.body.title || !req.body.author){
        res.status(400).send("Title or author missing");
    }

    next();
}

function validateUpdateBook(req,res,next){
    if(!req.body.title && !req.body.author){
        res.status(400).json("title or author field required");
    }

    next();
}