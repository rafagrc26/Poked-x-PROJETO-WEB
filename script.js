const form = document.querySelector('#form-pokemon');
const feedback = document.querySelector('#feedback');
const listaCards = document.querySelector('#lista-card');
const inputNome = document.querySelector('#nome');

let requisicaoAtual = 0;
let debounceBusca;

console.log('script');
const URL_POKEAPI = 'https://pokeapi.co/api/v2/pokemon';

async function buscarDadosPokemon(nome) {
    const nomeFormatado = nome.toLowerCase().trim();

    try {
        const resposta = await fetch(`${URL_POKEAPI}/${nomeFormatado}`);

        if (!resposta.ok) {
            throw new Error('Pokemon não encontrado na PokeAPI');
        }

        const dados = await resposta.json();
        return dados;
    } catch (error) {
        console.log("❌ Não foi possível carregar os dados do pokémon solicitado na PokéDEX", error);
        return null;
    }
}

function extrairImagemPokemon(dadosPokemon) {
    if (!dadosPokemon) {
        console.log("Dados Vazios");
        return null;
    }
    
    const artWorkOfficial = dadosPokemon.sprites?.other?.['official-artwork']?.front_default;
    const spriteDefault   = dadosPokemon.sprites?.front_default;

    return artWorkOfficial || spriteDefault || null;
}

function extrairTipoPokemon(dadosPokemon) {
    if (!dadosPokemon || !dadosPokemon.types) return 'desconhecido';
    return dadosPokemon.types.map(tipo => tipo.type.name).join(', ');
}

function extrairCombatPower(dadosPokemon) {
    if (!dadosPokemon || !dadosPokemon.base_experience) return 0;
    return dadosPokemon.base_experience;
}

function criarCardPokemon(nome, imagem, tipo, combatPower, treinador) {
    const card = document.createElement('div');
    card.className = 'card-pokemon';

    const img = document.createElement('img');
    img.className = 'card-pokemon-img';
    img.src = imagem || 'https://placehold.co/96x96?text=?';
    img.alt = nome;

    const nomeCard = document.createElement('h3');
    nomeCard.className = 'card-pokemon-nome';
    nomeCard.textContent = nome;

    const infoTipo = document.createElement('p');
    infoTipo.className = 'card-pokemon-info';
    infoTipo.textContent = `Tipo: ${tipo || 'desconhecido'}`;

    const cp = document.createElement('p');
    cp.className = 'card-pokemon-info';
    cp.textContent = `CP: ${combatPower || '000'}`;

    treinador = treinador != null && treinador !== "" ? treinador : "Sem treinador";
    const treinadorName = document.createElement('p');
    treinadorName.className = 'card-pokemon-info';
    treinadorName.textContent = `Treinador: ${treinador}`;

    card.append(img, nomeCard, infoTipo, cp, treinadorName);
    listaCards.appendChild(card);
}

form.addEventListener('submit', async function(event) {
    event.preventDefault();

    const nome = document.querySelector('#nome').value.trim();
    const treinador = document.querySelector('#treinador').value.trim();
    const cp = Number(document.querySelector('#cp').value);

    if (nome.length < 3) {
        feedback.textContent = "❌ Nome deve conter ao menos 3 caracteres";
        feedback.style.color = 'red';
        return;
    } else if (cp < 100) {
        feedback.textContent = "❌ O poder do pokémon deve ser maior que 100";
        feedback.style.color = 'red';
        return;
    } else {
        feedback.textContent = "✅ Pokémon cadastrado com sucesso!";
        feedback.style.color = 'green';
    }

    const dadosApi = await buscarDadosPokemon(nome);
    if (dadosApi) {
        const imagemURL = extrairImagemPokemon(dadosApi);
        const tipoPokemon = extrairTipoPokemon(dadosApi);
        const combatPower = extrairCombatPower(dadosApi);
        criarCardPokemon(nome, imagemURL, tipoPokemon, combatPower, treinador);
    }
    
    LimparCampos();
});

function LimparCampos() {
    document.querySelector('#treinador').value = '';
    document.querySelector('#nome').value = '';
    document.querySelector('#tipo').value = '';
    document.querySelector('#cp').value = '';
}

inputNome.addEventListener('input', function() {
    const valor = inputNome.value.trim();
    
    if (valor.length < 3) {
        feedback.textContent = "❌ Nome do pokémon deve conter mais que 3 caracteres";
        feedback.style.color = 'red';
        return;
    } else {
        feedback.textContent = "";
        const idRequisicao = ++requisicaoAtual;
            
        clearTimeout(debounceBusca);
        debounceBusca = setTimeout(async function() {
            const dadosApi = await buscarDadosPokemon(valor);
            
            if (idRequisicao !== requisicaoAtual || !dadosApi) {
                return;
            }

            const tipoPokemon = extrairTipoPokemon(dadosApi);
            const combatPower = extrairCombatPower(dadosApi);

            document.querySelector('#tipo').value = tipoPokemon;
            document.querySelector('#cp').value = combatPower;

            console.log("Dados preenchidos automaticamente com sucesso!");
        }, 500);
    }
});

function aplicarEstiloPorTipo(card, tipo) {
    const estiloCard = [
        { tipo: 'fire', borda: '#25822', fundo: '#ffe3d6' },
        { tipo: 'electric', borda: '#eab308', fundo: '#fef9c3' }
    ];

    for (let i = 0; i < estiloCard.length; i++) {
        if (tipo === estiloCard[i].tipo) {
            card.style.backgroundColor = estiloCard[i].fundo;
            card.style.borderColor = estiloCard[i].borda;
        }
    }
}