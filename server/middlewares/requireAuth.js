const jwt = require('jsonwebtoken')
const User = require('../models/User')

const { JWT_SECRET } = process.env

module.exports = (req, res, next) => {
  const { authorization } = req.headers
  if (!authorization)
    return res.status(401).json({
      success: false,
      error: 'You must be logged in',
    })

  const token = authorization.replace('Bearer ', '')
  jwt.verify(token, JWT_SECRET, async (err, payload) => {
    if (err)
      return res.status(401).json({
        success: false,
        error: 'You must be logged in',
      })

    const { userId } = payload
    try {
      const user = await User.findById(userId)
      req.user = user
      next()
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: 'Something went wrong',
      })
    }
  })
}
