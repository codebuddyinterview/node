const User = require('../schema/user.schema');
const Post = require('../schema/post.schema')
const mongoose = require('mongoose');
const { ObjectId } = mongoose;

module.exports.getUsersWithPostCount = async (req, res) => {
    try {
        //TODO: Implement this API
        let page = req.query.page ? Number(req.query.page) : 1;
        let limit = req.query.limit ? Number(req.query.limit) : 10;
        let paginationObject = { limit, page };
        let currentPage = page;
        page = page - 1;
        paginationObject['totalDocs'] = await User.countDocuments({});
        paginationObject['totalPages'] = (paginationObject['totalDocs'] / paginationObject['limit']);
        paginationObject['hasPrevPage'] = currentPage > 1;
        paginationObject['hasNextPage'] = currentPage < paginationObject['totalPages'];
        paginationObject['prevPage'] = currentPage <= 1 ? null : currentPage - 1;
        paginationObject['nextPage'] = paginationObject['hasNextPage'] ? currentPage + 1 : null;
        paginationObject['pagingCounter'] = currentPage;
        let users_details = await User.find({}, { __v: 0 }).skip(page * 10).limit(limit);
        let users_list = [];
        for (let user of users_details) {
            let post = await Post.countDocuments({ userId: user._id });
            users_list.push({
                id: user._id.toString(),
                name: user.name,
                posts: post
            });

        }
        res.status(200).json({
            'data': { 'users': users_list, 'pagination': paginationObject }
        })
    } catch (error) {
        res.send({ error: error.message });
    }
}