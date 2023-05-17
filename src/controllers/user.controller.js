const User = require("../schema/user.schema");

module.exports.getUsersWithPostCount = async (req, res) => {
  try {
    let limit = parseInt(req?.query?.limit) || 10;
    let page = parseInt(req?.query?.page) || 1;
    let skip = limit * (page - 1);
    let users = await User.aggregate([
      { $lookup: { from: "posts", localField: "_id", foreignField: "userId", as: "R" } },
      {
        $project: {
          _id: "$_id",
          name: "$name",
          posts: { $size: "$R" },
        },
      },
    ])
      .skip(skip)
      .limit(limit);
    let totalCount = await User.find({}).count();

    let hasPrevPage = page > 1 ? true : false;
    let hasNextPage = page < Math.ceil(totalCount / limit) ? true : false;

    let pagination = {
      totalDocs: totalCount,
      limit: limit,
      page: page,
      totalPages: Math.ceil(totalCount / limit),
      pagingCounter: page > 1 ? limit * (page - 1) + 1 : 1,
      hasPrevPage: hasPrevPage,
      hasNextPage: hasNextPage,
      prevPage: hasPrevPage ? page - 1 : null,
      nextPage: hasNextPage ? parseInt(page) + 1 : null,
    };

    return res.status(200).json({ data: { users, pagination } });
  } catch (error) {
    res.send({ error: error.message });
  }
};
