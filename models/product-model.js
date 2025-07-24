const pool = require("../database/")

/* ***************************
 *  Get produc by ID
 * ************************** */
async function getProductById(productId) {
  try {
    console.log("Product ID:", productId)
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
      WHERE i.inv_id = $1`,
      [productId]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getProductById error " + error)
  }
}

module.exports = { getProductById };