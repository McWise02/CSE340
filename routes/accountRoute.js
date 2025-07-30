// Needed Resources 
const express = require("express")
const router = new express.Router() 
const regValidate = require('../utilities/account-validation')
const accountsController = require("../controllers/accountController")
const utilities = require("../utilities/")
// Route to build inventory by classification view
router.get("/login", utilities.handleErrors(accountsController.buildLogin));
router.get("/register", utilities.handleErrors(accountsController.buildRegister));
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountsController.registerAccount)
)
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountsController.validateAccount)
)

module.exports = router;