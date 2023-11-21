class Book {
    constructor(title, author, pages, status) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.status = status;
    }
}

class Storage {
    static getBooks() {
        let books;
        localStorage.getItem('books') === null ? books = [] : books = JSON.parse(localStorage.getItem('books'))
        return books;
    }

    static addBook(book) {
        const books = Storage.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books))
    }

    static removeBook(bookTitle) {
        let books = Storage.getBooks();
        books = books.filter(book => book.title != bookTitle);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static updateBookStatus(bookTitle, status) {
        let books = Storage.getBooks();
        books = books.map((book) => book.title == bookTitle ? {...book, status: status} : book);
        localStorage.setItem('books', JSON.stringify(books))
    }
}

class UI {
    static tryBooks(){
        const sampleBooks = [
            {
                title: 'Intelligent Design',
                author: 'William Dembski',
                pages: 312,
                status: false
            },
            {
                title: 'Atomic Habits',
                author: 'James Clear',
                pages: 288,
                status: false
            },
            {
                title: 'The Alchemist',
                author: 'Paulo Coelho',
                pages: 208,
                status: false
            },
            {
                title: 'Eat That Frog',
                author: 'Brian Tracy',
                pages: 144,
                status: false
            },
            {
                title: 'For whom the bell tolls',
                author: 'Ernst Hemingway',
                pages: 345,
                status: true
            }
        ]
        const books = sampleBooks; 

        setTimeout(()=>{books.forEach((book)=> {
            UI.addBookToLibrary(book); 
            Storage.addBook(book)});
        }, 100);
    }

    static displayBooks() {
        const books = Storage.getBooks();
        UI.displayTips();
        books.forEach((book)=> UI.addBookToLibrary(book));
    }

    static displayTips() {
        const tipsCard = document.querySelector('#tips');
        if(main.children.length > 1)
            tipsCard.classList.add('disabled');
        else
            tipsCard.classList.remove('disabled');
    }

    static addBookToLibrary(book) {
        const main = document.querySelector('#main');
        const bookCard = document.createElement('div');
        bookCard.classList.add('book-card');

        if(book.status === true) {
            book.status = "Read";
            book.summary = "Completed";
        }
        else {
            book.status = "Not read";
            book.summary = "In progress";
        }

        bookCard.innerHTML = `
                                <h2>${book.title}</h2>
                                <h3>by ${book.author}</h3>
                                <p>Pages: ${book.pages}</p>
                            
                                <div class="action-btns">
                                    <button class="book-button read-status" id="read-btn">${book.status}</button>
                                    <button class="book-button delete" id="delete-btn">Delete</button>
                                </div>
                                <div class="status">${book.summary}</div> `
    
        main.appendChild(bookCard);
        UI.displayTips();
            
    }

    static removeBook(elem) {
        if(!elem.classList.contains('delete')) return;
        elem.parentElement.parentElement.remove();
        const bookTitle = elem.parentElement.parentElement.children[0].textContent;
        
        Storage.removeBook(bookTitle);
        UI.displayTips();
    }

    static updateBookStatus(elem) {
        if(!elem.classList.contains('read-status')) return;
        const bookTitle = elem.parentElement.parentElement.children[0].textContent;
        const bookStatus = elem.parentElement.children[0].textContent;

        if(bookStatus === "Read") {
            elem.textContent = "Not read";
            elem.parentElement.parentElement.children[4].textContent = "In Progress";
            Storage.updateBookStatus(bookTitle, false);
        }
        else  {
            elem.textContent = "Read";
            elem.parentElement.parentElement.children[4].textContent = "Completed";
            Storage.updateBookStatus(bookTitle, true);
        }        
    }

    static clearFields(){
        const form = document.querySelectorAll('input');
        form.forEach(el => el.type != 'checkbox' ? el.value = '' : el.checked = false);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    localStorage.clear();
    UI.displayBooks
});
document.querySelector('#try-books').addEventListener('click', (e) => UI.tryBooks());
document.querySelector('.main').addEventListener('click', (e)=> {
    UI.removeBook(e.target);
    UI.updateBookStatus(e.target);
});
document.querySelector('#book-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const pages = document.querySelector('#pages').value;
    const submitBtn = document.querySelector('#submit-btn');
    const status = document.querySelector('#status-checkbox').checked;
    const book = new Book(title, author, pages, status);
    
    UI.addBookToLibrary(book);
    Storage.addBook(book);

    UI.clearFields();
});


// Side nav
 
document.querySelector('#add-book').addEventListener('click', () => {
    const sidePanel = document.querySelector(".side-panel")
    sidePanel.style.width = "550px";
    sidePanel.style.boxShadow = "-8px 2px 50px 24px #000000";
    // document.getElementById("main").style.marginLeft = "250px";
   // document.querySelector('html').classList.add('blured');
});
document.querySelector('.close-btn').addEventListener('click', () => {
    const sidePanel = document.querySelector(".side-panel")
    sidePanel.style.width = "0px";
    sidePanel.style.boxShadow = "0px 0px 0px 0px";
    //document.querySelector('html').classList.remove('blured');
});