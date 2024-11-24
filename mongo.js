const mongoose = require("mongoose");
const bcrypt = require("bcrypt")

const schema = mongoose.Schema;

//main user

const user_ = new schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    roles:{
        type: [String], 
        default: [], 

    }

})


const user = mongoose.model("User", user_);

module.exports = user;