import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

test("renders example element", () => {
  const { getByText } = render(<App />);
  const exampleElement = getByText(/time to struggle together/i);
  expect(exampleElement).toBeInTheDocument();
});
