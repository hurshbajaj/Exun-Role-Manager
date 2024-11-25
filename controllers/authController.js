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
    return await bcrypt.hash(password, salt);
}

//middleware
module.exports.middleware={
    protectedRoute: (req, res, next)=>{
        let token__ = req.cookies.jwt;
        if(token__){
            jwt.verify(token__, process.env.secret, (err, decoded) => {
                if(err){
                    res.json("Error")
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
    },

    isAuthAlr: async (req, res, next) =>{
        let token__ = req.cookies.jwt;
        if(token__){
            res.redirect("/add-role")
        }
        else{
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

    const possibleFlux = await user.findOne({username: req.body["username"]});
    if(!possibleFlux){
        const user_ = await new user({
            username: req.body["username"],
            password: req.body["password"]
        })
        user_.password = await hashPassword(req.body["password"])
        user_.save()
        const token_ = token(user_._id)
        res.cookie("jwt", token_, {httpOnly: true, maxAge: expiresIn * 1000})

        res.json(user_)
    }
    else{
        res.json({error: "User Taken"})
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
            res.json(possibleUser)
        }
        else{
            res.json({error: "Incorrect Password"})
        }

    }
    else{
        res.json({error: "User Not Found"})
    }

}

module.exports.addRoleGet = async (req, res) =>{
    res.render('addRole')
}
module.exports.addRolePost = async (req, res) => {

    let userMain = await user.findById(res.locals.user._id);

    userMain.roles.push(req.body["role"]);

    await userMain.save();

    res.json(userMain);

};
module.exports.findRoleGet = async (req, res) => {
    res.render("findRole");
}
module.exports.findRolePost = async (req, res) => {
    const findUser = await user.findOne({username: req.body["user"]})
    if(findUser){
        res.json(findUser.roles)
    }
    else{
        res.json({error: "User Not Found"})
    }
}


module.exports.addRoleDelete = async (req, res) => {
    let mainUser = user.findById(res.locals.user._id)
    mainUser.roles.filter(role => role != req.body.roleToDelete)

    res.json(mainUser.roles)
}