import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./PokemonDetailsPage.css"


function toTitleCase(string) {
  return string.replace(/\w\S*/g, function (text) {
    return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
  });
}

export default function PokemonDetailsPage() {
  const navigate = useNavigate();
  const [pokemonName, setPokemonName] = useState("")
  const [url, setUrl] = useState(useLocation())
  const [pokemonInfo, setPokemonInfo] = useState({
    name: "",
    id: "",
    species: "",
    imageUrl: "",
    hp: "",
    attack: "",
    defense: "",
    type: "",
    weight: "",
    height: "",
  });

  useEffect(() => {
    //   // useLayoutEffect to check the URL & make the api call before the rest of the page renders.
    if (url.pathname) {
      searchPokemon();
    }
  }, [url.pathname]);

  const searchPokemon = () => {
    
    const lowerCasePokemonName = url.pathname.substring(1).toLowerCase();
    axios
      .get(`https://pokeapi.co/api/v2/pokemon/${lowerCasePokemonName}`)
      .then((response) => {
        const weightInKg = Math.round(response.data.weight / 10);
        const heightInMetres =
          Math.round((response.data.height / 10) * 10) / 10;
        setPokemonName(lowerCasePokemonName)
        const titleCasePokemonName = toTitleCase(pokemonName);
        setPokemonInfo({
          name: titleCasePokemonName,
          id: response.data.id,
          species: response.data.species.name,
          imageUrl: response.data.sprites.front_default,
          hp: response.data.stats[0].base_stat,
          attack: response.data.stats[1].base_stat,
          defense: response.data.stats[2].base_stat,
          type: response.data.types[0].type.name,
          weight: weightInKg,
          height: heightInMetres,
        });
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 404) {
            navigate("/404");
            console.log("404")
            return;
          }
        }
      });
  };

  return (
    <div className="display-section">
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
              <span className="bold">Height:</span>{" "}
              {pokemonInfo.height}{" (m)"}
            </p>
            <p>
              <span className="bold">Weight:</span>{" "}
              {pokemonInfo.weight}{" (kg)"}
            </p>
          </div>
          <div className="image-window">
            <img
              className="pokemon-image"
              src={pokemonInfo.imageUrl}
              alt="front view of chosen pokemon"
            >
            </img>
          </div>
        </div>
      </div>
    </div>
  );
};