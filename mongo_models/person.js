const mongoose = require('mongoose')
const Schema = mongoose.Schema

const url = process.env.MONGODB_URI

mongoose.set('strictQuery',false)

mongoose.connect(url)
  .then( () => console.log('Connected to MongoDB Atlas') )
  .catch( error => console.log('Error connecting to MongoDB Atlas: ', error.message) )

const personSchema = new Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: function(number) {
        return /^\d{2,3}-\d+$/.test(number)
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: true
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
