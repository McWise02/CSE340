const utilities = require("../utilities/")
const errorController = {}

errorController.buildError = async function(req, res){
  const nav = await utilities.getNav()

  let error = doError(10, 0) // This will throw an error
  res.render("index", {title: "Home", nav})
}


function doError(numerator, denominator) {
  if (denominator == 0) {
    throw new Error('You cannot divide by zero!');
  } 
  return numerator / denominator;
}

module.exports = errorController