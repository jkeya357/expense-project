const mongoose = require('mongoose')

const dbConfig = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECT)
        console.log("DB CONNECTED SUCCESSFULLY !!")
    } catch (error) {
        console.log("Error connecting to the DB", error)
    }
}

module.exports = dbConfig