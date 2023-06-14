const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const expressLayouts = require('express-ejs-layouts')
const session = require('express-session')
const cookieParser = require('cookie-parser');
const flash = require('connect-flash')
const mongoose = require('mongoose')
const app = express()
mongoose.connect('mongodb://localhost:27017/Docusafe', {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log("error connecting to MongoDB:", err))
app.use(expressLayouts)
app.set('view engine', 'ejs')
app.use(cookieParser())
app.use(flash())
app.use(
    session({
        secret: "secret",
        resave: true,
        saveUninitialized: true,
        cookie: {
            secure: true, 
            sameSite: 'none',
          }
    })
);

app.use(session({
    secret: 'MADHAVMADHAVMADHAV',
    resave: false,
    saveUninitialized: false 
  }));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, "public")))
const Moralis = require('moralis').default
Moralis.start({
    apiKey: "WLoq4IR3FE2QVbSi5cKGXz9gjYuwUeNeIEtJH5f6hWl9cBi5NIM5YV8cTk01IDCl"
});

app.get("/", (req, res) => {
    res.render("home.ejs")
})
app.use('/student', require('./routes/student.js'))
app.use('/admin', require('./routes/admin.js'))

const port = process.env.PORT || 3000
app.listen(port, function () {
    console.log("server is running on the port 3000 ");
})

