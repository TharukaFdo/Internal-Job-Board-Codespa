import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, afterEach, vi } from "vitest";
import App from "./App";

const createFetchResponse = (data, ok = true) => ({
  ok,
  json: async () => data,
});

const mockFetchSequence = (responses) => {
  let call = 0;
  vi.spyOn(globalThis, "fetch").mockImplementation((...args) => {
    const responseFactory = responses[call] ?? responses[responses.length - 1];
    call += 1;
    return Promise.resolve(
      typeof responseFactory === "function"
        ? responseFactory(...args)
        : responseFactory
    );
  });
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe("App", () => {
  it("loads and shows jobs from the API", async () => {
    const jobs = [
      { _id: "1", title: "Backend Engineer", department: "Platform" },
    ];
    mockFetchSequence([createFetchResponse(jobs)]);

    render(<App />);

    await screen.findByText("Backend Engineer");
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("submits a new job and clears the form", async () => {
    const newJob = {
      _id: "2",
      title: "QA Engineer",
      department: "Quality",
      description: "Test plans",
    };

    mockFetchSequence([
      createFetchResponse([]),
      (url, options) => {
        expect(url).toContain("/api/jobs");
        expect(options?.method).toBe("POST");
        return createFetchResponse(newJob);
      },
    ]);

    render(<App />);

    const titleInput = await screen.findByLabelText("Title *");
    fireEvent.change(titleInput, { target: { value: "QA Engineer" } });
    fireEvent.change(screen.getByLabelText("Department *"), {
      target: { value: "Quality" },
    });
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "Test plans" },
    });

    fireEvent.click(screen.getByRole("button", { name: /submit job/i }));

    await screen.findByText("QA Engineer");
    expect(titleInput.value).toBe("");
    expect(screen.getByLabelText("Department *").value).toBe("");
    expect(screen.getByLabelText("Description").value).toBe("");
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});
