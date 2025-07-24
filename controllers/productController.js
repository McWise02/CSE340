const productModel = require("../models/product-model")
const utilities = require("../utilities/")


const product_details = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
product_details.buildByProductId = async function (req, res, next) {
  const productId = req.params.id 
  const data = await productModel.getProductById(productId)
  const grid = await utilities.buildProductGrid([data])
    let nav = await utilities.getNav()
    const productName = data.inv_make + " " + data.inv_model + " " + data.inv_year
  res.render("./inventory/product", {
    title: productName,
    nav,
    grid,
  })
}

  module.exports = product_details
