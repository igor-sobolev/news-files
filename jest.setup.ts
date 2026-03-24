import "@testing-library/jest-dom";
import "whatwg-fetch";
import { TextDecoder, TextEncoder } from "node:util";

import { server } from "@/utils/test/msw-server";

Object.defineProperty(globalThis, "TextEncoder", {
  writable: true,
  value: TextEncoder,
});

Object.defineProperty(globalThis, "TextDecoder", {
  writable: true,
  value: TextDecoder,
});

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
});

afterEach(() => {
  server.resetHandlers();

  if (typeof window !== "undefined") {
    window.localStorage.clear();
    window.sessionStorage.clear();
  }

  jest.clearAllMocks();
});

afterAll(() => {
  server.close();
});

class MockIntersectionObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

Object.defineProperty(
  typeof window !== "undefined" ? window : globalThis,
  "IntersectionObserver",
  {
    writable: true,
    value: MockIntersectionObserver,
  },
);
