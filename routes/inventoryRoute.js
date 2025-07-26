// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const productController = require("../controllers/productController")
const utilities = require("../utilities/")
// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:id", utilities.handleErrors(productController.buildByProductId));

module.exports = router;