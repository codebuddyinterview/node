const User = require("../schema/user.schema");

module.exports.getUsersWithPostCount = async (req, res) => {
    try {
        //TODO: Implement this API
        let page = parseInt(req.query.page);
        let limit = parseInt(req.query.limit);
        if (!page) page = 1;
        if (!limit) limit = 10;
        const skip = (page - 1) * limit;

        const users = await User.aggregate([
            { $lookup: { from: "posts", localField: "_id", foreignField: "userId", as: "posts" } },
            { $project: { name: 1, posts: { $size: "$posts" } } },
            { $skip: skip },
            { $limit: limit },
        ]);
        
        let totalDocs = await User.aggregate([
            { $lookup: { from: "posts", localField: "_id", foreignField: "userId", as: "posts" } },
            { $count: "total" },
        ]);

        const totalDocsCount = totalDocs[0].total;
        totalPages = Math.ceil(totalDocsCount / limit);
        let hasPrevPage = false;
        let hasNextPage = false;
        let prevPage = null;
        let nextPage = null;

        if (page < totalPages) hasNextPage = true;
        if (page > 1) hasPrevPage = true;
        if (page > 1) prevPage = page - 1;
        if (page < totalPages) nextPage = page + 1;

        const data = {
            data: {
                users: users,
                pagination: {
                    totalDocs: totalDocsCount,
                    limit: limit,
                    page: page,
                    totalPages: totalPages,
                    pagingCounter: skip+1,
                    hasPrevPage: hasPrevPage,
                    hasNextPage: hasNextPage,
                    prevPage: prevPage,
                    nextPage: nextPage,
                },
            },
        };

        res.status(200).json(data);
    } catch (error) {
        res.send({ error: error.message });
    }
};
