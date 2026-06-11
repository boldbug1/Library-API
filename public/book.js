const id = window.location.pathname.split("/")[2];

async function loadBook() {
    const response = await fetch(`/books/${id}`);

    if (!response.ok) {
        document.body.innerHTML = "<h1>Book not found</h1>";
        return;
    }

    const book = await response.json();

    document.getElementById("book-title").textContent = book.title;
    document.getElementById("book-author").textContent = book.author;
}

loadBook();