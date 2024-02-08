import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Toast } from "../../components/toast/toast";
import axios from "axios";
import "./PokemonDetailsPage.css";

function toTitleCase(string) {
  return string.replace(/\w\S*/g, function (text) {
    return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
  });
}

export default function PokemonDetailsPage() {
  const navigate = useNavigate();
  let location = useLocation();
  const toastRef = useRef(null);
  const [showBackImage, setShowBackImage] = useState(false);
  const [pokemonInfo, setPokemonInfo] = useState({
    name: "",
    id: "",
    species: "",
    frontImageUrl: "",
    backImageUrl: "",
    hp: "",
    attack: "",
    defense: "",
    type: "",
    weight: "",
    height: "",
  });

  useEffect(() => {
    if (location) {
      searchPokemon();
    }
  }, [location]);

  const searchPokemon = () => {
    const lowerCasePokemonName = location.pathname.substring(1).toLowerCase();
    axios
      .get(`https://pokeapi.co/api/v2/pokemon/${lowerCasePokemonName}`)
      .then((response) => {
        const weightInKg = Math.round(response.data.weight / 10);
        const heightInMetres =
          Math.round((response.data.height / 10) * 10) / 10;
        const titleCasePokemonName = toTitleCase(lowerCasePokemonName);
        setPokemonInfo({
          name: titleCasePokemonName,
          id: response.data.id,
          species: response.data.species.name,
          frontImageUrl: response.data.sprites.front_default,
          backImageUrl: response.data.sprites.back_default,
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
            return;
          }
        }
      })
      .finally(() => {
        setShowBackImage(false);
      });
  };

  const copyToClipbaord = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const handleImageBoolean = () => {
    if (showBackImage === true) {
      setShowBackImage(false);
    } else {
      setShowBackImage(true);
    }
  };

  return (
    <div className="display-section">
      <Toast ref={toastRef}>URL copied to clipboard!</Toast>
      <div className="stats-window">
        <div className="button-and-title">
          <button
            className="copy-to-clipboard"
            onClick={() => {
              toastRef.current.show();
              copyToClipbaord();
            }}
          >
            ⎘
          </button>
          <h1 className="stats-title">{pokemonInfo.name}</h1>
        </div>
        <div className="text-and-image-wrapper">
          <div className="text-stats">
            <p>
              <span className="bold">Species:</span> {pokemonInfo.species}
            </p>
            <p>
              <span className="bold">Type:</span> {pokemonInfo.type}
            </p>
            <p>
              <span className="bold">HP:</span> {pokemonInfo.hp}
            </p>
            <p>
              <span className="bold">Attack:</span> {pokemonInfo.attack}
            </p>
            <p>
              <span className="bold">Defence:</span> {pokemonInfo.defense}
            </p>
            <p>
              <span className="bold">Height:</span> {pokemonInfo.height}
              {" (m)"}
            </p>
            <p>
              <span className="bold">Weight:</span> {pokemonInfo.weight}
              {" (kg)"}
            </p>
          </div>
          <div className="image-window">
            <img
              className={`pokemon-image ${
                showBackImage ? "invisible" : "visible"
              }`}
              src={pokemonInfo.frontImageUrl}
              alt="front view of chosen pokemon"
            />
            <img
              className={`pokemon-image ${
                showBackImage ? "visible" : "invisible"
              }`}
              src={pokemonInfo.backImageUrl}
              alt="back view of chosen pokemon"
            />
            <button className="image-arrow" onClick={handleImageBoolean}>
              ➭
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
