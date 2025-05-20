import "./App.css";
import {
  BrowserRouter,
  Route,
  Routes,
  useParams,
  Link,
  Outlet,
  useNavigate,
} from "react-router-dom";
import { useState } from "react";
import FourOhFour from "./components/PageNotFound/PageNotFound.jsx";
import Fuse from "fuse.js";
import PokemonDetailsPage from "./pages/PokemonDetailsPage/PokemonDetailsPage.jsx";
import { pokemonList } from "./data/pokemonList.js";

function SearchInput({ handleInputChange, value }) {
  return (
    <input
      className="search-input"
      data-testid="search-input"
      aria-label="search-input"
      type="text"
      onChange={handleInputChange}
      value={value}
      placeholder="Type here to search"
    />
  );
}

function SearchDropdown({ showDropdown, filteredList, onItemSelect }) {
  return (
    <ul
      className={`pokemon-name-list ${
        showDropdown ? "dropdown" : "dropdown-hidden"
      }`}
      data-testid="dropdown"
    >
      {filteredList.map((pokemon, index) => {
        return (
          <li key={index} className="list-item-pokemon-name">
            <Link
              to={{ pathname: `/${pokemon.item}` }}
              className="pokemon-list-link"
              onClick={() => onItemSelect(pokemon.item)}
            >
              <p className="single-poke-name">{pokemon.item}</p>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function PokeApp() {
  const navigate = useNavigate();
  const { pokemonName: urlPokemonName } = useParams();
  const [pokemonName, setPokemonName] = useState(urlPokemonName || "");
  const [filteredList, setFilteredList] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  async function findPokemon(query) {
    const pokemonFuseIndex = new Fuse(pokemonList, {
      includeScore: true,
    });
    const pokemon = pokemonFuseIndex.search(query);
    return pokemon.slice(0, 10);
  }

  const handleInputChange = async (event) => {
    const query = event.target.value.toLowerCase();
    setPokemonName(query);
    setShowDropdown(query.length > 0);
    const queryFilteredList = await findPokemon(query);
    setFilteredList(queryFilteredList);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setShowDropdown(false);
    navigate(`/${pokemonName}`);
  };

  const getRandomPokemon = () => {
    const randomNumber = Math.floor(Math.random() * 1302);
    const randomPokemon = pokemonList[randomNumber];
    setPokemonName(randomPokemon);
    setShowDropdown(false);
    navigate(`/${randomPokemon}`);
  };

  return (
    <div className="app">
      <div className="title-section">
        <h1 className="title">Poke Stats</h1>
        <form onSubmit={handleSearchSubmit} className="form-elements">
          <div className="search-container">
            <SearchInput
              handleInputChange={handleInputChange}
              value={pokemonName}
            />
            <SearchDropdown
              showDropdown={showDropdown}
              filteredList={filteredList}
              onItemSelect={(name) => {
                setPokemonName(name);
                setShowDropdown(false);
              }}
            />
          </div>
        </form>
        <button
          id="feeling-lucky"
          className="feeling-lucky-button"
          onClick={getRandomPokemon}
        >
          Randomiser!
        </button>
      </div>
      <Outlet />
    </div>
  );
}

export default function App() {
  return (
    <div className="wrapper">
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<PokeApp />}>
            <Route
              index
              element={
                <h1 className="call-to-action">Please Search for a Pokemon</h1>
              }
            />
            <Route
              path="/:pokemonName"
              exact
              element={<PokemonDetailsPage />}
            />
          </Route>
          <Route path="/404" exact element={<FourOhFour />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
