const mongoose = require("mongoose");
const config = require('config')
module.exports = () => {
  //connect to mongodb by mongo connection string
  mongoose.connect(config.get('db'))
  .then(()=>console.log("successfuly connected to mongodb"))
  .catch((err)=>console.log(err.message));
}
