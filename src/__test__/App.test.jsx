import React from "react";
import { render } from "@testing-library/react";
import { PokeApp } from "../App";
import { MemoryRouter, Routes, Route } from "react-router-dom";

describe(PokeApp, () => {
  it("Displays correct initial value of an empty string", () => {
    const screen = render(
      <MemoryRouter>
        <Routes>
          <Route path="/" exact element={<PokeApp />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByDisplayValue("")).toBeVisible();
  });

  it("Prefills the search input with url params", () => {
    const pokemonName = "machop";

    const screen = render(
      <MemoryRouter initialEntries={[`/${pokemonName}`]}>
        <Routes>
          <Route path="/:pokemonName" exact element={<PokeApp />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByDisplayValue(pokemonName)).toBeVisible();
  });
});
