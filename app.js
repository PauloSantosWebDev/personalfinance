const express = require('express');
const db = require('./db');
const http = require('http');
const path = require('path');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

//Setting up the view engine
nunjucks.configure(path.resolve('views'),{
    express:app,
    autoscape:true,
    noCache:false,
    watch:true
});

app.set('views', './views');
app.set('view engine', 'njk');

//Setting up static folders
app.use(express.static(path.join(__dirname,'node_modules')));
app.use(express.static(path.join(__dirname,'public')));

//Middleware to parse request body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

//Used to check the database
// db.run('DROP TABLE credits');
// db.run('DROP TABLE payments_received');
// db.run('DROP TABLE interests_received');
db.all('SELECT * FROM credits', (err, rows) => {
  if (err) {
    throw err;
  }
  rows.forEach(row => {
    console.log(row);
  })
})

//Creating routes
//Get methods
app.get("/", (req, res) =>{
    res.render('index', {title: 'Home page'});
})

//Categories page
app.get("/categories", (req, res) =>{
    
    const data = req.body;
    
    db.all('SELECT * FROM categories ORDER BY allocation, category', (err, rows) => {
    
    if (err) {
        throw err;
    }

    const lines = rows.map(row => ({id: row.category_id, allocation: row.allocation, category: row.category, description: row.description}));

    res.render('categories.njk', {title: 'Categories page', lines});
    })

    // res.render('categories.njk', {title: 'Categories page'});
})

//New credits page
app.get('/newcredits', (req, res) => {
  const credit = 'Credits';
  db.all('SELECT category FROM categories WHERE allocation = ?', [credit], (err, rows) => {
    if (err) {
      throw err;
    }
    const lines = rows.map(row => ({category: row.category}));
    res.render('newcredits.njk', {title:'New credits page', lines});
  })
})

//------------------------------------------------------------------
//Post methods
//Post for the categories page
app.post('/categories', (req, res) =>{
    
  const selector = req.body.value;

  if (!selector) {
    
    const allocation = req.body.inputAllocations;
    const category = req.body.inputNewCategory;
    const description = req.body.inputDescription;

    //Inserting data to the table
    db.run('INSERT INTO categories (allocation, category, description) VALUES (?, ?, ?)', [allocation, category, description], (err) => {
      if (err) {
      console.error(err.message);
      res.status(500).send('Error updating data in categories table.');
      } else {
      res.status(200);
      console.log('Data updated successfully in categories table.');
      res.redirect('/categories');
      }
    });

  } else {

    //Delete data from the table
    db.run('DELETE FROM categories WHERE category_id = ?', [selector], (err) => {
      if (err) {
        console.error(err.message);
        res.status(500).send('Error updating data in categories table.');
      } else {
        res.status(200);
        console.log('Data deleted from categories table.');
        res.json({
          status: 'success'
        })
      }
    });
  }
})

app.post('/newcredits', (req, res) => {
  const categ = req.body.inputCategory;
  const date = req.body.inputDateCreated;
  const amount = req.body.inputAmount;
  const debtor = req.body.inputDebtor;
  const description = req.body.inputDescription;

  console.log(req.body);

  db.run('INSERT INTO credits (category, date, initial_amount, debtor, description, current_amount) VALUES (?, ?, ?, ?, ?, ?)', [categ, date, amount, debtor, description, amount], (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Error updating data in credits table.');
      } else {
      res.status(200);
      console.log('Data updated successfully in credits table.');
      res.redirect('/newcredits');
      }
  });
})
//Server listening
const server = http.createServer(app);
server.listen('3000', (err, html) => {
    console.log('Listening on port 3000');
})

// app.listen(3000, (err, html) =>{
//     console.log(`Working on port` + 3000);
// })