const { Router } = require('express')
const router = Router()
const User = require('../models/User')
const jwt = require('jsonwebtoken')

const { JWT_SECRET } = process.env

router.post('/signup', async (req, res) => {
  const { email, password } = req.body

  const user = new User({ email, password })

  try {
    await user.save()
    const token = jwt.sign({ userId: user.id }, JWT_SECRET)

    res.json({
      success: true,
      token,
    })
  } catch (error) {
    console.log('ERROR SAVING USER')
    if (error.code === 11000)
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists',
      })

    return res.status(422).json({
      success: false,
      error: 'Something went wrong',
    })
  }
})

router.post('/signin', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(422).json({
      success: false,
      error: 'Must provide email and password',
    })
  }
  const user = await User.findOne({ email })
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found',
    })
  }

  try {
    await user.comparePassword(password)
    const token = jwt.sign({ userId: user.id }, JWT_SECRET)

    res.json({
      success: true,
      token,
    })
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Invalid password or email',
    })
  }
})

module.exports = router
