const bcrypt = require("bcrypt")
const user = require("../mongo.js")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
require("dotenv").config();

const expiresIn = 7 * 24 * 60 * 60;
//base functions
const token = (id) => {
    return jwt.sign({id}, process.env.secret, {expiresIn})
}

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
}

//middleware
module.exports.middleware={
    protectedRoute: (req, res, next)=>{
        let token__ = req.cookies.jwt;
        if(token__){
            jwt.verify(token__, process.env.secret, (err, decoded) => {
                if(err){
                    throw new Error(err.message)
                }
                
                next();
            })
        }
        else{
            res.redirect("/");
        }
    },

    isLoggedIn: async (req, res, next) =>{
        let token__ = req.cookies.jwt;
        if(token__){
            jwt.verify(token__, process.env.secret, async(err, decoded) => {
                if(err){
                    res.locals.user = null;
                }
                res.locals.user = await user.findById(decoded.id);
                next();
            })
        }
        else{
            res.locals.user = null;
            next()
        }
    }
}

module.exports.signUpGet = (req, res)=>{
    res.render("signUp");

}

module.exports.homeGet = (req, res)=>{
    res.render("home");

}

module.exports.signUpPost = async (req, res)=>{
    const user_ = await new user({
        username: req.body["username"],
        password: req.body["password"]
    })
    const possibleFlux = await user.findOne({username: req.body["username"]});
    if(!possibleFlux){
        hashPassword(req.body["password"])
        user_.save()
        const token_ = token(user_._id)
        res.cookie("jwt", token_, {httpOnly: true, maxAge: expiresIn * 1000})

        res.send(user_)
    }
    else{
        res.send("already exists /:", possibleFlux)
    }


}

module.exports.loginGet = (req, res)=>{
    res.render("login");

}

module.exports.loginPost = async (req, res)=>{
    let possibleUser = await user.findOne({username: req.body["username"]})

    if(possibleUser){
        if(bcrypt.compare(req.body["password"], possibleUser.password)){
            const token_ = token(possibleUser._id)
            res.cookie("jwt", token_, {httpOnly: true, maxAge: expiresIn * 1000})
            res.send("logged in")
        }

    }

}

module.exports.addRoleGet = async (req, res) =>{
    res.render('addRole')
}
module.exports.addRolePost = async (req, res) => {
    try {
        
        let userMain = await user.findById(res.locals.user._id);

        userMain.roles.push(req.body["role"]);

        await userMain.save();

        res.send(userMain.roles);
    } catch (err) {
        console.error("Error updating roles:", err.message);
        res.send("An error occurred while updating roles.");
    }
};
