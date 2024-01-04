const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{
  
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}


//only registered users can login
regd_users.post("/login", (req,res) => {

  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }
  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

  const isbn = req.params.isbn;
  const reviewText = req.query.review;
  const username = req.session.authorization?.username;
  
  if (!isbn || !reviewText || !username) {
    return res.status(400).json({ message: "Missing ISBN, review, or user is not logged in." });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found." });
  }

  // Add or update the review
  books[isbn].reviews[username] = reviewText;

  return res.status(200).json({ message: "The Review for the book with ISBN "+isbn+" has been added/updated." });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {

  const isbn = req.params.isbn;
  const username = req.session.authorization?.username;

  if (!isbn || !username) {
    return res.status(400).json({ message: "Missing ISBN, or user is not logged in." });
  }
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found." });
  }

  delete books[isbn].review

  res.send("Reviews for the ISBN "+isbn+" posted by the user deleted.");

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
