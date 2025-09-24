const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fullname:{
        require: true,
        type: String
    },
    email:{
        required: true,
        type: String
    },
    icon:{
        type: String,
        required: false
    },
    password:{
        required: true,
        type: String,
    }
})

module.exports = mongoose.model('User', userSchema)