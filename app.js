//express shit
const express = require("express")
const app = express();


//mongoose (: <3
const mongoose = require("mongoose")
const URI = "mongodb+srv://Monkey:1928Hb..@experiment.pcz8r.mongodb.net/Role-Manager?retryWrites=true&w=majority&appName=Experiment"
mongoose.connect(URI, {useNewUrlParser: true, useUnifiedTopology: true})
.then(result=>{app.listen(3000)}).catch(err=>{console.log(err.message)});

let loggedIn = false;
let mainA = null;

const User = require("./mongo.js")
//create
app.get("/create", (req, res)=>{
    const user = new User({
        username:"Test 01",
        password:"Test 01"
    })
    const result = User.findOne({username: "Test 01"});
        
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
})

app.get("/:name", (req, res)=>{
    const result = User.findOne({username: req.params.name});
        
    result.then(ans=>{
        if(!ans){
            user.save()
            loggedIn = true;
            mainA = user;
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
