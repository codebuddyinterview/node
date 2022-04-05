const User = require('../schema/user.schema');

module.exports.getUsersWithPostCount = async (req, res) => {
    try {
        //TODO: Implement this API
        res.status(200).json({
            message: 'Implement this API'
        })
    } catch (error) {
        res.send({error: error.message});
    }
}