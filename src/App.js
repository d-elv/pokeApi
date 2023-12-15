import "./App.css";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import FourOhFour from "./components/PageNotFound/PageNotFound";
import { useState } from "react";
import "../src/App.css";
import axios from "axios";


function toTitleCase(string) {
    return string.replace(
      /\w\S*/g,
      function(text) {
        return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
      }
    );
  }

function PokeApp() {
    const navigate = useNavigate();
    const [pokemonName, setPokemonName] = useState("");
    const [isChosen, setIsChosen] = useState(false);
    const [pokemonInfo, setPokemonInfo] = useState({
        name: "",
        species: "",
        imageUrl: "",
        hp: "",
        attack: "",
        defense: "",
        type: "",
    });


    const updateUrl = (lowerCasePokemonName) => {
        navigate(`/${lowerCasePokemonName}`, { replace: true });
    };

    const searchPokemon = () => {
        const lowerCasePokemonName = pokemonName.toLowerCase();
        axios
            .get(`https://pokeapi.co/api/v2/pokemon/${lowerCasePokemonName}`)
            .then((response) => {
                const weightInKg = Math.round(response.data.weight / 10)
                const heightInMetres = Math.round((response.data.height / 10) * 10) / 10;
                const titleCasePokemonName = toTitleCase(pokemonName)
                setPokemonInfo({
                    name: titleCasePokemonName,
                    species: response.data.species.name,
                    imageUrl: response.data.sprites.front_default,
                    hp: response.data.stats[0].base_stat,
                    attack: response.data.stats[1].base_stat,
                    defense: response.data.stats[2].base_stat,
                    type: response.data.types[0].type.name,
                    weight: weightInKg,
                    height: heightInMetres,
                });
                updateUrl(lowerCasePokemonName)
            })
            .catch((error) => {
                if (error.response) {
                    if (error.response.status === 404) {
                        navigate("/404");
                        return;
                    }
                }
            });
        setIsChosen(true);
    };
    return (
        <div className="App">
            <div className="title-section">
                <h1>Poke Stats</h1>
                <input
                    className="search-input"
                    type="text"
                    onChange={(event) => {
                        setPokemonName(event.target.value);
                    }}
                ></input>
                <button onClick={searchPokemon} className="search-button">
                    Search Pokemon
                </button>
            </div>
            <div className="display-section">
                {!isChosen ? (
                    <h1>Please choose a pokemon</h1>
                ) : (
                    <div className="stats-window">
                        <h1 className="stats-title">{pokemonInfo.name}</h1>
                        <div className="text-and-image-wrapper">
                            <div className="text-stats">
                                <p>
                                    <span className="bold">Species:</span>{" "}
                                    {pokemonInfo.species}
                                </p>
                                <p>
                                    <span className="bold">Type:</span>{" "}
                                    {pokemonInfo.type}
                                </p>
                                <p>
                                    <span className="bold">HP:</span>{" "}
                                    {pokemonInfo.hp}
                                </p>
                                <p>
                                    <span className="bold">Attack:</span>{" "}
                                    {pokemonInfo.attack}
                                </p>
                                <p>
                                    <span className="bold">Defence:</span>{" "}
                                    {pokemonInfo.defense}
                                </p>
                                <p>
                                    <span className="bold">Weight:</span>{" "}
                                    {pokemonInfo.weight}{" (kg)"}
                                </p>
                                <p>
                                    <span className="bold">Height:</span>{" "}
                                    {pokemonInfo.height}{" (m)"}
                                </p>
                            </div>
                            <div className="image-window">
                                <img
                                    className="pokemon-image"
                                    src={pokemonInfo.imageUrl}
                                    alt="front view of chosen pokemon"
                                ></img>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function App() {
    return (
        <div className="wrapper">
            <BrowserRouter>
                <Routes>
                    <Route path="/" exact element={<PokeApp />} />
                    <Route path="/:pokemonName" exact element={<PokeApp />} />
                    <Route path="/404" exact element={<FourOhFour />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

// TODO:
// 5) Refreshing the page causes the pokemon to go
// 6) Update the URL when searching for a pok'e'mon
// 3) Add autofill / autocorrect to search engine? (Another library)