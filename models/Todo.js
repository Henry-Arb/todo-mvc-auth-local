const mongoose = require('mongoose')

const TodoSchema = new mongoose.Schema({
  todo: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    required: true,
  },
  userId: {
    type: String,
    required: true
  },
  sessionCount: {
    type: Number,
    default: 0
  },

  duration: {
    type: Number,
    default: 0
  },

  Date: {
    type: Date,
    default: new Date()
  }
  
})

module.exports = mongoose.model('Todo', TodoSchema)
