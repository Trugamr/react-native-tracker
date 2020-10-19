require('dotenv').config()
const express = require('express')
const mongooose = require('mongoose')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const authRouter = require('./routes/authRoutes')
const trackRouter = require('./routes/trackRoutes')

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
app.use(morgan('tiny'))
app.use(bodyParser.json())

// Routes
app.use('/auth', authRouter)
app.use('/track', trackRouter)

app.listen(PORT, () => {
  console.log(`🌊🌸 listening on ${PORT}`)
})
