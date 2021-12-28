module.exports.createPost = (req, res) => {
    try {
        const { userId, title, description } = req.body;
        
        // TODO: 1. Validate userId, title, description
        /**
         * Validation criteria:
         * 1. userId must be a valid ObjectId
         * 2. title must be a string and minimum of 10 characters excluding spaces
         * 3. description must be a string and minimum of 50 characters excluding spaces
         */
        // TODO: 2. Create post and return in the response
        
        res.send({});
    } catch (error) {
        res.send({error: error.message});
    }
}