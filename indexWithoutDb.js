/* eslint-disable no-unused-vars */
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(express.static('dist'))
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postdata'))

morgan.token('postdata', (req, res) => (req.method === 'POST') ? JSON.stringify(req.body) : '')

let persons = [
  {
    'id': 1,
    'name': 'Arto Hellas',
    'number': '040-123456'
  },
  {
    'id': 2,
    'name': 'Ada Lovelace',
    'number': '39-44-5323523'
  },
  {
    'id': 3,
    'name': 'Dan Abramov',
    'number': '12-43-234345'
  },
  {
    'id': 4,
    'name': 'Mary Poppendieck',
    'number': '39-23-6423122'
  }
]

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)
  if (person) res.json(person)
  else res.status(404).send('Person not found!')
})

app.get('/info', (req, res) => {
  const now = new Date()
  res.send(`Phonebook has info for ${persons.length} people<br/><br/>${now.toString()}`)
})

app.post('/api/persons', (req, res) => {
  const id = Math.floor(Math.random() * 100000000000000)
  const person = req.body

  if (!person.name) return res.status(400).json({ error: 'Missing person name!' })
  if (!person.number) return res.status(400).json({ error: 'Missing person number!' })

  let repeatedPerson = persons.find(p => p.name === person.name)
  if (repeatedPerson) return res.status(400).json({ error: 'Person name must be unique!' })

  const newPerson = {
    id,
    'name': person.name,
    'number': person.number
  }
  persons.push(newPerson)

  res.json(newPerson)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(p => p.id !== id)
  res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log('Server running on port ', PORT)
})
