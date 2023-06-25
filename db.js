const sqlite3 = require('sqlite3').verbose();

//open the database connection
let db = new sqlite3.Database("personalfinances.sqlite", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the database.");
})

//Creating the tables needed if needed.
//Categories table
db.run('CREATE TABLE IF NOT EXISTS categories (category_id INTEGER PRIMARY KEY AUTOINCREMENT, allocation TEXT NOT NULL, category TEXT NOT NULL, description TEXT)');

//Example of how to create a table with a foreign key
// db.run('CREATE TABLE IF NOT EXISTS contacts (customer_id INTEGER NOT NULL, contact_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL, phone_number TEXT, mobile_number TEXT, FOREIGN KEY (customer_id) REFERENCES customers(customer_id))');

module.exports = db;