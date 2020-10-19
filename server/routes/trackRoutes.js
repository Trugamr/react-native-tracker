const { Router } = require('express')
const requireAuth = require('../middlewares/requireAuth')
const Track = require('../models/Track')

const router = Router()

// Middlewares
router.use(requireAuth)

router.get('/', async (req, res) => {
  const { _id: userId } = req.user
  const tracks = await Track.find({ userId })

  res.json(tracks)
})

router.post('/', async (req, res) => {
  const { name, locations } = req.body
  const { _id: userId } = req.user

  if (!name || !locations)
    return res.status(422).json({
      success: false,
      error: 'You must provide name and locations',
    })

  const track = new Track({ name, userId, locations })
  try {
    await track.save()
  } catch (err) {
    return res.status(422).json({
      success: false,
      error: err.message,
    })
  }

  res.json(track)
})

module.exports = router
