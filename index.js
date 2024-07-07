/* eslint-disable no-unused-vars */
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./mongo_models/person')
const app = express()

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postdata'))

morgan.token('postdata', (req, res) => (req.method === 'POST') ? JSON.stringify(req.body) : '')

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then( people => {
      if (people) res.json(people)
      else res.status(404).end()
    })
    .catch( error => next(error) )
})

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id

  Person.findById(id)
    .then( person => {
      if (person) res.json(person)
      else res.status(404).send('Person not found!')
    })
    .catch( error => next(error) )
})

app.get('/info', (req, res, next) => {
  const now = new Date()

  Person.countDocuments()
    .then(count => {
      res.send(`Phonebook has info for ${count} people<br/><br/>${now.toString()}`)
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body

  if (!name) return res.status(400).json({ error: 'Missing person name!' })
  if (!number) return res.status(400).json({ error: 'Missing person number!' })

  const person = new Person({ name, number })

  person.save()
    .then( newPerson => {
      res.json(newPerson)
    })
    .catch( error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  const { name, number } = req.body

  if (!number) return res.status(400).json({ error: 'Missing person number!' })

  Person.findByIdAndUpdate(id, { name, number }, { new: true, runValidators: true, context: 'query' })
    .then( updatedPerson => res.json(updatedPerson))
    .catch( error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id

  Person.deleteOne({ id })
    .then( () => {
      res.status(204).end()
    })
    .catch( error => next(error))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'Unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.log(error)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'Incorrect id format' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log('Server running on port ', PORT)
})
