const mongoose = require("mongoose");

const schema = mongoose.Schema;

//main user

const user = new schema({
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    roles:{
        type:Array,

    }

})

const User = mongoose.model("User", user);

module.exports = User;