
const {Router} = require("express")
const router = new Router();

const authController = require("../controllers/authController.js")
const middleware = authController.middleware;

router.get("/", authController.homeGet)

router.get("/sign-up", middleware.isAuthAlr,authController.signUpGet)

router.post("/sign-up", middleware.isAuthAlr,authController.signUpPost)

router.get("/login", middleware.isAuthAlr,authController.loginGet)

router.post("/login", middleware.isAuthAlr,authController.loginPost)

router.get("/add-role", middleware.protectedRoute,authController.addRoleGet)

router.post("/add-role", middleware.protectedRoute,authController.addRolePost)

router.delete("/add-role", middleware.protectedRoute,authController.deleteRole)

router.get("/find-role", middleware.forbidden,authController.findRoleGet)

router.post("/find-role", middleware.forbidden, authController.findRolePost)

module.exports = router;