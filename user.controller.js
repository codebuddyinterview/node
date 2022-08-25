const User = require('../schema/user.schema');

module.exports.getUsersWithPostCount = async (req, res) => {
    try {
        //TODO: Implement this API
        let {page,size} = req.query;
        
        if(!page)
        {
            page = 1;
        }
        if(!size)
        {
            size = 10;
        }
        const parsedPage = parseInt(page);
        const limit = parseInt(size);
        const skip = (parsedPage-1 ) * size;
         
       const count = await User.find().count();
       let totalPages = count/limit;
       const pagingCounter = parsedPage;     
       const hasPrevPage = (parsedPage != 1)? true:false;
       const hasNextPage = (parsedPage != totalPages)? true:false;
       const prevPage = (parsedPage ==1)? null:parsedPage-1;
       const nextPage = (parsedPage != totalPages)? parsedPage+1:null;
       const pagination = {
           "totalDocs": count,
           "limit":limit,
           "page":parsedPage,
           "totalPages":totalPages,
           "pagingCounter": pagingCounter,
            "hasPrevPage": hasPrevPage,
            "hasNextPage": hasNextPage,
            "prevPage": prevPage,
            "nextPage": nextPage
       }
       const reslt = await User.find().limit(limit).skip(skip)
        res.status(200).json({
            data:{"users":reslt},
            pagination
        })
    } catch (error) {
        res.send({error: error.message});
    }
}