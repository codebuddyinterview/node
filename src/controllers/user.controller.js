const User = require('../schema/user.schema');
const Post = require('../schema/post.schema');
const { asyncForEach } = require('../helpers/async.helper');

module.exports.getUsersWithPostCount = async (req, res) => {
    try {
        const users = await User.find({}).lean();
        
        await asyncForEach(users, async (user, i) => {
            const posts = await Post.find({userId: user._id});
            users[i].posts = posts;
        });

        res.send({ users });
    } catch (error) {
        res.send({error: error.message});
    }
}