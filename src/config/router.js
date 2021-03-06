const express = require('express')
const { authService, faseService, palpiteService, partidaService, timeService, userService } = require('../api')

/*
 * Rotas abertas
 */
const oapi = express.Router()
oapi.post('/login', authService.login)
oapi.post('/signup', authService.signup)
oapi.post('/validateToken', authService.validateToken)
oapi.post('/registerfacebookuser', authService.registerFacebookUser)
oapi.get('/avatar/:id', authService.retrieveAvatar)

/**
 * Rotas seguras
 */
const api = express.Router()
api.use(authService.auth)
api.use('/fase', faseService)
api.use('/palpite', palpiteService)
api.use('/partida', partidaService)
api.use('/time', timeService)
api.use('/user', userService)

module.exports = { api, oapi }