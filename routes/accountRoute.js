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
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountsController.registerAccount)
)

module.exports = router;