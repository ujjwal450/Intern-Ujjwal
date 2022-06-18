const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/userAuth')

const router = new express.Router()

router.post('/user/login', async (req, res) => {
    const today = new Date(Date.now())
    try {
        const user = await User.findByCredentials(req.body.username, req.body.password)
        const token = await user.generateAuthToken()
        user.lastLogin = today
        await user.save()
        res.status(200).send({
            user,
            token
        })
    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.post('/user/logout', auth, async (req, res) => {

    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error.message)
    }
})

router.post('/user/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error.message)
    }
})

module.exports = router