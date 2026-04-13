import { fireEvent, render, screen } from "@testing-library/react";

import { MarkdownEditor } from "./markdown-editor";

jest.mock("@uiw/react-md-editor", () => {
  const mock = jest.fn(({ value, onChange, preview, commands, style }) => (
    <textarea
      aria-label="markdown editor"
      placeholder="Write the article body in Markdown..."
      value={value ?? ""}
      onChange={(event) => onChange?.(event.target.value)}
      data-preview={preview}
      data-commands={
        Array.isArray(commands)
          ? commands.map((command) => command?.name).join(",")
          : ""
      }
      data-style={JSON.stringify(style)}
    />
  ));

  return {
    __esModule: true,
    default: mock,
    commands: {
      title: { name: "title" },
      bold: { name: "bold" },
      italic: { name: "italic" },
      strikethrough: { name: "strikethrough" },
      divider: { name: "divider" },
      link: { name: "link" },
      image: { name: "image" },
      code: { name: "code" },
    },
  };
});

const getMockMDEditor = () =>
  jest.requireMock("@uiw/react-md-editor").default as jest.Mock;

type SetupOptions = {
  value?: string;
  error?: string;
  onChange?: (value: string) => void;
};

const setup = ({
  value = "",
  error,
  onChange = jest.fn(),
}: SetupOptions = {}) => {
  render(<MarkdownEditor value={value} onChange={onChange} error={error} />);
  return { value, error, onChange };
};

describe("MarkdownEditor", () => {
  beforeEach(() => {
    getMockMDEditor().mockClear();
  });

  it("passes live preview and rich markdown commands to MDEditor", () => {
    setup({ value: "Initial content" });

    const mockMDEditor = getMockMDEditor();
    expect(mockMDEditor).toHaveBeenCalledTimes(1);

    const props = mockMDEditor.mock.calls[0][0];

    expect(props.preview).toBe("live");
    expect(props.commands).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "bold" }),
        expect.objectContaining({ name: "italic" }),
        expect.objectContaining({ name: "strikethrough" }),
        expect.objectContaining({ name: "image" }),
      ]),
    );
    expect(props.style).toEqual(
      expect.objectContaining({
        border: "none",
        boxShadow: "none",
        overflow: "hidden",
        background: "transparent",
      }),
    );
  });

  it("calls onChange when the editor value changes", () => {
    const onChange = jest.fn();
    setup({ value: "Hello", onChange });

    fireEvent.change(
      screen.getByRole("textbox", { name: /markdown editor/i }),
      {
        target: { value: "Hello world" },
      },
    );

    expect(onChange).toHaveBeenCalledWith("Hello world");
  });

  it("displays inline validation feedback when an error is provided", () => {
    setup({ error: "Content is required" });

    expect(screen.getByText("Content is required")).toBeInTheDocument();
  });
});
