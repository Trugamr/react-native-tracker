require('dotenv').config()
const express = require('express')
const mongooose = require('mongoose')
const bodyParser = require('body-parser')
const authRouter = require('./routes/authRoutes')
const requireAuth = require('./middlewares/requireAuth')

const { PORT = 4000, DB_URL, DB_USER, DB_PASS } = process.env

const app = express()

mongooose.connect(DB_URL, {
  user: DB_USER,
  pass: DB_PASS,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
  useNewUrlParser: true,
})

mongooose.connection.on('connected', () => console.log(`DB Connection SUCCESS`))
mongooose.connection.on('error', error =>
  console.error('DB Connection ERROR', error),
)

// Middlewares
app.use(bodyParser.json())

// Routes
app.use('/auth', authRouter)

app.listen(PORT, () => {
  console.log(`🌊🌸 listening on ${PORT}`)
})
