const express = require('express');
const db = require('./db');
const http = require('http');
const path = require('path');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const sessions = require('express-session');

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
//Setting up session middleware
app.use(sessions({
  secret: 'my-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 86400000 }
}))

//Used to check the database
// db.run('DROP TABLE credits');
// db.run('DROP TABLE payments_received');
// db.run('DROP TABLE interests_received');
// db.all('SELECT * FROM payments_received INNER JOIN credits ON payments_received.credit_id = credits.credit_id ORDER BY payments_received.credit_id', (err, rows) => {
//   if (err) {
//     throw err;
//   }
//   rows.forEach(row => {
//     console.log(row);
//   })
// })
// 
// db.all('SELECT * FROM credits', (err, rows) => {
//   if (err) {
//     throw err;
//   }
//   rows.forEach(row => {
//     console.log(row);
//   })
// })

//Creating routes
//Get methods

//Used to get the sign in page
app.get("/signin", (req, res) => {
  res.render('signin.njk', {title: 'Sign in page'});
})

//Used do get the registration page
app.get('/register', (req, res) => {
  res.render('register.njk', {title: 'Registration page'});
})

//Used to destroy the users' session and sign them out
app.get('/signout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/signin');
    }
  });
})

app.get("/", (req, res) => {
  if (req.session.user_id) { 
    res.render('index', {title: 'Home page'});
  }
  else {
    res.redirect('/signin');
  }
})

//Categories page
app.get("/categories", (req, res) => {
  if (req.session.user_id) {
    db.all('SELECT * FROM categories WHERE user_id = ? ORDER BY allocation, category', [req.session.user_id], (err, rows) => {
  
      if (err) {
          throw err;
      }
    
      const lines = rows.map(row => ({id: row.category_id, allocation: row.allocation, category: row.category, description: row.description}));
    
      res.render('categories.njk', {title: 'Categories page', lines});
      })
  }
  else {
    res.redirect('/signin');
  }

})

//New credits page
app.get('/newcredits', (req, res) => {
  if (req.session.user_id) {
    const credit = 'Credits';
    db.all('SELECT category FROM categories WHERE allocation = ? AND user_id = ?', [credit, req.session.user_id], (err, rows) => {
      if (err) {
        throw err;
      }
      const lines = rows.map(row => ({category: row.category}));
      db.all('SELECT * from credits WHERE user_id =? ORDER BY date', [req.session.user_id], (err, rows) => {
        if (err) {
          throw err;
        }
        const creditLines = rows.map(row => ({category: row.category, date: row.date, iamount: row.initial_amount, camount: row.current_amount, debtor: row.debtor, description: row.description}));
        res.render('newcredits.njk', {title:'New credits page', lines, creditLines});
      })
      // res.render('newcredits.njk', {title:'New credits page', lines});
    })
  } 
  else {
    res.redirect('/signin');
  }
})

//Payment received page
app.get('/paymentreceived', (req, res) => {
  if (req.session.user_id) {
    // db.all('SELECT * FROM credits WHERE user_id = ?', [req.session.user_id], (err, rows) => {
    //   if (err) {
    //     throw err;
    //   }
      // const lines = rows.map(row => ({name: row.debtor, date: row.date, amount: row.initial_amount}));
      db.all('SELECT * FROM credits WHERE user_id =? ORDER BY date', [req.session.user_id], (err, rows) => {
        if (err) {
          throw err;
        }
        const creditLines = rows.map(row => ({creditId: row.credit_id, category: row.category, date: row.date, iamount: row.initial_amount, camount: row.current_amount, debtor: row.debtor, description: row.description}));
        res.render('paymentreceived.njk', {title:'Payments received', creditLines});
      }) 
      // res.render('paymentreceived.njk', {title: 'Payments received', lines});
    // })
  }
  else {
    res.redirect('/signin');
  }
})

