class Book{
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI {
    addBookToList(book) {
        const list = document.getElementById('book-list');

        // Create a tr element
        const row = document.createElement('tr');
    
        // Insert cols
        row.innerHTML = `
        <td>${sanitizeHTML(book.title)}</td>
        <td>${sanitizeHTML(book.author)}</td>
        <td>${sanitizeHTML(book.isbn)}</td>
        <td><a href="#" class="delete">X<a></td>
        `;
    
        list.appendChild(row);
    }

    showAlert(message, className){
        // Create div
        const div = document.createElement('div');
        // Add classes
        div.className = `alert ${className}`;
        // Add Text
        div.appendChild(document.createTextNode(message));
        // Get Parent
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        // Insert Alert div we created above before the form
        container.insertBefore(div, form);

        // Timeout the alert after 3 seconds
        setTimeout(function(){
            document.querySelector('.alert').remove();
        }, 3000);
    }

    deleteBook(target){
        if(target.className === 'delete'){
            // target = <a> tag parent of that is <td> and parent of that is the <tr>
            target.parentElement.parentElement.remove();
        }
    }
    
    clearFields(){
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }
}

// Local Storage Class
class Store {
    // Get the books from local storage to be displayed
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }
    
    // Display the books from local storage
    static displayBooks() {
        const books = Store.getBooks();
        books.forEach(function(book){
            const ui = new UI;

            // Add book to UI
            ui.addBookToList(book);
        });
    }

    // Add a new book to local storage
    static addBook(book) {
        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));

    }

    // Remove a book from local storage
    static removeBook(isbn) {
        const books = Store.getBooks();
        books.forEach(function(book, index){
            if(book.isbn === isbn) {
                books.splice(index, 1);
            }
        });
        
        localStorage.setItem('books', JSON.stringify(books));

    }
}


// This function is needed to sanitize the input from the user. Otherwise they can change the mark up and allows for XSS.
var sanitizeHTML = function (str) {
    var temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
};

// Event Listeners

// DOM Load event for persistant local storage of books
document.addEventListener('DOMContentLoaded', Store.displayBooks);

// Event listener for add book
// Gets the form values
document.getElementById('book-form').addEventListener('submit', function(e){
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const isbn = document.getElementById('isbn').value;
    
    // Instantiate a new Book object
    const book = new Book(title, author, isbn);

    // Instatiate a UI object
    const ui = new UI();

    // Validate input
    if(title === ''|| author === '' || isbn === ''){
        // show error alert validation
        ui.showAlert('Please fill in all fields', 'error')
    }else {

    // Add book to list
    ui.addBookToList(book);
    // Add to local storage - dont need to instantiate because its a static method
    Store.addBook(book)
    
    // Show success validation
    ui.showAlert('Book added!', 'success')

    // Clear fields
    ui.clearFields();

    }
    
    e.preventDefault();
});


// Event listener for delete
document.getElementById('book-list').addEventListener('click', function(e){

    // Instantiate UI
    const ui = new UI();

    // Delete book
    ui.deleteBook(e.target);

    // Remove from local storage
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    // Show a message after we delete a book.
    ui.showAlert('Book deleted!', 'success'); 

    e.preventDefault();

});