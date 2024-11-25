//cookie (:
const cookieParser = require("cookie-parser")

// Route shit
const routes = require("./routes/main.js")

//express shit
const express = require("express")
const app = express();

require("dotenv").config();

//mongoose (: <3
const mongoose = require("mongoose")
mongoose.connect(process.env.URI, {useNewUrlParser: true, useUnifiedTopology: true})
.then(result=>{app.listen(3000)}).catch(err=>{console.log(err.message)});

const authController = require('./controllers/authController.js');
const middleware = authController.middleware;


//not rlly needed here but for good measure :P
app.use(express.json());

app.set("view engine", "ejs")

app.use(express.static("static"))


//since using form
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser())

app.use((req, res, next)=>{
    middleware.isLoggedIn(req, res, next)
})

app.use(routes)
