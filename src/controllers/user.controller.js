const Post = require("../schema/post.schema");
const pagination = {
  "totalDocs": 0,
  "limit": 10,
  "page": 0,
  "totalPages": 0,
  "pagingCounter": 0,
  "hasPrevPage": false,
  "hasNextPage": false,
  "prevPage": null,
  "nextPage": 0
}
const response = {
  "data": [],
  "pagination": {
    "totalDocs": 0,
    "limit": 10,
    "page": 0,
    "totalPages": 0,
    "pagingCounter": 0,
    "hasPrevPage": false,
    "hasNextPage": false,
    "prevPage": null,
    "nextPage": 0
  }
}
module.exports.getUsersWithPostCount = async (req, res) => {
  try {
    //TODO: Implement this API
    const page = req.query['page'] ? parseInt(req.query['page']) : 1;
    const limit = req.query['limit'] ? parseInt(req.query['limit']) : 10;
    response['data'] = await getUsersPosts(page, limit)
    response['pagination']['totalDocs'] = await getTotalRecords();
    response['pagination']['page'] = page;
    response['pagination']['limit'] = limit;
    response['pagination']['totalPages'] = Math.ceil(response['pagination']['totalDocs'] / limit);
    response['pagination']['pagingCounter'] = page;
    response['pagination']['hasPrevPage'] = page > 1 ? true : false;
    response['pagination']['hasNextPage'] = page < response['pagination']['totalPages'] ? true : false;
    response['pagination']['prevPage'] = page > 1 ? page - 1 : null;
    response['pagination']['nextPage'] = page < response['pagination']['totalPages'] ? page + 1 : null;
    res.status(200).json(response);
  } catch (error) {
    res.send({ error: error.message });
  }
};

async function getTotalRecords() {
  const total_docs = await Post.aggregate([
    {
      $group: {
        _id: "$userId",
        sum: { $sum: 1 }
      }
    },
    {
      $lookup: {
        "from": "users",
        "localField": "_id",
        "foreignField": "_id",
        "as": "users"
      }
    }
  ]).unwind('users').project({
    _id: "$users._id",
    name: "$users.name",
    posts: "$sum"

  }).count("id");
  return total_docs[0]['id']
}

async function getUsersPosts(page, limit) {
  return await Post.aggregate([
    {
      $group: {
        _id: "$userId",
        sum: { $sum: 1 }
      }
    },
    {
      $lookup: {
        "from": "users",
        "localField": "_id",
        "foreignField": "_id",
        "as": "users"
      }
    }
  ]).unwind('users').project({
    _id: "$users._id",
    name: "$users.name",
    posts: "$sum"

  }).skip((page - 1) * limit).limit(limit);

}