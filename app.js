const express = require('express');
const http = require('http');
const path = require('path');
const nunjucks = require('nunjucks');

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

//Creating routes
app.get("/", (req, res) =>{
    res.render('index', {title: 'Home page'});
})

const server = http.createServer(app);
server.listen('3000', (err, html) => {
    console.log('Listening on port 3000');
})

// app.listen(3000, (err, html) =>{
//     console.log(`Working on port` + 3000);
// })