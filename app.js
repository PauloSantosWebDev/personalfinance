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
    db.all('SELECT * FROM categories ORDER BY allocation, category', (err, rows) => {
    
    if (err) {
        throw err;
    }

    const lines = rows.map(row => ({allocation: row.allocation, category: row.category, description: row.description}));

    res.render('categories.njk', {title: 'Categories page', lines});
    })

    // res.render('categories.njk', {title: 'Categories page'});
})

//Post methods
app.post('/categories', (req, res) =>{
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
})

//Server listening
const server = http.createServer(app);
server.listen('3000', (err, html) => {
    console.log('Listening on port 3000');
})

// app.listen(3000, (err, html) =>{
//     console.log(`Working on port` + 3000);
// })