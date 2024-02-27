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
import { useState, useEffect } from "react";
import axios from "axios";
import FourOhFour from "./components/PageNotFound/PageNotFound";
import PokemonDetailsPage from "./pages/PokemonDetailsPage/PokemonDetailsPage.jsx";

function PokeApp() {
  const navigate = useNavigate();
  const { pokemonName: urlPokemonName } = useParams();
  const [pokemonName, setPokemonName] = useState(urlPokemonName || "");
  const [listOfAllPokemonNames, setListOfAllPokemonNames] = useState();
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    GetPokemonList();
  }, [])

  const GetPokemonList = async () => {
    try {
      const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=1302");
      const pokeArray = response.data.results;
      const allPokemonNames = pokeArray.map((pokemon) => pokemon.name);
      setListOfAllPokemonNames(allPokemonNames);
    } catch (error) {
      console.error(error);
    }
  };


  const handleSubmit = (event) => {
    event.preventDefault();
    navigate(`/${pokemonName}`)
  }

  const handleInputOnFocus = () => {
    setShowDropdown(true)
  }

  const handleInputBlur = () => {
    setShowDropdown(false)
  }

  const tempPokeNames = ["pikachu", "onix", "bulbasaur", "charmander", "charmeleon", "weedle"]

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
            onFocus={handleInputOnFocus}
            // onBlur={handleInputBlur}
          />
          <ul className={`pokemon-name-list ${
            showDropdown ? "dropdown" : ""
          }`}>
            <div className="dropdown-content">
              {tempPokeNames.map((pokemonNameFromList, index) => {
                return (
                  <li key={index} className="list-item-pokemon-name">
                    <Link to={{ pathname: `/${pokemonNameFromList}`}} className="pokemon-list-link" onClick={handleInputBlur}>
                      <p className="single-poke-name">{pokemonNameFromList}</p>
                    </Link>
                  </li>
                )
                })}
              </div>
          </ul>
          {/* <ul className="pokemon-name-list">
            {listOfAllPokemonNames.map((pokemonName, index) => {
              return (
                <li key={index} className="list-pokemon-name">
                  {pokemonName}
                </li>
              )
              })}
          </ul> */}
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
  // console.log(allPokemonNames)
  return (
  <>
  <h1 className="call-to-action">Please Search for a Pokemon</h1>
  </>
  )
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
