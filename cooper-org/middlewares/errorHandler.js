//errors response send to user like Network error and some specific message
module.exports = async (error, req, res, next) => {
  // if (error.message == "invalid signature") {
  //   return res.status(401).send({ message: "Link expired" });
  // }
  // if (error.message.indexOf("`email` to be unique") > -1) {
  //   return res.status(400).send({ message: "User already exist" });
  // }
  console.log(error);
  return res.status(500).send({ message: error.message });
};
