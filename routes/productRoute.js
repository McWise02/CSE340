const express = require("express")
const router = new express.Router() 
const productController = require("../controllers/productController")
// Route to build inventory by product ID
router.get("/:id", productController.buildByProductId);

module.exports = router;