const express = require('express')
const router = express.Router()
const { createTour, getTours, getTour, getToursByUser, deleteTour, updateTour, getToursBySearch, getToursByTag, getRelatedTours, likeTour } = require('../controllers/tour')
const auth = require('../middleware/auth')

router.post('/', auth, createTour)
router.get('/search', getToursBySearch)
router.get('/tag/:tag', getToursByTag)
router.post('/relatedTours', getRelatedTours)
router.get('/', getTours)
router.get('/:id', getTour)
router.get("/userTours/:id", auth, getToursByUser)
router.delete('/:id', auth, deleteTour)
router.patch('/:id', auth, updateTour)
router.patch("/like/:id", auth, likeTour)

module.exports = router