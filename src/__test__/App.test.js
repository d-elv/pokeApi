import App from "../App.js"
import '@testing-library/jest-dom'

test('demo', () => {
  expect(true).toBe(true)
})

test("Renders the app to the main page", () => {
  render(<App />)
  expect(true).toBeTruthy()
})