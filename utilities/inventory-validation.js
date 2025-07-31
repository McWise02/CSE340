const utilities = require(".")
  const { body, validationResult } = require("express-validator")
  const validate = {}
const inventoryModel = require("../models/inventory-model")



/*  **********************************
  *  Add Classification Data Validation Rules
  * ********************************* */

 validate.classificationRules = () => {
    return [
      // firstname is required and must be string
      body("classification")
        .trim()
        .escape()
        .notEmpty().withMessage("please provide a classifcation name")
        .isLength({ min: 1 })
        .isAlpha()
        .matches(/^[a-zA-Z0-9]+$/).withMessage("Please see requiirements for classification name.")
        .withMessage("Please provide a valid") // on error this message is sent.
        .custom(async (classification) => {
                const classExists = await inventoryModel.checkExistingClassification(classification)
                if (classExists){
                throw new Error("Email exists. Please log in or use different email")
                }
            }),

    ]}




/*  **********************************
  *  Add Inventory Data Validation Rules
  * ********************************* */
    validate.inventoryRules = () => {
    return [
        body("inv_make")
        .trim()
        .escape()
        .notEmpty().withMessage("Make is required.")
        .isLength({ min: 2 }).withMessage("Make must be at least 2 characters.")
        .matches(/^[a-zA-Z0-9 ]+$/).withMessage("Make can only contain letters, numbers, and spaces."),

        body("inv_model")
        .trim()
        .escape()
        .notEmpty().withMessage("Model is required.")
        .isLength({ min: 1 }).withMessage("Model must be at least 1 character.")
        .matches(/^[a-zA-Z0-9\- ]+$/).withMessage("Model can only contain letters, numbers, hyphens, and spaces."),

        body("inv_year")
        .trim()
        .notEmpty().withMessage("Year is required.")
        .isLength({ min: 4, max: 4 }).withMessage("Year must be 4 digits.")
        .isInt({ min: 1900, max: new Date().getFullYear() + 50 }).withMessage("Please enter a valid year."),

        body("inv_description")
        .trim()
        .escape()
        .notEmpty().withMessage("Description is required.")
        .isLength({ min: 10 }).withMessage("Description must be at least 10 characters."),

        body("inv_image")
        .trim()
        .notEmpty().withMessage("Image path is required."),
        

        body("inv_thumbnail")
        .trim()
        .notEmpty().withMessage("Thumbnail path is required."),
        

        body("inv_price")
        .notEmpty().withMessage("Price is required.")
        .isFloat({ min: 0 }).withMessage("Price must be a positive number."),

        body("inv_miles")
        .notEmpty().withMessage("Miles are required.")
        .isInt({ min: 0 }).withMessage("Miles must be a non-negative integer."),

        body("inv_color")
        .trim()
        .escape()
        .notEmpty().withMessage("Color is required.")
        .isAlpha('en-US', { ignore: ' ' }).withMessage("Color must only contain letters."),

        body("classification_id")
        .notEmpty().withMessage("Classification is required.")
        .isInt({ min: 1 }).withMessage("Invalid classification ID."),

                // Custom check: prevent duplicates
        body("inv_make").custom(async (_, { req }) => {
        const exists = await inventoryModel.checkExistingInventory(req.body)
        if (exists) {
            throw new Error("This EXACT vehicle entry already exists in the inventory.")
        }
        return true
        })
    ]
    }








    /*  **********************************
  *  Check  Classification Data and return errors or continue to registring classification
  * ********************************* */


validate.checkClassificationData = async (req, res, next) => {
  const { classification } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/add-classification", {
        errors,
        title: "Add Classification",
        nav,
        classification,
      })
      return
    }
    next()
    }


    /*  **********************************
  *  Check  Inventory Data and return errors or continue to registring classification
  * ********************************* */
validate.checkInventoryData = async (req, res, next) => {
  try {
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
      classification_id,
    } = req.body

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      const nav = await utilities.getNav()
      const classifications = await utilities.buildClassificationList()

      return res.render("inventory/add-inventory", {
        title: "Add Inventory",
        nav,
        classifications,
        errors,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id,
      })
    }

    next()
  } catch (error) {
    console.error("Validation error in checkInventoryData:", error)
    next(error)
  }
}



module.exports = validate