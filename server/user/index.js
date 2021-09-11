const { getUserModel } = require("../mongoClient")

exports.getUsers = async ({ page, step }) => {
    const userModel = getUserModel()
    userModel.find({}, null, {skip: step * page, }, (err, docs) => {
        console.log(docs)
      })
}