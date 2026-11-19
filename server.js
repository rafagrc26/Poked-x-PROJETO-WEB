const http = require('http')
const fs = require('fs')
const path = require('path')

const {
    LIMITE_BARALHO,
    listarBaralho,
    contarBaralho,
    cadastrarPokemonBaralho,
    deletarPokemonBaralho
} = require('./script_db.js')

const PORTA = process.env.PORT || 3002

const arquivos = {
    '/':{ arquivo: 'index.html', tipo: 'text/html; charset=utf-8' },
    '/index.html':{ arquivo: 'index.html', tipo: 'text/html; charset=utf-8' },
    '/style.css':{ arquivo: 'style.css',  tipo: 'text/css; charset=utf-8' },
    '/script.js':{ arquivo: 'script.js',  tipo: 'text/javascript; charset=utf-8' }
}

function responderJSON(res, status, dados) {
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' })
    res.end(JSON.stringify(dados))
}

function lerCorpo(req) {
    return new Promise((resolve, reject) => {
        let corpo = ''
        req.on('data', pedaco => corpo += pedaco)
        req.on('end', () => {
            try { resolve(JSON.parse(corpo || '{}')) }
            catch (erro) { reject(erro) }
        })
    })
}

const servidor = http.createServer(async (req, res) => {
    try {

        if (req.url === '/api/baralho' && req.method === 'GET') {
            const linhas = await listarBaralho()
            if (linhas === null) return responderJSON(res, 500, { erro: 'Falha ao consultar o banco' })
            return responderJSON(res, 200, linhas)
        }

        // POST /api/baralho
        if (req.url === '/api/baralho' && req.method === 'POST') {
            const d = await lerCorpo(req)
            if (!d.id || !d.nome || d.cp === undefined)
               return responderJSON(res, 400, { erro: 'id, nome e cp são obrigatórios' })

        if (await contarBaralho() >= LIMITE_BARALHO)
            return responderJSON(res, 400, { erro: `limite de ${LIMITE_BARALHO} atingido` })

            const salvo = await cadastrarPokemonBaralho(
                d.id, d.nome, d.imagem, d.cp, d.treinador, d.tipo1, d.tipo2
         )
        if (!salvo || salvo.length === 0)
            return responderJSON(res, 409, { erro: 'esse pokémon já está no baralho' })

            return responderJSON(res, 201, salvo[0])
        }


        const m = req.url.match(/^\/api\/baralho\/(\d+)$/)
        if (m && req.method === 'DELETE') {
            const removido = await deletarPokemonBaralho(Number(m[1]))
            if (!removido || removido.length === 0)
                return responderJSON(res, 404, { erro: 'não encontrado' })
            return responderJSON(res, 200, removido[0])
        }


        const rota = arquivos[req.url]
        if (rota) {
            res.writeHead(200, { 'Content-Type': rota.tipo })
            return fs.createReadStream(path.join(__dirname, rota.arquivo)).pipe(res)
        }

        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
        res.end('Página não encontrada')
    } catch (erro) {
        console.error('Erro na requisição:', erro)
        responderJSON(res, 500, { erro: 'erro interno' })
    }
})

servidor.listen(PORTA, () => {
    console.log(`Arena Pokemon em http://localhost:${PORTA}`)
})