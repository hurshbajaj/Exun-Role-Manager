
const {Router} = require("express")
const router = new Router();

const authController = require("../controllers/authController.js")
const middleware = authController.middleware;

router.get("/", authController.homeGet)

router.get("/sign-up", authController.signUpGet)

router.post("/sign-up", authController.signUpPost)

router.get("/login", authController.loginGet)

router.post("/login", authController.loginPost)

router.get("/add-role", authController.addRoleGet)

router.post("/add-role", authController.addRolePost)

module.exports = router;