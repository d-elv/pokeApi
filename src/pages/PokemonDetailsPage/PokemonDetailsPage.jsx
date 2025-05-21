import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Toast } from "../../components/toast/toast";
import axios from "axios";
import "./PokemonDetailsPage.css";

const toTitleCase = (string) => {
  return string.replace(/\w\S*/g, function (text) {
    return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
  });
};

function StatsImage({ source, alt }) {
  return <img className="pokemon-image" src={source} alt={alt} />;
}

function NotFoundImage() {
  return (
    <img
      className="pokemon-image"
      src="/public/images/image-not-found_comped_transparent.png"
      alt="not found"
    />
  );
}

function LoadingSpinner() {
  return (
    <div className="loading-container">
      <span className="loading-spinner"></span>
    </div>
  );
}

const StatsImageLogic = ({ info, showBackImage }) => {
  const [imagesState, setImagesState] = useState({
    front: { loaded: false, error: false },
    back: { loaded: false, error: false },
  });

  useEffect(() => {
    setImagesState({
      front: { loaded: false, error: false },
      back: { loaded: false, error: false },
    });

    if (!info.frontImageUrl) {
      setImagesState((prev) => ({
        ...prev,
        front: { loaded: true, error: true },
      }));
    } else {
      const frontImage = new Image();
      frontImage.onload = () => {
        setImagesState((prev) => ({
          ...prev,
          front: { loaded: true, error: false },
        }));
      };
      frontImage.onerror = () => {
        setImagesState((prev) => ({
          ...prev,
          front: { loaded: true, error: true },
        }));
      };
      frontImage.src = info.frontImageUrl;
    }

    if (!info.backImageUrl) {
      setImagesState((prev) => ({
        ...prev,
        back: { loaded: true, error: true },
      }));
    } else {
      const backImage = new Image();
      backImage.onload = () => {
        setImagesState((prev) => ({
          ...prev,
          back: { loaded: true, error: false },
        }));
      };
      backImage.onerror = () => {
        setImagesState((prev) => ({
          ...prev,
          back: { loaded: true, error: true },
        }));
      };
      backImage.src = info.backImageUrl;
    }
  }, [info.frontImageUrl, info.backImageUrl]);

  const currentView = showBackImage ? "back" : "front";
  const currentImageState = imagesState[currentView];
  const currentImageUrl = showBackImage
    ? info.backImageUrl
    : info.frontImageUrl;
  const altText = `${info.name} ${currentView} view`;

  if (!currentImageState.loaded) {
    return <LoadingSpinner />;
  }

  if (currentImageState.error) {
    return <NotFoundImage />;
  }

  return <StatsImage source={currentImageUrl} alt={altText} />;
};

export default function PokemonDetailsPage() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const toastRef = useRef(null);
  const [showBackImage, setShowBackImage] = useState(false);
  const [pokemonInfo, setPokemonInfo] = useState({});

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      const pokemonName = pathname.substring(1).toLowerCase();
      try {
        const { data } = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
        );
        setPokemonInfo({
          name: toTitleCase(data.name),
          id: data.id,
          species: data.species.name,
          // frontImageUrl: undefined,
          // backImageUrl: undefined,
          frontImageUrl: data.sprites.front_default,
          backImageUrl: data.sprites.back_default,
          hp: data.stats[0].base_stat,
          attack: data.stats[1].base_stat,
          defense: data.stats[2].base_stat,
          types: data.types.map((type) => type.type.name).join(", "),
          weight: Math.round(data.weight / 10),
          height: Math.round((data.height / 10) * 10) / 10,
        });
      } catch (error) {
        if (error.status === 404) {
          navigate("/404");
        }
      }
    };
    fetchPokemonDetails();
  }, [pathname, navigate]);

  const copyToClipbaord = () => {
    navigator.clipboard.writeText(window.location.href);
  };

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
            <StatsImageLogic info={pokemonInfo} showBackImage={showBackImage} />

            <button
              className="image-arrow"
              onClick={() => setShowBackImage((prev) => !prev)}
            >
              ➭
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
