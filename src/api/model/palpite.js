const mongoose = require('mongoose')

const palpiteSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.ObjectId,
		required: true
	},
	partida: {
		type: mongoose.Schema.ObjectId,
		required: true
	},
	placarTimeA: {
		type: Number,
		required: true
	},
	placarTimeB: {
		type: Number,
		required: true
	},
	resultadoPartida: {
		type: String,
		required: true
	}
})

module.exports = mongoose.model('palpite', palpiteSchema)