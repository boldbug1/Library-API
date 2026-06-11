const InputContainer = document.getElementById('inpt-container')
const bookContainer = document.getElementById('books-container')
const editContainer = document.getElementById('edit-form')
const editTitleInput = document.getElementById('edit-title-inpt')
const editAuthorInput = document.getElementById('edit-author-inpt')
const errorContainer = document.getElementById("error-container");
const editErrorContainer = document.getElementById("edit-error-container");

let localBooksArray = [];
let currentEditingId = null;
editContainer.style.display = 'none'
hideContainer();

function showError(containerType,error){
  containerType.textContent = error; 
}

function hideError(containerType){
  containerType.innerHTML = "";
}
async function loadBooks () {
  const response = await fetch('/books')
  const books = await response.json();
  localBooksArray = books;
  bookContainer.innerHTML = ''
  books.forEach(book => {
   const bookHTML = `
<div class="book">
    <h3>${book.title}</h3>
    <p>${book.author}</p>

    <div class="book-actions">
        <button class="edit-btn" onclick="editBook(${book.id})">
            <i class="fa-solid fa-pen"></i>
        </button>

        <button class="delete-btn" onclick="deleteBook(${book.id})">
            <i class="fa-solid fa-trash"></i>
        </button>
    </div>
</div>
`;

    bookContainer.insertAdjacentHTML('beforeend', bookHTML)
  })
}

async function createBook (title, author) {
  const response = await fetch('/books', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title,
      author
    })
  })

  if(response.ok){
    await loadBooks();
  }

  return response;
}

async function deleteBook (id) {
  await fetch(`/books/${id}`, {
    method: 'DELETE'
  })

  loadBooks();
}

async function updateBook(id,title,author) {
   const response = await fetch(`/books/${id}`,{
        method : "PATCH",
        headers : {"Content-type" : "application/json"},
        body : JSON.stringify({title,author}),
    });

    if(response.ok){
      await loadBooks();
    }
    
    
    return response;
}

InputContainer.addEventListener('submit', async e => {
  e.preventDefault()

  const bookTitle = document.getElementById('title-inpt').value
  const authorName = document.getElementById('author-inpt').value

  const response = await createBook(bookTitle, authorName)
  
  if(response.status === 400){
      showError(errorContainer,"A book with this name and author already exists.");
      return;
  }
  hideError(errorContainer);
  InputContainer.reset()
  hideContainer();
})

loadBooks()


function hideEditContainer () {
  editContainer.style.display = 'none';
  currentEditingId = null;
}

function showEditContainer () {
  editContainer.style.display = 'block'
}

function showContainer(){
  InputContainer.style.display  = "block";
}

function hideContainer(){
  InputContainer.style.display = "none";
  hideError(errorContainer);
  InputContainer.reset();
}

function editBook (id) {
  showEditContainer();
  hideError(editErrorContainer);
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

    const response = await updateBook(currentEditingId,updatedTitle,updatedAuthor);

    if(response.status === 400){
      showError(editErrorContainer,"A book with this name and author already exists.");
      return;
    }

    hideError(editErrorContainer);
    hideEditContainer();
})
