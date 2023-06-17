const express = require('express');
const http = require('http');
const path = require('path');
const nunjucks = require('nunjucks');

const app = express();
const port = 3000;

nunjucks.configure(path.resolve('views'),{
    express:app,
    autoscape:true,
    noCache:false,
    watch:true
});

app.set('views', './views');
app.set('view engine', 'njk');

app.use(express.static('node_modules/bootstrap/dist/css/bootstrap.min.css'));
app.use(express.static('node_modules/bootstrap/dist/js/bootstrap.bundle.js'));

// nunjucks.configure(path.resolve(__dirname,'../views'),{
//     express:app,
//     autoscape:true,
//     noCache:false,
//     watch:true
// });



// app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
// app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));

app.get("/", (req, res) =>{
    res.render('index', {title: 'Is it working?'});
})

const server = http.createServer(app);
server.listen('3000', () => {
    console.log('Listenint on port 3000');
})

// app.listen(3000, (err, html) =>{
//     console.log(`Working on port` + 3000);
// })