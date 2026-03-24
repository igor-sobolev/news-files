import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { AddNewsForm } from "./add-news-form";

const refreshMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: refreshMock,
  }),
}));

jest.mock("react-markdown", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

jest.mock("remark-gfm", () => ({
  __esModule: true,
  default: () => undefined,
}));

describe("AddNewsForm", () => {
  beforeEach(() => {
    refreshMock.mockReset();
    global.fetch = jest.fn();
  });

  it("shows validation feedback for invalid input", async () => {
    render(<AddNewsForm />);

    fireEvent.click(screen.getByRole("button", { name: /publish article/i }));

    expect(
      await screen.findByText(/Please correct the highlighted fields/i),
    ).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("submits a valid article and shows a success message", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true, slug: "story-slug", message: "created" }),
    });

    render(<AddNewsForm />);

    fireEvent.change(screen.getByPlaceholderText(/Morning brief/i), {
      target: { value: "Morning brief: market square reopens" },
    });
    fireEvent.change(screen.getByPlaceholderText(/^City$/i), {
      target: { value: "City" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Summarize the story/i), {
      target: {
        value:
          "The market square reopened after a five-month renovation and safety review.",
      },
    });
    fireEvent.change(screen.getByPlaceholderText(/Optional author name/i), {
      target: { value: "Reporter" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Write the article body/i), {
      target: {
        value:
          "## Main update\n\nThe market square reopened this morning with revised traffic patterns, updated lighting, and additional vendor space for weekend use.",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: /publish article/i }));

    await waitFor(() => {
      expect(screen.getByText(/Published/i)).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/news",
      expect.objectContaining({
        method: "POST",
      }),
    );
    expect(refreshMock).toHaveBeenCalled();
  });
});
