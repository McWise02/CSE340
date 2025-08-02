const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get Inventory item by ID
 * ************************** */

async function getInventoryById(inv_id){
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
      WHERE i.inv_id = $1`,
      [inv_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getInventoryByID error " + error)
    throw new Error("Error retrieving inventory item by ID.")
  }
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Check if exact Classification item already exists
 * ************************** */

async function checkExistingClassification(classification){
  try {
    const sql = "SELECT * FROM classification WHERE classification_name = $1"
    const classif = await pool.query(sql, [classification])
    return classif.rowCount
  } catch (error) {
    return error.message
  }
}


/* ***************************
 *  Check if exact inventory item already exists
 * ************************** */
async function checkExistingInventory(item) {
  try {
    const sql = `
      SELECT * FROM public.inventory 
      WHERE inv_make = $1 
        AND inv_model = $2 
        AND inv_year = $3 
        AND inv_description = $4 
        AND inv_image = $5 
        AND inv_thumbnail = $6 
        AND inv_price = $7 
        AND inv_miles = $8 
        AND inv_color = $9 
        AND classification_id = $10
    `
    const values = [
      item.inv_make,
      item.inv_model,
      item.inv_year,
      item.inv_description,
      item.inv_image,
      item.inv_thumbnail,
      item.inv_price,
      item.inv_miles,
      item.inv_color,
      item.classification_id
    ]

    const result = await pool.query(sql, values)
    return result.rowCount
  } catch (error) {
    console.error("checkExistingInventory error:", error.message)
    throw new Error("Database error while checking for existing inventory.")
  }
}



/* ***************************
 *  Add new inventory item
 * ************************** */
async function addInventory(item) {
  try {
    const sql = `
      INSERT INTO public.inventory (
        inv_make, inv_model, inv_year, inv_description, 
        inv_image, inv_thumbnail, inv_price, inv_miles, 
        inv_color, classification_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `
    const values = [
      item.inv_make,
      item.inv_model,
      item.inv_year,
      item.inv_description,
      item.inv_image,
      item.inv_thumbnail,
      item.inv_price,
      item.inv_miles,
      item.inv_color,
      item.classification_id
    ]
    const result = await pool.query(sql, values)
    return result.rows[0]
  } catch (error) {
    console.error("addInventory error:", error.message)
    throw new Error("Database error while adding inventory.")
  }
}

/* ***************************
 *  Add new classification
 * ************************** */
async function addClassification(classification_name) {
  try {
    const sql = "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *"
    const result = await pool.query(sql, [classification_name])
    return result.rows[0]
  } catch (error) {
    console.error("addClassification error:", error.message)
    throw new Error("Database error while adding classification.")
  }
}


/* ***************************
 *  Update inventory item
 * ************************** */
async function updateInventory(
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
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}


module.exports = {updateInventory, getClassifications, getInventoryByClassificationId, checkExistingClassification, checkExistingInventory, addInventory, addClassification, getInventoryById};