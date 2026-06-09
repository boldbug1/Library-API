const InputContainer = document.getElementById("inpt-container");
const bookContainer = document.getElementById("books-container");

    async function loadBooks(){
        const response = await fetch("/books");
        const books = await response.json();
        bookContainer.innerHTML = "";
        books.forEach(book => {
            const bookHTML = `
            <div class="book">
                <h1>${book.title}</h1>
                <p>${book.author}</p>
                <button onClick = "deleteBook(${book.id})">Delete</button>
                <button onClick = "editBook(${book.id})">Edit</button>
                </div>
                `;
                
                bookContainer.insertAdjacentHTML("beforeend",bookHTML);
            });
        }
        
        async function createBook(title, author) {
            await fetch("/books", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title,
                    author
                })
            });
            
            loadBooks();
        }

        async function deleteBook(id) {
            await fetch(`/books/${id}`, {
                method: "DELETE"
            });

        loadBooks();
        }
        
        InputContainer.addEventListener("submit",async (e)=>{
            e.preventDefault();
    
            const bookTitle = document.getElementById("title-inpt").value;
            const authorName = document.getElementById("author-inpt").value;
    
            await createBook(bookTitle,authorName);

            InputContainer.reset();
        });

        loadBooks();