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
  res.render("inventory/classification", {
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

  const classifications = await utilities.buildClassificationList()

  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
    classifications
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



/* ***************************
 *  Get Inentory JSON
 * ************************** */
invCont.getInventoryJSON = async function (req, res, next) {
  const classification_id = req.params.classification_id
  try {
    const data = await invModel.getInventoryByClassificationId(classification_id)
    if (data.length > 0) {
      res.status(200).json(data)
    } else {
      res.status(404).json({ message: "No inventory found for this classification." })
    } 
  } catch (error) {
    console.error("Error fetching inventory:", error.message)
    res.status(500).json({ message: "Internal server error while fetching inventory." })
  }
}


invCont.buildEditInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const invId = parseInt(req.params.id)
  const itemData = await invModel.getInventoryById(invId)
  const classificationSelect = await utilities.buildClassificationList()
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}




/* ***************************
 *  Update Vehicle
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  const {
    inv_id,
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
    const updateResult = await invModel.updateInventory(
      inv_id,  
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id
    )

    if (updateResult) {
      const itemName = updateResult.inv_make + " " + updateResult.inv_model
      let nav = await utilities.getNav()
      req.flash("notice", `The ${itemName} was successfully updated.`)
      res.redirect("/inv/inv")
    } else {
      const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
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
    })}
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
