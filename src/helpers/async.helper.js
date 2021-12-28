module.exports.asyncForEach = async (array, callback) => {
    let data = {};
    for (let index = 0; index < array.length; index++) {
        data[index] = await callback(array[index], index, array);
    }

    return data;
};