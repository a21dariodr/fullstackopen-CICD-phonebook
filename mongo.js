const mongoose = require('mongoose')
const Schema = mongoose.Schema

if (process.argv.length < 3) {
  console.log('A password as an argument is needed')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://admin:${password}@cluster0.vo0y1ph.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  Person.find({})
    .then( data => {
      console.log('phonebook:')
      data.forEach(person => console.log(person.name + ' ' + person.number))
      mongoose.connection.close()
    })
} else if (process.argv.length === 5) {
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({ name, number })

  person.save(person)
    .then( () => {
      console.log('added ' + name + ' number ' + number + ' to phonebook')
      mongoose.connection.close()
    })
}
