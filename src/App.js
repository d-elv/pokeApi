import "./App.css";
import {
  BrowserRouter,
  Route,
  Routes,
  useParams,
  Link,
  Outlet,
  useNavigate
} from "react-router-dom";
import { useState } from "react";
import FourOhFour from "./components/PageNotFound/PageNotFound";
import PokemonDetailsPage from "./pages/PokemonDetailsPage/PokemonDetailsPage.jsx";

function PokeApp() {
  const navigate = useNavigate();
  const { pokemonName: urlPokemonName } = useParams();
  const [pokemonName, setPokemonName] = useState(urlPokemonName || "");

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate(`/${pokemonName}`)
  }

  return (
    <div className="app">
      <div className="title-section">
        <h1 className="title">Poke Stats</h1>
        <form onSubmit={handleSubmit} className="form-elements">
          <input
            className="search-input"
            type="text"
            onChange={(event) => {
              setPokemonName(event.target.value);
            }}
          />
          <Link to={{ pathname: `/${pokemonName}`}} className="search-button">
            <p className="search-button-text">Search Pokemon</p>
          </Link>
        </form>
      </div>
        <Outlet />
    </div>
  );
}

const PokemonIndexPage = () => {
  return <h1 className="call-to-action">Please Search for a Pokemon</h1> 
}

export default function App() {
  return (
    <div className="wrapper">
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<PokeApp />}>
            <Route index element={<PokemonIndexPage />} />
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
