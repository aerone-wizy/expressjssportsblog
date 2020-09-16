const express = require('express');
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const mongoose = require('mongoose')

//Mongoose Connect
mongoose.connect('mongodb://localhost/sportsblog')
const db = mongoose.connection

const port = 3000

//Init app
const app = express()

const index = require('./routes/index')
const articles = require('./routes/articles')
const categories = require('./routes/categories')
const manage = require('./routes/manage')


//View setup
app.set('views', path.join(__dirname, "views"))
app.set("view engine", "pug")
//Moment
app.locals.moment = require('moment')
//body parser middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
//set static folder
app.use(express.static(path.join(__dirname, "public")))
//Express session
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}))
//Express messages
app.use(require('connect-flash')())
app.use((req, res, next) => {
    res.locals.messages = require('express-messages')(req, res)
    next()
})

app.use("/", index)
app.use("/articles", articles)
app.use("/categories", categories)
app.use("/manage", manage)

app.listen(port, () => {
    console.log("Server started on port " + port)
})