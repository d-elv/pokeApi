import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PokeApp } from "../App";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { beforeEach, vi } from "vitest";
import * as router from "react-router-dom";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe("PokeApp", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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

  it("Updates the input value when the user types", async () => {
    const screen = render(
      <MemoryRouter>
        <Routes>
          <Route path="/" exact element={<PokeApp />} />
        </Routes>
      </MemoryRouter>
    );

    const searchInput = screen.getByTestId("search-input");

    await act(async () => {
      fireEvent.change(searchInput, { target: { value: "pikachu" } });
    });

    expect(searchInput.value).toBe("pikachu");
  });

  it("Shows the dropdown when the user types", async () => {
    const user = userEvent.setup();

    const screen = render(
      <MemoryRouter>
        <Routes>
          <Route path="/" exact element={<PokeApp />} />
        </Routes>
      </MemoryRouter>
    );
    const searchInput = screen.getByTestId("search-input");
    await user.type(searchInput, "o");

    const dropdown = screen.getByTestId("dropdown");
    expect(dropdown).toBeVisible();
  });

  it("Navigates when a pokemon is clicked in the dropdown", async () => {
    const navigate = vi.fn();
    vi.spyOn(router, "useNavigate").mockImplementation(() => navigate);
    const user = userEvent.setup();

    const screen = render(
      <MemoryRouter>
        <Routes>
          <Route path="/" exact element={<PokeApp />} />
        </Routes>
      </MemoryRouter>
    );

    const searchInput = screen.getByTestId("search-input");
    await user.type(searchInput, "pikachu");

    await waitFor(() => {
      expect(screen.getByTestId("dropdown")).toBeInTheDocument();
    });

    const firstResult = screen.getAllByText("pikachu")[0];

    if (firstResult) {
      await user.click(firstResult);
    }

    // Check whether dropdown closed as confirmation that navigation occurred.
    await waitFor(() => {
      expect(screen.queryByTestId("dropdown")).not.toBeInTheDocument();
    });
  });

  it("Calls randomiser function and navigates when button is clicked", async () => {
    const navigate = vi.fn();
    vi.spyOn(router, "useNavigate").mockImplementation(() => navigate);
    const user = userEvent.setup();

    const screen = render(
      <MemoryRouter>
        <Routes>
          <Route path="/" exact element={<PokeApp />} />
        </Routes>
      </MemoryRouter>
    );

    await user.click(screen.getByText("Randomiser!"));
    expect(navigate).toHaveBeenCalledTimes(1);
  });

  it("submits the form and navigates to the pokemon page then closes dropdown", async () => {
    const navigate = vi.fn();
    vi.spyOn(router, "useNavigate").mockImplementation(() => navigate);
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<PokeApp />} />
        </Routes>
      </MemoryRouter>
    );

    const searchInput = screen.getByTestId("search-input");
    await user.type(searchInput, "charizard");
    await user.keyboard("{Enter}");

    expect(navigate).toHaveBeenCalledWith("/charizard");

    await waitFor(() => {
      const dropdown = screen.getByTestId("dropdown");
      expect(dropdown.className).toMatch(/dropdown-hidden/);
    });
  });
});
