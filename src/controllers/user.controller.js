const User = require("../schema/user.schema");

module.exports.getUsersWithPostCount = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    const skip = (page - 1) * limit;

    const [users, totalUserDocs] = await Promise.all([
      User.aggregate([
        {
          $lookup: {
            from: "posts",
            localField: "_id",
            foreignField: "userId",
            as: "post",
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            posts: { $size: "$post" },
          },
        },
      ])
        .skip(skip)
        .limit(limit),
      User.countDocuments(),
    ]);

    const totalPages = Math.ceil(totalUserDocs / limit);
    const hasPrevPage = page > 1 ? true : false;
    const hasNextPage = page < totalPages ? true : false;

    const pagination = {
      totalDocs: totalUserDocs,
      limit: limit,
      page: page,
      totalPages: totalPages,
      pagingCounter: page > 1 ? limit * (page - 1) + 1 : 1,
      hasPrevPage: hasPrevPage,
      hasNextPage: hasNextPage,
      prevPage: hasPrevPage ? page - 1 : null,
      nextPage: hasNextPage ? parseInt(page) + 1 : null,
    };

    res.status(200).json({ data: { users, pagination } });
  } catch (error) {
    res.send({ error: error.message });
  }
};
