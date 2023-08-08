# personalfinance
Web app to help people have a better control over their finances. It focus on credits and debts.
#### Video demo: https://youtu.be/Z15ByaXLCbg
#### Description:
The main language for this project was JavaScript, it uses express.js as its framework, Nunjucks as the templating laguage, squlite3 as my SQL database engine, and Node.js to power the server side. HTML, CSS and bootstrap 5 are also an important part of the project.

How to use the web application?

The first step is to create an account and signin. Only after you have created an account you can enjoy what the app has to offer.

The second step is to create categories for your credits and debts. Some examples of debts are: student load and house mortgage. Examples of credits are refunds from the taxation office or values to receive from some proccesses you have own on the court. No worries, if you are not happy with the category you have created you can easily delete it by clicking the delete button on the right.

The third step is to use the credit/debt creation pages. You have to input the category, date, ammount deptor/creditor's name and a description to help you to remember why that debt or credit was created. Notice that below the form to insert data a table is shown with the previous inputs made by you. It shows you the initial amount and also the current ammount. If you have borrowed, for example, $100,000.00 and paid $20,000.00 the current ammount owned shown will be, of course, $80,000.00.

After the creation of debts and credits you can input payments made towards your debts or received from your debtors. To input payments you have to use credit ID or debt ID. These numbers are shown in the table below the form. Date, payment and description have, also, to be provided.

The last feature of the app is the payments history. It will shown you all the payments made and received in their respective pages.

With this app, you don't have to worry about not remembering how much your friend owns you after having borrowed $200.00.

Some technicalities.

The app.js file is the main file for this project. Some modulus required to have this app working are: "bcrypt": "^5.1.0", "bootstrap-icons": "^1.10.5", "express-session": "^1.17.3", "nunjucks": "^3.2.4", "bootstrap": "^5.3.0", "chokidar": "^3.5.3", "express": "^4.18.2", and "sqlite3": "^5.1.6". This file contains what is needed to manage the signup and signin process, the database and the methods to interact with the server.

The project has a layout.njk that is used by all the other templates and they live in the views folder. A db.js file is used to create the tables needed and starting the database. Different JavaScript files (apart from app.js and db.js) were created to give functionalities to the pages and interact with the server side.

The project has a total of 26 files (11 .js files, 12 .njk files, 1 .css file, 1 .jpg file and 1 .sqlite file).