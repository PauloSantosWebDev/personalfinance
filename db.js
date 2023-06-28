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

//credits table. Here new credits acquired will be inserted. Also, the update amount in credit will be stored here.
db.run('CREATE TABLE IF NOT EXISTS credits (credit_id INTEGER PRIMARY KEY AUTOINCREMENT, category TEXT, date TEXT NOT NULL, initial_amount REAL NOT NULL, debtor TEXT NOT NULL, description NOT NULL, current_amount REAL)');

//All the payments toward the credits I have will be stored in the payments_received table.
db.run('CREATE TABLE IF NOT EXISTS payments_received (credit_id INTEGER, date TEXT NOT NULL, amount REAL NOT NULL, payer TEXT NOT NULL, detail TEXT, FOREIGN KEY (credit_id) REFERENCES credits (credit_id))');

//If interests apply to the credits I have to receive, they will be stored in this table
db.run('CREATE TABLE IF NOT EXISTS interests_received (credit_id INTEGER, date TEXT NOT NULL, amount REAL NOT NULL, details TEXT NOT NULL, FOREIGN KEY (credit_id) REFERENCES credits (credit_id))');

//Example of how to create a table with a foreign key
// db.run('CREATE TABLE IF NOT EXISTS contacts (customer_id INTEGER NOT NULL, contact_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL, phone_number TEXT, mobile_number TEXT, FOREIGN KEY (customer_id) REFERENCES customers(customer_id))');

module.exports = db;