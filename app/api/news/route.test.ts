/** @jest-environment node */

import { NextRequest } from "next/server";

import { GET, POST } from "./route";

const getNewsPageMock = jest.fn();
const saveNewsItemMock = jest.fn();

jest.mock("@/utils/news", () => ({
  getNewsPage: (...args: unknown[]) => getNewsPageMock(...args),
  saveNewsItem: (...args: unknown[]) => saveNewsItemMock(...args),
}));

describe("/api/news route", () => {
  beforeEach(() => {
    getNewsPageMock.mockReset();
    saveNewsItemMock.mockReset();
  });

  it("returns paginated news from the GET route", async () => {
    getNewsPageMock.mockResolvedValue({
      items: [],
      nextCursor: null,
      total: 0,
      cachedAt: "2026-03-24T00:00:00.000Z",
    });

    const request = new NextRequest("http://localhost/api/news?cursor=story-2");
    const response = await GET(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(getNewsPageMock).toHaveBeenCalledWith("story-2");
    expect(json.total).toBe(0);
  });

  it("validates the POST payload before saving", async () => {
    const request = new NextRequest("http://localhost/api/news", {
      method: "POST",
      body: JSON.stringify({ title: "bad", content: "too short" }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.ok).toBe(false);
    expect(saveNewsItemMock).not.toHaveBeenCalled();
  });

  it("saves a valid article from the POST route", async () => {
    saveNewsItemMock.mockResolvedValue("story-slug");

    const request = new NextRequest("http://localhost/api/news", {
      method: "POST",
      body: JSON.stringify({
        title: "A much longer valid title",
        excerpt: "This excerpt is comfortably longer than the minimum length.",
        category: "City",
        author: "Reporter",
        content:
          "This is a complete markdown article body with enough descriptive detail to pass the minimum validation rule and be saved successfully.",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.ok).toBe(true);
    expect(json.slug).toBe("story-slug");
    expect(saveNewsItemMock).toHaveBeenCalledTimes(1);
  });
});
