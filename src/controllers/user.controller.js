const User = require("../schema/user.schema");
const postData=require("../schema/post.schema");
module.exports.getUsersWithPostCount = async (req, res) => {
  try {
    //TODO: Implement this API
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
  
      const skip = (page - 1) * limit;
  
      const [users, totalDocs] = await Promise.all([
        User.aggregate([
          {
            $lookup: {
              from: 'posts', 
              localField: '_id',
              foreignField: 'userId',
              as: 'userPosts',
            },
          },
          {
            $project: {
              _id: 1,
              name: 1,
              posts: { $size: '$userPosts' },
            },
          },
        ])
          .skip(skip)
          .limit(limit),
        User.countDocuments(),
      ]);
  
      const totalPages = Math.ceil(totalDocs / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;
  
      res.json({
        data: {
          users,
          pagination: {
            totalDocs,
            limit,
            page,
            totalPages,
            pagingCounter: ((limit*(page-1))+1),
            hasNextPage,
            hasPrevPage,
            nextPage: hasNextPage ? page + 1 : null,
            prevPage: hasPrevPage ? page - 1 : null,
          },
        },
      });
      
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } catch (error) {
    res.send({ error: error.message });
  }
};
