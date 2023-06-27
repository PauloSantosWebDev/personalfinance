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

//Creating routes
//Get methods
app.get("/", (req, res) =>{
    res.render('index', {title: 'Home page'});
})

app.get("/categories", (req, res) =>{
    
    const data = req.body;
    console.log('My request is: ' + JSON.stringify(req.body));
    console.log('My data is: ' + data);
    
    db.all('SELECT * FROM categories ORDER BY allocation, category', (err, rows) => {
    
    if (err) {
        throw err;
    }

    const lines = rows.map(row => ({id: row.category_id, allocation: row.allocation, category: row.category, description: row.description}));

    res.render('categories.njk', {title: 'Categories page', lines});
    })

    // res.render('categories.njk', {title: 'Categories page'});
})

//Post methods
app.post('/categories', (req, res) =>{
    
  const selector = req.body.value;

  if (!selector) {
    console.log('I am inside the if.');
    const allocation = req.body.inputAllocations;
    const category = req.body.inputNewCategory;
    const description = req.body.inputDescription;

    console.log('My category is: ' + category);

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
    console.log('I am outside the if.')
    
    console.log('Selector is: ' + selector);

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
    // console.log(req.body);
    // console.log(req.body.value);
    // res.json({
    //     status: 'success'
    // });
    // res.end();
})

// //Delete methods
// app.delete("/categories", (req, res) =>{

//     const data = req.body.value;
//     console.log('Data is: ' + data);

//     //Inserting data to the table
//     db.run('DELETE FROM categories WHERE category_id = ?', [data], (err) => {
//         if (err) {
//             console.error(err.message);
//             res.status(500).send('Error updating data in categories table.');
//         } else {
//             res.status(200);
//             console.log('Data deleted from categories table.');
//         }
//     });

//     res.redirect('/categories');
    
//     // let data = JSON.stringify(req.body);
//     // data = JSON.parse(data);
//     // let value = data.value;
//     // console.log('My request is: ' + JSON.stringify(req.body));
//     // console.log('My data is: ' + data);
//     // console.log('My data is: ' + value);
//     // res.end();
// })


//Server listening
const server = http.createServer(app);
server.listen('3000', (err, html) => {
    console.log('Listening on port 3000');
})

// app.listen(3000, (err, html) =>{
//     console.log(`Working on port` + 3000);
// })