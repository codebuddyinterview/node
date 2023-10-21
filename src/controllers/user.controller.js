const User = require("../schema/user.schema");

module.exports.getUsersWithPostCount = async (req, res) => {
  const defaultPage = 1;
  const defaultLimit = 10;
  const page = parseInt(req.query.page) || defaultPage;
  const limit = parseInt(req.query.limit) || defaultLimit;
  const includePosts = req.query.posts === 'true';
  console.log('page',page,' limit',limit);
  console.log('inside getUser with post count');
  try {
    // Use the aggregation framework to retrieve users with post counts
    const users = await User.aggregate([
      {
        $facet: {
          users: [
            { $skip: (page - 1) * limit },
            { $limit: limit },
            {
              $addFields: {
                posts: includePosts ? '$posts' : null, // Include the "posts" field conditionally
              },
            },
            {
              $project: {
                _id: 1,
                name: 1,
                posts: 1,
              },
            },
          ],
          metadata: [
            {
              $group: {
                _id: null,
                totalDocs: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                totalDocs: 1,
                limit: limit,
                page: page,
                totalPages: {
                  $ceil: { $divide: ['$totalDocs', limit] },
                },
              },
            },
          ],
        },
      },
    ]);
    
    // Extract metadata for pagination
    const metadata = users[0].metadata[0];
    metadata.limit = limit;
    metadata.page = page;
    
    // Calculate the total number of pages
    const totalPages = Math.ceil(metadata.totalDocs / limit);
    
    // Determine prevPage and nextPage
    let prevPage = page - 1;
    let nextPage = page + 1;

    // Calculate the pagingCounter
    const pagingCounter = (page - 1) * limit + 1;

    // Add pagingCounter to metadata
    metadata.pagingCounter = pagingCounter;

    
    // Calculate hasPrevPage and hasNextPage
    const hasPrevPage = prevPage >= 1;
    const hasNextPage = nextPage <= totalPages;

    // Add hasPrevPage and hasNextPage to metadata
    metadata.hasPrevPage = hasPrevPage;
    metadata.hasNextPage = hasNextPage;
    
    // Adjust prevPage and nextPage for edge cases
    if (prevPage < 1) {
      prevPage = null;
    }
    if (nextPage > totalPages) {
      nextPage = null;
    }
    
    // Update the metadata with prevPage, nextPage, and corrected totalPages
    metadata.prevPage = prevPage;
    metadata.nextPage = nextPage;
    metadata.totalPages = totalPages;
    
    // Send the result as JSON response
    res.status(200).send({
      data: {
        users: users[0].users, // The users array
        pagination: metadata, // The metadata object with prevPage and nextPage
      },
    });
  }
   catch (error) {
    // Handle errors appropriately
    // res.status(500).send('Internal Server Error',error);
    console.log(error)
  }

};
