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

//Creating routes
//Get methods
app.get("/", (req, res) =>{
    res.render('index', {title: 'Home page'});
})

app.get("/categincome", (req, res) =>{
    res.render('categincome.njk', {title: 'New income category'});
})

//Post methods
app.post('/categincome', (req, res) =>{
    const incomeCategory = req.body.inputIncomeCategory;
    const description = req.body.inputIncomeCategoryDescription;

    console.log('My income category is: ' + incomeCategory);

    //Command to insert new customes to the customers table in the hydroil.sqlite database
    db.run('INSERT INTO income_categories (category, description) VALUES (?, ?)', [incomeCategory, description], (err) => {
        if (err) {
        console.error(err.message);
        res.status(500).send('Error updating data in customer table.');
        } else {
        res.status(200);
        console.log('Data updated successfully in customers table.');
        res.redirect('/categincome');
        }
    });

    db.all('SELECT * FROM income_categories', (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach(row => {
            console.log(row.category_id, row.category, row.description);
        })
    })
})

//Server listening
const server = http.createServer(app);
server.listen('3000', (err, html) => {
    console.log('Listening on port 3000');
})

// app.listen(3000, (err, html) =>{
//     console.log(`Working on port` + 3000);
// })