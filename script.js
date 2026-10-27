const form = document.querySelector('#form-pokemon');
const feedback = document.querySelector('#feedback');
const listaCards = document.querySelector('#lista-card')
const electric = document.querySelector('#electric')
const inputNome = document.querySelector('#nome')



const dadomokado = {
    name: 'pikachu',
    base_experience: 112,
    types: [
    { slot: 1, type: { name: 'electric' } }
],
    sprites: {
        front_default: './pikachu.png',
        other: {
            'officcial-artwork': {
                front_default: './pikachu.png'
            }
        }
    }

}

let requisicaoAtual = 0
let debounceBusca

console.log('script')
const URL_POKEAPI = 'https://pokeapi.co/api/v2/pokemon'

async function buscarDadosPokemon(nome) {
    const nomeFormatado = nome.toLowerCase().trim()

    try {
        const resposta = await fetch(`${URL_POKEAPI}/${nomeFormatado}`)

        if (!resposta.ok) {
            throw new Error('Pokemon não encontrado na PokeAPI')
        }

    const dados = await resposta.json();
        return dados;
    } catch (error) {
        console.log(" ❌ Não foi possivel carregar os dados do pokemon solicitado na PokeDEX",error)
        return [];
    }
}

function extrairImagemPokemon(dadosPokemon) {

    if(!dadosPokemon) {
        console.log("Dados Vazios")
        return null
    }

    
    const artWorkOfficial = dadosPokemon.sprites?.other?.['official-artwork']?.front_default//const artWorkOfficial = buscarDadosPokemon.sprites?.other?.['official-artwork']?.front_default //buscarDadosPokemon
    const spriteDefault   = dadosPokemon.sprites?.front_default//const spriteDefault = buscarDadosPokemon.sprites?.front_default //buscarDadosPokemon
    console.log(dadosPokemon.sprites)

    console.log(artWorkOfficial)  // → undefined
    console.log(spriteDefault)    // → undefined

    return artWorkOfficial || spriteDefault || null
}

function extrairTipoPokemon(dadosPokemon) {
    if (!dadosPokemon || dadosPokemon.types)
        return 'desconhecido'
    return dados.types.map(tipo => tipo.type.name).join(', ');
}
function extrairCombatPower(dadosPokemon) {
    if (!dadosPokemon || !dadosPokemon.base_experience) return 0
    return dadosPokemon.base_experience
}
/*function extrairCombatPower(dadosPokemon) {
    if(!dadosPokemon || dadosPokemon.base_experience) {
        console.log("Dados Vazios")
        return 0
    }
    return dadosPokemon.base_experience //return xp = dadosPokemon.base_experience
}*/

function criarCardPokemon(nome, imagem, tipo, combatPower, treinador //= 'none'
    ) {
    const card = document.createElement('div')
    card.className = 'card-pokemon'

    const img = document.createElement('img')
    img.className = 'card-pokemon-img'
    img.src = imagem || 'https://placehold.co/96x96?text=?'
    img.alt = nome

    const nomeCard = document.createElement('h3')
    nomeCard.className = 'card-pokemon-nome'
    nomeCard.textContent = nome

    const infoTipo = document.createElement('p')
    infoTipo.className = 'card-pokemon-info'
    infoTipo.textContent = `Tipo: ${tipo || 'desconhecido'}`//infoTipo.textContent = `Tipo: ${tipo || 'desconhecido'}`
    infoTipo.textContent;

    const cp = document.createElement('p')
    cp.className = 'card-pokemon-info'
    cp.textContent = `cp:${combatPower|| '000'}`

    //exercicio 1
    treinador = treinador!=null? treinador: "Sem treinador"
    const treinadorName = document.createElement('p')
    treinadorName.className = 'card-pokemon-info'
    treinadorName.textContent = `Treinador:${treinador}`

    card.append(img,nomeCard,infoTipo,cp,treinadorName)

    listaCards.appendChild(card)

    console.log(card, img, nomeCard)

}

form.addEventListener('submit',
    async function(event)
    {
        event.preventDefault(); // Impedindo de recarregar a pagina

    const nome = document.querySelector('#nome').value.trim();
    const treinador = document.querySelector('#treinador').value/*trim*/.trim();

    if (nome.length < 3) {
            console.log("O campo precisa de ter no minimo 3 letra")

            feedback.textContent = "❌ Nome deve conter ao minimo 3 caracteres"
            feedback.style.color = 'red'
            return;
        }
        else if(cp < 100) {
            feedback.textContent = "O poder do pokemon deve ser maior de 100"
            feedback.style.color = 'red'
            return;

        }
        else {
            feedback.textContent = " ✅ Pokemon cadastrado"
            feedback.style.color = 'green'
        }
        const dadosApi = await buscarDadosPokemon(nome)
        console.log("Dados do pokemon")
        console.log(dadosApi)
        LimparCampos()
    }
)

function LimparCampos() {
    document.querySelector('#treinador').value = '';
    document.querySelector('#nome').value = '';
    document.querySelector('#tipo').value = '';
    document.querySelector('#cp').value = '';
}

inputNome.addEventListener('input', 
    function() {

        console.log(inputNome.value) // erro

        const valor = inputNome.value.trim() //const valor = nome.value.trim().length
        if(valor < 3){
            feedback.textContent = " ❌ Nome do pokemon deve conter mais que 3 caractéres"
            feedback.style.color = 'red'
        } else {
           feedback.textContent = ""
           const idRequisicao = requisicaoAtual
            
        debounceBusca = setTimeout(async function() {
        //console.log(nome.value);
        const dadosApi =  await buscarDadosPokemon(valor) //nome.value
        if(idRequisicao!=requisicaoAtual){
            return
        }
        if(!dadosApi) {
            return;
        }
        const imagemURL = extrairImagemPokemon(dadosApi)
        const tipoPokemon = extrairTipoPokemon(dadosApi)
        const combatPower = extrairCombatPower(dadosApi)
        criarCardPokemon(valor, imagemURL, tipoPokemon, combatPower)

        const nome = document.querySelector("#nome")
        const imagem = document.querySelector("#imagem")
        const tipo = document.querySelector('#tipo')
        const cp = Number(document.querySelector('#cp'))

        tipo.value = tipoPokemon
        cp.value = combatPower

        console.log("passou");
    }, 1000)
}
    },
    function aplicarEstiloPorTipo(card, tipo) {
        const estiloCard = [
            {tipo: `fire`, borda:'#25822', fundo:'#ffe3d6'},
            {tipo: `fire`, borda:'#25822', fundo:'#ffe3d6'},
            {tipo: `fire`, borda:'#25822', fundo:'#ffe3d6'},
            {tipo: `fire`, borda:'#25822', fundo:'#ffe3d6'},
            {tipo: `fire`, borda:'#25822', fundo:'#ffe3d6'},
            {tipo: `fire`, borda:'#25822', fundo:'#ffe3d6'},
        ]

        let tipo1 = tipo.length>0? tipo[0]:tipo
        let tipo2 = tipo.length>0? tipo[1]:null
        let cor_1
        let cor_2

        for(let i = 0; i < estiloCard.length; i++) {
            if(tipo == estiloCard[i].tipo) {
            card.style.backgroundColor = estiloCard[i].fundo
            card.style.borderColor = estiloCard[i].borda
            
        } else {
            card.style.backgroundColor
            }
        }
    }
);
