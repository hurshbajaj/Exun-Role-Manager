//express shit
const express = require("express")
const app = express();

require("dotenv").config();

//mongoose (: <3
const mongoose = require("mongoose")
mongoose.connect(process.env.URI, {useNewUrlParser: true, useUnifiedTopology: true})
.then(result=>{app.listen(3000)}).catch(err=>{console.log(err.message)});

let loggedIn = false;
let mainA = null;

const User = require("./mongo.js")

app.set("view engine", "ejs")

app.use(express.static("static"))

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("home")
})
//create
app.get("/sign-up", (req, res)=>{
    res.render("signUp")
})
app.post("/sign-up", (req, res)=>{
    if(req.body){
        
        const user = new User({
            username:req.body["username"],
            password:req.body["password"]
        })
        const result = User.findOne({username: req.body["username"]});
            
        result.then(ans=>{
            if(!ans){
                user.save()
                loggedIn = true;
                mainA = user;
                res.send("created (:");
            }
            else{
                res.send("aww (:");
            }
        })
    }
})

app.get("/:name", (req, res)=>{
    const result = User.findOne({username: req.params.name});
        
    result.then(ans=>{
        if(!ans){
            res.send("Nope");
        }
        else{
            
            loggedIn = true;
            mainA = ans;
            console.log(ans)
            res.send("moment of truth...");
        }
    })
})
    


//create
//delete
//find (others[specific])


