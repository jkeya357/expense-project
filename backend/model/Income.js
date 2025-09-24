const mongoose = require('mongoose')

const incomeSchema = mongoose.Schema({

    user:{
    type:mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
    },
    icon:{
        type: String,
        required: false
    },
    category:{
        type: String,
        required: true
    },
    amount:{
        type: Number,
        required: true
    },
    date:{
        type: Date,
        required: false,
        default: Date.now
    }
    
},{ timestamps: true })

module.exports = mongoose.model('Income', incomeSchema)