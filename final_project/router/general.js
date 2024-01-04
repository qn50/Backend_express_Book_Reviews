const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Simulate an async operation to fetch books
const fetchBooks = async () => {
  return new Promise(resolve => {
      setTimeout(() => resolve(books), 1000); // Simulating async operation with a delay
  });
};

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
      const allBooks = await fetchBooks();
      res.send(JSON.stringify(allBooks, null, 4));
  } catch (error) {
      res.status(500).send({ message: "Error fetching books: " + error.message });
  }
});

// Simulate an async operation to fetch a book by ISBN
const fetchBookByIsbn = async (isbn) => {
  return new Promise((resolve, reject) => {
      setTimeout(() => {
          if (books[isbn]) {
              resolve(books[isbn]);
          } else {
              reject("Book not found for ISBN: " + isbn);
          }
      }, 1000); // Simulating async operation with a delay
  });
};

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;

  try {
      const bookDetails = await fetchBookByIsbn(isbn);
      res.send(bookDetails);
  } catch (error) {
      res.status(404).send({ message: error });
  }
});
  
// Simulate an async operation to fetch books by author
const fetchBooksByAuthor = async (authorName) => {
  return new Promise(resolve => {
      setTimeout(() => {
          let foundBooks = Object.values(books).filter(book => book.author === authorName);
          resolve(foundBooks);
      }, 1000); // Simulating async operation with a delay
  });
};

public_users.get('/author/:author', async function (req, res) {
  const authorName = req.params.author;

  try {
      const foundBooks = await fetchBooksByAuthor(authorName);
      if (foundBooks.length > 0) {
          res.send(foundBooks);
      } else {
          res.status(404).send({ message: "No books found for author: " + authorName });
      }
  } catch (error) {
      res.status(500).send({ message: "Error fetching books: " + error.message });
  }
});

// Simulate an async operation to fetch books by title
const fetchBooksByTitle = async (title) => {
  return new Promise(resolve => {
      setTimeout(() => {
          let foundBooks = Object.values(books).filter(book => book.title === title);
          resolve(foundBooks);
      }, 1000); // Simulating async operation with a delay
  });
};

public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;

  try {
      const foundBooks = await fetchBooksByTitle(title);
      if (foundBooks.length > 0) {
          res.send(foundBooks);
      } else {
          res.status(404).send({ message: "No books found for title: " + title });
      }
  } catch (error) {
      res.status(500).send({ message: "Error fetching books: " + error.message });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {

  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(books[isbn].reviews);
  } else {
    res.status(404).send({message: "Book not found for ISBN: " + isbn});
  }
});

module.exports.general = public_users;
