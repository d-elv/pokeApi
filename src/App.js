import "./App.css";
import {
  BrowserRouter,
  Route,
  Routes,
  useParams,
  Link,
  Outlet,
  useLocation
} from "react-router-dom";
import { useState, useEffect } from "react";
import FourOhFour from "./components/PageNotFound/PageNotFound";
import PokemonDetailsPage from "./pages/PokemonDetailsPage/PokemonDetailsPage.jsx";

function PokeApp() {
  const location = useLocation();
  const [isChosen, setIsChosen] = useState(false)
  const { pokemonName: urlPokemonName } = useParams();
  const [pokemonName, setPokemonName] = useState(urlPokemonName || "");
 
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        document.getElementById("search-button").click();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleChosen = () => {
    if (pokemonName) {
      setIsChosen(true)
    }
  }

  useEffect(() => {
    if (location.pathname !== "/") {
      setIsChosen(true)
    } else {
      setIsChosen(false);
    }
  }, [location.pathname]);

  return (
    <div className="App">
      <div className="title-section">
        <h1 className="title">Poke Stats</h1>
        <input
          className="search-input"
          type="text"
          onChange={(event) => {
            setPokemonName(event.target.value);
          }}
        ></input>
        <Link to={{ pathname: `/${pokemonName}`}}>
          <button id="search-button" className="search-button" onClick={handleChosen}>
            Search Pokemon
          </button>
        </Link>
      </div>
      {isChosen ? (
        <Outlet />
      ) : (
        <h1 className="call-to-action">Please Choose a Pokemon</h1>
      )}
    </div>
  );
}

export default function App() {
  return (
    <div className="wrapper">
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<PokeApp />}>
            <Route path="/:pokemonName" exact element={<PokemonDetailsPage />} />
          </Route>
          <Route path="/404" exact element={<FourOhFour />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

// TODO:
// Add a copy to clipboard button for easy sharing
// 3) Add autofill / autocorrect to search engine? (Another library?)


// COMPLETE
// Nested route for /:pokemonName PokemonDetailsPage
// move searchPokemon into details page. we're only passing the name across which triggers the api call
// 7) Add in the img of the back of the pok'e'mon that users can flick between with a small arrow.
// 5) Refreshing the page causes the pokemon to go. Make it so the pok'e'mon stay.
// 6) Update the URL when searching for a pok'e'mon
// 8) If given a url with a pokemon on it, the api will call that.
