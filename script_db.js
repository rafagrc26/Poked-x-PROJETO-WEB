    require('dotenv').config({quiet:true})

    const DATABASE_URL = process.env.DATABASE_URL
    const host = new URL(DATABASE_URL).hostname
    const neonHttpEndPoint = `http://${host}/sql`

    const LIMITE_BARALHO = 12 // CARTAS

    async function executarQueryNeon(querySQL, parametros=[]) {
        try{
            const resposta = await fetch(neonHttpEndPoint, {
                method: 'POST',
                headers :{
                    'Neon-Connection-String':DATABASE_URL,
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    query:querySQL,
                    params:parametros
                })
            })
            if(!resposta.ok) {
                const erroTexto = await resposta.text() 
                throw new Error(`Erro HTTP ${resposta.status}:${erroTexto}`)
            }
            const dados = await resposta.json()
            return dados.rows
        }
        catch(erro) {
            console.log('Falha ao comunicar com o banco de dados', erro)
            return null
        }
    }

    //cadastrar pokemon
async function cadastrarPokemonBaralho(idPokemon, nome, imagem, cp, treinador, tipo1, tipo2) {
    return executarQueryNeon(
        `INSERT INTO baralho (id_pokemon, nome, imagem, cp, treinador, tipo1, tipo2)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id_pokemon) DO NOTHING
         RETURNING *`,
        [idPokemon, nome, imagem, cp, treinador, tipo1 || null, tipo2 || null]
    )
}
    // consultar baralho
async function listarBaralho(params) {
    return executarQueryNeon(
        "SELECT * FROM baralho ORDER BY id_pokemon"
    )
}
    // deletar pokemon
    async function deletarPokemonBaralho(idPokemon) {
    return executarQueryNeon(
        'DELETE FROM baralho WHERE id_pokemon = $1 RETURNING *',
        [idPokemon]
    )
}

//MEU/IA CODIGO

// contar quantos pokémons estão no baralho
async function contarBaralho() {
    const linhas = await executarQueryNeon('SELECT COUNT(*)::int AS total FROM baralho')
    if (!linhas || linhas.length === 0) return 0
    return linhas[0].total
}

// deletar pokémon do baralho
async function deletarPokemonBaralho(idPokemon) {
    return await executarQueryNeon(
        'DELETE FROM baralho WHERE id_pokemon = $1 RETURNING *',
        [idPokemon]
    )
}