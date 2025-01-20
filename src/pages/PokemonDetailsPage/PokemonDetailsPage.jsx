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
  const { pathname } = useLocation();
  const toastRef = useRef(null);
  const [isBackImage, setIsBackImage] = useState(false);
  const [pokemonInfo, setPokemonInfo] = useState({});

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      const pokemonName = pathname.substring(1).toLowerCase();
      try {
        const { data } = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
        );
        console.log(data.types.map((type) => type.type.name).join(", "));
        setPokemonInfo({
          name: toTitleCase(data.name),
          id: data.id,
          species: data.species.name,
          frontImageUrl: data.sprites.front_default,
          backImageUrl: data.sprites.back_default,
          hp: data.stats[0].base_stat,
          attack: data.stats[1].base_stat,
          defense: data.stats[2].base_stat,
          types: data.types.map((type) => type.type.name).join(", "),
          weight: Math.round(data.weight / 10),
          height: Math.round((data.height / 10) * 10) / 10,
        });
        setIsBackImage(false);
      } catch (error) {
        if (error.status === 404) {
          navigate("/404");
        }
      }
    };
    fetchPokemonDetails();
  }, [pathname, navigate]);

  if (!pokemonInfo) {
    return <p>Loading...</p>;
  }

  const copyToClipbaord = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const toggleImageSide = () => setIsBackImage((prev) => !prev);

  return (
    <div className="display-section">
      <Toast ref={toastRef}>URL copied to clipboard!</Toast>
      <div className="stats-window">
        <div className="button-and-name">
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
              <span className="bold">Type:</span> {pokemonInfo.types}
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
              className={"pokemon-image"}
              src={
                isBackImage
                  ? pokemonInfo.backImageUrl
                  : pokemonInfo.frontImageUrl
              }
              alt={`${pokemonInfo.name} ${isBackImage} ? "back" : "front"`}
            />
            <button className="image-arrow" onClick={toggleImageSide}>
              ➭
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
