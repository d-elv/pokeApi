import "./App.css";
import {
  BrowserRouter,
  Route,
  Routes,
  useParams,
  Link,
} from "react-router-dom";
import { useState, useEffect } from "react";
import FourOhFour from "./components/PageNotFound/PageNotFound";
import PokemonDetailsPage from "./pages/PokemonDetailsPage/PokemonDetailsPage.js";

function PokeApp() {
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
          <button id="search-button" className="search-button">
            Search Pokemon
          </button>
        </Link>
      </div>
        <h1 className="call-to-action">Please Choose a Pokemon</h1>
        {/* <Outlet /> */}
    </div>
  );
}

export default function App() {
  return (
    <div className="wrapper">
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<PokeApp />} />
          <Route path="/:pokemonName" exact element={<PokemonDetailsPage />} />
          <Route path="/404" exact element={<FourOhFour />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

// TODO:
// 3) Add autofill / autocorrect to search engine? (Another library)
// 7) Add in the img of the back of the pok'e'mon that users can flick between with a small arrow.

// Nested route for /:pokemonName PokemonDetailsPage

// COMPLETE
// move searchPokemon into details page. we're only passing the name across which triggers the api call
// 5) Refreshing the page causes the pokemon to go. Make it so the pok'e'mon stay.
// 6) Update the URL when searching for a pok'e'mon
// 8) If given a url with a pokemon on it, the api will call that.
