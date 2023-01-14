const express = require('express')
const router = express.Router()

const {signup, signin, googleSignIn} = require('../controllers/user')

router.post('/signup', signup)
router.post('/signin', signin)
router.post('/googleSignIn', googleSignIn)


module.exports= router