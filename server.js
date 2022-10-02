const path = require('path');
const express = require('express');
const mongoose = require('mongoose')
const dotenv = require('dotenv');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session)
const connectDB = require('./config/db');


//Load config
require("dotenv").config({ path: "./config/.env" });

// Passport Configuration
require('./config/passport')(passport);

connectDB()

const app = express()

//Body parser
app.use(express.urlencoded({ extended: false}))
app.use(express.json())

//Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//Hadlebar Helpers
const { formatDate, stripTags, truncate, editIcon,} = require('./helpers/hbs')

//Handlebars for views
app.engine('.hbs', exphbs.engine({ helpers: {
  formatDate,
  stripTags, 
  truncate,
  editIcon,
},
    defaultLayout: 'main', 
    extname: '.hbs'})
    
    )
app.set('view engine', '.hbs')

//Sessions
app.use(
    session({
      secret: "keyboard cat",
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({ mongooseConnection: mongoose.connection})
    })
  );

//Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//Set global variable
app.use(function (req, res, next) {
  res.locals.user = req.user || null
  next()
})

//Static folder
app.use(express.static(__dirname + '/public'))

//Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/habits', require('./routes/habits'))


const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}, you better go catch it!`))