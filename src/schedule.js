const schedule = require('node-schedule')
const moment = require('moment')
const { JSDOM } = require('jsdom')
const Partida = require('./api/model/partida')
const atualizarResultados = require('./api/service/resultadoService')

schedule.scheduleJob('*/1 9-17 * * *', async () => {
	console.log('chegou aqui')
	try {
		const dom = await JSDOM.fromURL('https://globoesporte.globo.com/placar-ge/hoje/jogos.ghtml')
		console.log('O parse do dom funcionou!!!')
		const date = moment().subtract(3, 'hours').toDate()
		console.log('Data atual: ', date)
		const partidas = await Partida.find({ data: { $lt: date } }).sort({ order: 'asc' })
		console.log(`Achou ${partidas.length} partidas`)
		const doc = dom.window.document;
		const jogos = doc.getElementsByClassName('card-jogo')
		console.log(`Acho ${jogos.length} jogos`)
		for (let i = 0; i < jogos.length; i++) {
			const jogo = jogos.item(i)
			const nomeJogo = jogo.getElementsByClassName('titulo').item(0).firstElementChild.innerHTML
			const horarioJogo = jogo.getElementsByClassName('titulo').item(0).lastElementChild.getAttribute('datetime')
			if (nomeJogo == 'Copa do Mundo da FIFA™') {
				const timeA = jogo.getElementsByClassName('mandante').item(0).getElementsByClassName('nome-completo').item(0).innerHTML
				const timeB = jogo.getElementsByClassName('visitante').item(0).getElementsByClassName('nome-completo').item(0).innerHTML
				console.log(`Acho jogo ${timeA} x ${timeB}`)
				const resultado = jogo.getElementsByClassName('resultado').item(0)
				if (resultado.childElementCount > 1) {
					const placarTimeA = resultado.getElementsByClassName('placar-mandante').item(0).innerHTML
					const placarTimeB = resultado.getElementsByClassName('placar-visitante').item(0).innerHTML
					console.log(`Acho jogo com placar ${moment(horarioJogo, 'YYYY-MM-DDThh:mm:ss')} ${timeA} ${placarTimeA} x ${placarTimeB} ${timeB}`)
					if (placarTimeA >= 0 && placarTimeB >= 0) {
						console.log('Procurando partida')
						const partida = partidas.find(partida => {
							console.log(`Testando partida ${moment(partida.data, 'YYYY-MM-DDThh:mm:ss').add(3, 'hours')} ${partida.timeA.nome} x ${partida.timeB.nome}`)
							return partida.timeA.nome == timeA &&
									partida.timeB.nome == timeB &&
									moment(partida.data, 'YYYY-MM-DDThh:mm:ss').add(3, 'hours').isSame(moment(horarioJogo, 'YYYY-MM-DDThh:mm:ss'))
						})
						if (partida != null) {
							console.log(`Achou partida ${partida.timeA.nome} ${partida.placarTimeA} x ${partida.placarTimeB} ${partida.timeB.nome}`)
							if (partida.placarTimeA != placarTimeA || partida.placarTimeB != placarTimeB) {
								console.log('Achou partida com placar desatualizado')
								const newPartida = await atualizarResultados(partida._id, { placarTimeA, placarTimeB })
								console.log(`Partida: ${newPartida._id} - ${newPartida.timeA.nome} ${newPartida.placarTimeA} x ${newPartida.placarTimeB} ${newPartida.timeB.nome}`)
							}
						}
					}	
				}
			}
		}
		console.log('finalizou a atualização dos resultados')
	} catch(err) {
		console.log(err)
	}
});