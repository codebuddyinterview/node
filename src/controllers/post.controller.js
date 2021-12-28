module.exports.createPost = (req, res) => {
    try {
        const { userId, title, description } = req.body;
        
        // TODO: 1. Validate userId, title, description
        // TODO: 2. Create post and return in the response
        
        res.send({});
    } catch (error) {
        res.send({error: error.message});
    }
}