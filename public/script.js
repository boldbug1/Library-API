const InputContainer = document.getElementById('inpt-container')
const bookContainer = document.getElementById('books-container')
const editContainer = document.getElementById('edit-form')
const editTitleInput = document.getElementById('edit-title-inpt')
const editAuthorInput = document.getElementById('edit-author-inpt')

let localBooksArray = [];
let currentEditingId = null;
editContainer.style.display = 'none'

async function loadBooks () {
  const response = await fetch('/books')
  const books = await response.json();
  localBooksArray = books;
  bookContainer.innerHTML = ''
  books.forEach(book => {
    const bookHTML = `
            <div class="book">
                <h1>${book.title}</h1>
                <p>${book.author}</p>
                <button onClick = "deleteBook(${book.id})">Delete</button>
                <button onClick = "editBook(${book.id})">Edit</button>
                </div>
                `

    bookContainer.insertAdjacentHTML('beforeend', bookHTML)
  })
}

async function createBook (title, author) {
  await fetch('/books', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title,
      author
    })
  })

  loadBooks()
}

async function deleteBook (id) {
  await fetch(`/books/${id}`, {
    method: 'DELETE'
  })

  loadBooks()
}

async function updateBook(id,title,author) {
    await fetch(`/books/${id}`,{
        method : "PATCH",
        headers : {"Content-type" : "application/json"},
        body : JSON.stringify({title,author}),
    });

    loadBooks();
    
}

InputContainer.addEventListener('submit', async e => {
  e.preventDefault()

  const bookTitle = document.getElementById('title-inpt').value
  const authorName = document.getElementById('author-inpt').value

  await createBook(bookTitle, authorName)

  InputContainer.reset()
})

loadBooks()


function hideEditContainer () {
  editContainer.style.display = 'none';
  currentEditingId = null;
}

function showEditContainer () {
  editContainer.style.display = 'block'
}

function editBook (id) {
  showEditContainer();
  currentEditingId = id;
  const book = localBooksArray.find(book => book.id === id);

  if(book) {
        // Populate the popup form with the book's current data
        editTitleInput.value = book.title;
        editAuthorInput.value = book.author;
    }
}


editContainer.addEventListener("submit", async (e)=>{
    e.preventDefault();

    const updatedTitle = editTitleInput.value;
    const updatedAuthor = editAuthorInput.value;

    await updateBook(currentEditingId,updatedTitle,updatedAuthor);

    hideEditContainer();
})
