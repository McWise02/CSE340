const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("/inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory management view
 * ************************** */
invCont.buildInventoryManagement = async function (req, res, next) {
  let nav = await utilities.getNav() 
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null
  })  
}


invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}

  invCont.buildAddInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    const classifications = await utilities.buildClassificationList()
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      errors: null,
      classifications,
    })
  }
/* ***************************
 *  Add Classification 
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  const { classification } = req.body
  const addResult = await invModel.addClassification(classification)
  if (addResult) {
    let nav = await utilities.getNav()
    req.flash("notice", "Classification added successfully.")
    res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav,
      errors:null,
    })
  } else {
    req.flash("notice", "Sorry, there was an error adding the classification.")
    res.status(500).render("inventory/add-classification", {
      title: "Add Classification",
      nav: await utilities.getNav(),
      errors: null,
      classification,
    })
  }
}


/* ***************************
 *  Add Vehicle
 * ************************** */
invCont.addInventory = async function (req, res, next) {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  } = req.body

  try {
    const addResult = await invModel.addInventory({
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    })

    if (addResult) {
      let nav = await utilities.getNav()
      req.flash("notice", "Inventory item added successfully.")
      res.status(201).render("inventory/management", {
        title: "Inventory Management",
        nav,
        errors: null
      })
    } else {
      throw new Error("Insert failed")
    }
  } catch (error) {
    req.flash("notice", "Sorry, there was an error adding the inventory item.")
    const classifications = await utilities.buildClassificationList()
    res.status(500).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav: await utilities.getNav(),
      errors: null,
      classifications,
    })
  }
}



  module.exports = invCont
