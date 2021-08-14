const Database = require('../config/mongoDB.js')
const DB = Database.get('Users')

module.exports = {
    insert: async (user) => {
        return await DB.insertOne(user)
    },
    all: async () => {
        return await DB.find({}, { projection: {} }).toArray()
    },
    search: {
        name: async (name) => {
            return await DB.find({ Nome: { $regex: name } }, { projection: {}}).toArray()
        },
        _id: async (_id) => {
            return await DB.findOne({ _id: _id }, { projection: { _id: 0 } })
        }
    }
}