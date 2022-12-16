const User = require('../schema/user.schema');
const Post = require('../schema/post.schema');

module.exports.getUsersWithPostCount = async (req, res) => {
    var limit = req.query.limit;
    var page = req.query.page;
    var rsp =[]
    try {
        //TODO: Implement this API
        const response = await User.find().limit(limit).skip((page - 1) * limit)
        for(var i = 0 ; i < response.length ; i++){
            var UserId  = response[i]._id
            var responsesssss = await Post.aggregate([
                {
                    $match: { userId: UserId }
                },
                {$group : {_id : response[i]._id, count : {$sum : 1}}}])

            var s = {post: responsesssss[0].count};
        rsp[i] = {_id:response[i]._id, name : response[i].name, posts : responsesssss[0].count}
        }
        res.status(200).json({
            data : {
            users: rsp,
            "pagination": {
                "totalDocs": 100,
                "limit": parseInt(limit),
                "page": parseInt(page),
                "totalPages":(100/limit) ,
                "pagingCounter": page,
                "hasPrevPage": page ==1 || page == null || page == undefined ?false: true,
                "hasNextPage": page ==(100/limit) || page == null || page == undefined ?false: true,
                "prevPage": page ==1 || page == null || page == undefined ?false: page -1,
                "nextPage": page ==(100/limit) || page == null || page == undefined ?false: page +1
            }
            }
        })
    } catch (error) {
        console.log(error)
        res.send({error: error.message});
    }
}