//History of payments received
app.get('/paymenthistory', (req, res) => {
  if (req.session.user_id) {
    db.all('SELECT * FROM payments_received INNER JOIN credits ON payments_received.credit_id = credits.credit_id WHERE user_id = ? ORDER BY payments_received.credit_id', [req.session.user_id], (err, rows) => {
      if (err) {
        throw err;
      }

      const paymentLines = rows.map(row => ({creditId: row.credit_id, payer: row.payer, date: row.payment_date, amount: row.amount, description: row.detail}));
      res.render('paymenthistory.njk', {title:'History of payments received', paymentLines});

    })
    
    // db.all('SELECT credit_id FROM credits WHERE user_id = ?', [req.session.user_id], (err, rows) => {
    //   if(err) {
    //     throw err;
    //   }
    //   // const creditId = rows.map(row => ({creditId: row.credit_id}));
    //   const creditId = rows.map(row => (row.credit_id)).join(',');
    //   console.log(creditId);
    //   db.all('SELECT * FROM payments_received WHERE credit_id IN (?) GROUP BY credit_id ORDER BY credit_id', [creditId], (err, rows) => {
    //     if (err) {
    //       throw err;
    //     }
    //     const paymentLines = rows.map(row => ({creditId: row.credit_id, payer: row.payer, date: row.date, amount: row.amount, description: row.detail}));
    //     console.log(paymentLines);
    //     res.render('paymenthistory.njk', {title:'History of payments', paymentLines});
    //   }) 
    // })

  }
  else {
    res.redirect('/signin');
  }
})

//History of payments made
app.get('/paymenthistorydebt', (req, res) => {
  if (req.session.user_id) {
    db.all('SELECT * FROM payments_made INNER JOIN debts ON payments_made.debt_id = debts.debt_id WHERE user_id = ? ORDER BY payments_made.debt_id', [req.session.user_id], (err, rows) => {
      if (err) {
        throw err;
      }
      const paymentLines = rows.map(row => ({debtId: row.debt_id, receiver: row.receiver, date: row.payment_date, amount: row.amount, description: row.detail}));
      res.render('paymenthistorydebt.njk', {title:'History of payments made', paymentLines});

    })
  }
  else {
    res.redirect('/signin');
  }
})

//New debts page
app.get('/newdebts', (req, res) => {
  if (req.session.user_id) {
    const debt = 'Debts';
    db.all('SELECT category FROM categories WHERE allocation = ? AND user_id = ?', [debt, req.session.user_id], (err, rows) => {
      if (err) {
        throw err;
      }
      const lines = rows.map(row => ({category: row.category}));
      db.all('SELECT * from debts WHERE user_id =? ORDER BY date', [req.session.user_id], (err, rows) => {
        if (err) {
          throw err;
        }
        const debtLines = rows.map(row => ({category: row.category, date: row.date, iamount: row.initial_amount, camount: row.current_amount, creditor: row.creditor, description: row.description}));
        res.render('newdebts.njk', {title:'New debts page', lines, debtLines});
      })
    })
  } 
  else {
    res.redirect('/signin');
  }
})

