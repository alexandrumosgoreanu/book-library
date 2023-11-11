let myBooks = [ {
    title: "A",
    author: "author A",
    pages: "123",
    status: "unread"
},
{
    title: "B",
    author: "author B",
    pages: "456",
    status: "unread"
}
];

class Book {
    constructor(name, author, pages, status) {
        this.name = name;
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
        console.log(books);
        books = books.filter(book => book.title != bookTitle);
        console.log(books)
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
        }, 200);
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
        console.log(elem.parentElement.children[0].textContent);
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