const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');
const detailsPokemon = document.getElementById('pokemonDetails');

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
        // console.log(pokemons);
        let liPokemons = document.querySelectorAll(".pokemon");

        liPokemons.forEach(function(liPokemon) {
            liPokemon.addEventListener("click", function() {
                // Lógica a ser executada quando a li for clicada
                let numero = this.querySelector(".number").textContent;
                let idPokemon = numero.replace('#','');
                actionDetailsPokemon(idPokemon)
                    .then((pokemonDetail) => pokemonDetail)
                    .then((pokemonUniqueDetail) => {
                        console.log(pokemonUniqueDetail);
                        window.location.href = "pokemon.html";
                        localStorage.setItem('detailPokemon', JSON.stringify(pokemonUniqueDetail));
                    });
            });
        });


    })
}


function actionDetailsPokemon(id) {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}/`

    return fetch(url)
        .then((response) => response.json())
        .then((detailPokemon) => detailPokemon)
}

function loadDetailPokemonNewPage() {
    let pokemon = localStorage.getItem('detailPokemon');
    let detailPokemon = JSON.parse(pokemon);
    const newHtmlDetail = renderNewPageDetail(detailPokemon);
    detailsPokemon.innerHTML += newHtmlDetail;
}

function renderNewPageDetail(pokemon) {
     return `
        <li class="pokemon ${pokemon["base_experience"]}">
            <span>name: ${pokemon.name}</span>
            <span>weight: ${pokemon.weight}</span>
            <span>height: ${pokemon.height}</span>

            <div>
                <h3>Abilities:</h3>
                <ol>
                    ${pokemon.abilities.map((ability) => `<li>${ability.ability.name}</li>`).join('')}
                </ol>
            </div> 
        </li>
    `

}


function checkURL() {
    const { pathname } = window.location;
    // console.log(pathname);
    if(pathname === '/') {
        loadPokemonItens(offset, limit)
        loadMoreButton.addEventListener('click', () => {
            offset += limit
            const qtdRecordsWithNexPage = offset + limit

            if (qtdRecordsWithNexPage >= maxRecords) {
                const newLimit = maxRecords - offset
                loadPokemonItens(offset, newLimit)

                loadMoreButton.parentElement.removeChild(loadMoreButton)
            } else {
                loadPokemonItens(offset, limit)
            }
        })
    } else if(pathname === '/pokemon.html') {
        loadDetailPokemonNewPage();
    }
}

checkURL()