//Payment made page
app.get('/paymentmade', (req, res) => {
  if (req.session.user_id) {
    db.all('SELECT * FROM debts WHERE user_id =? ORDER BY date', [req.session.user_id], (err, rows) => {
      if (err) {
        throw err;
      }
      const debtLines = rows.map(row => ({debtId: row.debt_id, category: row.category, date: row.date, iamount: row.initial_amount, camount: row.current_amount, creditor: row.creditor, description: row.description}));
      res.render('paymentmade.njk', {title:'Payments made', debtLines});
    }) 
  }
  else {
    res.redirect('/signin');
  }
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
    db.run('INSERT INTO categories (user_id, allocation, category, description) VALUES (?, ?, ?, ?)', [req.session.user_id, allocation, category, description], (err) => {
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

//Post method to populate credits table
app.post('/newcredits', (req, res) => {
  const categ = req.body.inputCategory;
  const date = req.body.inputDateCreated;
  const amount = req.body.inputAmount;
  const debtor = req.body.inputDebtor;
  const description = req.body.inputDescription;

  db.run('INSERT INTO credits (user_id, category, date, initial_amount, debtor, description, current_amount) VALUES (?, ?, ?, ?, ?, ?, ?)', [req.session.user_id, categ, date, amount, debtor, description, amount], (err) => {
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

//Post method to populate payments_received table and update credits table
app.post('/paymentreceived', (req, res) => {
  const creditId = req.body.inputCreditID;
  // const dateCreated = req.body.inputDateCreated;
  // const initAmount = req.body.inputInitialAmount;
  const date = req.body.inputPaymentDate;
  const payment = req.body.inputPayment;
  const details = req.body.inputDescription;

  db.get('SELECT debtor, current_amount FROM credits WHERE credit_id = ?', [creditId], (err, row) => {

    if (err) {
      throw err;
    }

    // const credit_id = row.credit_id;
    const debtor = row.debtor;
    const current = row.current_amount;
    const remaining = current - payment;

    db.run('INSERT INTO payments_received (credit_id, payment_date, amount, payer, detail) VALUES (?, ?, ?, ?, ?)', [creditId, date, payment, debtor, details], (err) => {
      if (err) {
        console.error(err.message);
        res.status(500).send('Error updating data in payments_received table.');
      } 
      else {
        res.status(200);
        console.log('Data updated successfully in payments_received table.');
        // res.redirect('/paymentreceived');
      }
    })

    db.run('UPDATE credits SET current_amount = ? WHERE credit_id = ? AND user_id = ?',[remaining, creditId, req.session.user_id], (err) =>{
      if (err) {
        console.error(err.message);
        res.status(500).send('Error updating current_amount in credits table.');
        } else {
        res.status(200);
        console.log('current_amount updated successfully in credits table.');
        res.redirect('/paymentreceived');
        }
    })
  })
})

//Post method to populate credits table
app.post('/newdebts', (req, res) => {
  const categ = req.body.inputCategory;
  const date = req.body.inputDateCreated;
  const amount = req.body.inputAmount;
  const creditor = req.body.inputCreditor;
  const description = req.body.inputDescription;

  db.run('INSERT INTO debts (user_id, category, date, initial_amount, creditor, description, current_amount) VALUES (?, ?, ?, ?, ?, ?, ?)', [req.session.user_id, categ, date, amount, creditor, description, amount], (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Error updating data in debts table.');
      } else {
      res.status(200);
      console.log('Data updated successfully in debts table.');
      res.redirect('/newdebts');
      }
  });
})

//Post method to populate payments_made table and update debts table
app.post('/paymentmade', (req, res) => {
  const debtId = req.body.inputDebtID;
  const date = req.body.inputPaymentDate;
  const payment = req.body.inputPayment;
  const details = req.body.inputDescription;

  db.get('SELECT creditor, current_amount FROM debts WHERE debt_id = ?', [debtId], (err, row) => {

    if (err) {
      throw err;
    }

    // const credit_id = row.credit_id;
    const creditor = row.creditor;
    const current = row.current_amount;
    const remaining = current - payment;

    db.run('INSERT INTO payments_made (debt_id, payment_date, amount, receiver, detail) VALUES (?, ?, ?, ?, ?)', [debtId, date, payment, creditor, details], (err) => {
      if (err) {
        console.error(err.message);
        res.status(500).send('Error updating data in payments_made table.');
      } 
      else {
        res.status(200);
        console.log('Data updated successfully in payments_made table.');
      }
    })

    db.run('UPDATE debts SET current_amount = ? WHERE debt_id = ? AND user_id = ?',[remaining, debtId, req.session.user_id], (err) =>{
      if (err) {
        console.error(err.message);
        res.status(500).send('Error updating current_amount in debts table.');
        } else {
        res.status(200);
        console.log('current_amount updated successfully in debts table.');
        res.redirect('/paymentmade');
        }
    })
  })
})

//Post method used to sign up users
app.post('/register', async (req, res) => {
  const user = req.body.inputUserName;
  const password = req.body.password;
  const passwordConfirmation = req.body.passwordConfirmation;

  if (user == '' || password == '' || passwordConfirmation == '' || password != passwordConfirmation) {
    res.render('error.njk', {title: 'Error page', errorMessage: 'User not registered! Please make sure data is not changed in the client side.', refLink: '/signin'});
  }

  const hash = await bcrypt.hash(password, 10);
  
  db.run('INSERT INTO users (user_name, password) VALUES (?, ?)', [user, hash], (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Error inserting user data in users table.');
    } 
    else {
      res.status(200);
      console.log('Data inserted successfully in users table.');
      res.redirect('/signin');
    }
  })


  // res.render("register.njk");
})

//Post method used to sign in users
app.post('/signin', (req, res) => {

  const user = req.body.inputUserName;
  const password = req.body.password;

  db.all('SELECT * FROM users WHERE user_name = ?', [user], async (err, rows) => {
    if (err) {
      throw err;
    }

    const hashedPassword = rows.map(row => ({id: row.user_id, password: row.password}));

    const isMatch = await bcrypt.compare(password, hashedPassword[0].password);

    if (isMatch) {
      req.session.user_id = hashedPassword[0].id;
      res.redirect('/');
    } 
    else {
      res.send('Invalid username or password');
    }
  })
})

//Server listening
const server = http.createServer(app);
server.listen('3000', (err, html) => {
    console.log('Listening on port 3000');
})