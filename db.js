const sqlite3 = require('sqlite3').verbose();

//open the database connection
let db = new sqlite3.Database("personalfinances.sqlite", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the database.");
})

//Creating the tables needed if needed.
//Users table
db.run('CREATE TABLE IF NOT EXISTS users (user_id INTEGER PRIMARY KEY AUTOINCREMENT, user_name TEXT NOT NULL, password TEXT NOT NULL)');

//Categories table
db.run('CREATE TABLE IF NOT EXISTS categories (user_id INTEGER, category_id INTEGER PRIMARY KEY AUTOINCREMENT, allocation TEXT NOT NULL, category TEXT NOT NULL, description TEXT, FOREIGN KEY (user_id) REFERENCES users (user_id))');

//credits table. Here new credits acquired will be inserted. Also, the update amount in credit will be stored here.
db.run('CREATE TABLE IF NOT EXISTS credits (user_id INTEGER, credit_id INTEGER PRIMARY KEY AUTOINCREMENT, category TEXT, date TEXT NOT NULL, initial_amount REAL NOT NULL, debtor TEXT NOT NULL, description NOT NULL, current_amount REAL, FOREIGN KEY (user_id) REFERENCES users (user_id))');

//All the payments toward the credits I have will be stored in the payments_received table.
db.run('CREATE TABLE IF NOT EXISTS payments_received (credit_id INTEGER, payment_date TEXT NOT NULL, amount REAL NOT NULL, payer TEXT NOT NULL, detail TEXT, FOREIGN KEY (credit_id) REFERENCES credits (credit_id))');

//debts table. Here new debts acquired will be inserted. Also, the update amount in debt will be stored here.
db.run('CREATE TABLE IF NOT EXISTS debts (user_id INTEGER, debt_id INTEGER PRIMARY KEY AUTOINCREMENT, category TEXT, date TEXT NOT NULL, initial_amount REAL NOT NULL, creditor TEXT NOT NULL, description NOT NULL, current_amount REAL, FOREIGN KEY (user_id) REFERENCES users (user_id))');

//All the payments toward the debts will be stored in the payments_made table.
db.run('CREATE TABLE IF NOT EXISTS payments_made (debt_id INTEGER, payment_date TEXT NOT NULL, amount REAL NOT NULL, receiver TEXT NOT NULL, detail TEXT, FOREIGN KEY (debt_id) REFERENCES debts (debt_id))');

module.exports = db;