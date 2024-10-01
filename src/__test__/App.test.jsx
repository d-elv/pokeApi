import React from "react";
import { render } from "@testing-library/react";
import { PokeApp } from "../App";
import { MemoryRouter, Routes, Route } from "react-router-dom";

describe(PokeApp, () => {
  it("Pokemon search bar displays correct initial value of an empty string", () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <PokeApp pokemonName={""} />
      </MemoryRouter>
    );
    const searchInputValue = getByTestId("search-input").textContent;
    expect(searchInputValue).toEqual("");
  });
});

describe(PokeApp, () => {
  it("sets pokemonName state to url params if it contains a Pokemon name", () => {
    const pokemonName = "jynx";

    const { getByTestId } = render(
      <MemoryRouter initialEntries={[`/${pokemonName}`]}>
        <Routes>
          <Route path="/:pokemonName" exact element={<PokeApp />} />
        </Routes>
      </MemoryRouter>
    );
    const searchInput = getByTestId("search-input");
    expect(searchInput.value).toBe(pokemonName);
  });
});
