const User = require("../schema/user.schema");

module.exports.getUsersWithPostCount = async (req, res) => {
  try {
    //TODO: Implement this API

    res.status(200).json({});
  } catch (error) {
    res.send({ error: error.message });
  }
};
