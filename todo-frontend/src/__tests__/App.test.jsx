import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest"; // Import vi for Vitest mocking utilities
import App from "../App";
import "@testing-library/jest-dom";
import axios from "axios";

// 1. Define mock data for a pending task
const mockPendingTask = {
  id: 99,
  title: "Test Task to Complete",
  description: "Mocked task",
  is_completed: false,
  created_at: new Date().toISOString(),
};

// 2. Mock axios - FIX: Define functions directly inside the factory to avoid hoisting issues.
vi.mock("axios", () => ({
  // CRITICAL FIX: The default property must contain the mock implementation.
  default: {
    // Use vi.fn for mock implementations
    get: vi.fn((url) => {
      // Mock successful response for initial task loading
      if (url.endsWith("/tasks")) {
        return Promise.resolve({ data: [mockPendingTask] });
      }
      if (url.endsWith("/tasks/all")) {
        return Promise.resolve({ data: [mockPendingTask] });
      }
      return Promise.resolve({ data: [] }); // Default for other GETs
    }),
    patch: vi.fn(() => Promise.resolve({ data: {} })), // Mock update/done
    post: vi.fn(() => Promise.resolve({ data: {} })), // Mock create
    delete: vi.fn(() => Promise.resolve({ data: {} })), // Mock delete
  },
}));

describe("🧪 Todo Frontend Tests", () => {
  // Utility function to reset axios GET mock to the original top-level state
  const mockInitialTaskLoad = () => {
    vi.mocked(axios.get).mockImplementation((url) => {
      if (url.endsWith("/tasks")) {
        return Promise.resolve({ data: [mockPendingTask] });
      }
      if (url.endsWith("/tasks/all")) {
        return Promise.resolve({ data: [mockPendingTask] });
      }
      return Promise.resolve({ data: [] });
    });
  };

  // Clear all mock history and implementations before each test
  beforeEach(() => {
    vi.clearAllMocks(); // Resets call counts for post/patch/etc.
    mockInitialTaskLoad(); // Ensures tasks are loaded for interaction tests
  });

  test("renders titles and input fields", async () => {
    render(<App />);

    // Check application titles and section headers
    expect(screen.getByText(/Add New Task/i)).toBeInTheDocument();
    expect(screen.getByText(/Latest Tasks/i)).toBeInTheDocument();

    // Check input fields using their visible placeholders
    expect(screen.getByPlaceholderText(/Title/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Description/i)).toBeInTheDocument();
  });

  test("adds a new todo", async () => {
    render(<App />);

    const titleInput = screen.getByPlaceholderText(/Title/i);
    const descInput = screen.getByPlaceholderText(/Description/i);
    const addButton = screen.getByRole("button", { name: /Add Task/i });

    fireEvent.change(titleInput, { target: { value: "Test Todo" } });
    fireEvent.change(descInput, { target: { value: "This is a test" } });
    fireEvent.click(addButton);

    // 1. Assert that the POST request was made
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining("/tasks"),
      expect.objectContaining({
        title: "Test Todo",
        description: "This is a test",
      })
    );

    // 2. Mock the subsequent GET call after the POST to return the new item
    vi.mocked(axios.get).mockImplementationOnce((url) => {
      if (url.endsWith("/tasks")) {
        const newTask = {
          id: 100,
          title: "Test Todo",
          description: "This is a test",
          is_completed: false,
          created_at: new Date().toISOString(),
        };
        // Return both the initial pending task and the new one
        return Promise.resolve({ data: [mockPendingTask, newTask] });
      }
      return Promise.resolve({ data: [] });
    });

    // 3. Wait for the UI to update and show the new task
    await waitFor(() => {
      expect(screen.getByText("Test Todo")).toBeInTheDocument();
    });
  });

  test("marks a task as done", async () => {
    // Initial state setup is handled by beforeEach and mockInitialTaskLoad
    render(<App />);

    // Wait for the mock task to appear, confirming initial load success
    await screen.findByText("Test Task to Complete");

    // 2. Mock the re-fetch behavior after the PATCH request:
    vi.mocked(axios.get).mockImplementation((url) => {
      if (url.endsWith("/tasks")) {
        // Task disappears from the pending list
        return Promise.resolve({ data: [] });
      }
      if (url.endsWith("/tasks/all")) {
        // Task is now completed
        return Promise.resolve({
          data: [{ ...mockPendingTask, is_completed: true }],
        });
      }
      return Promise.resolve({ data: [] });
    });

    // Find and click the 'Mark as Done' button for the mocked task
    const doneButton = await screen.findByRole("button", {
      name: /Mark as Done/i, // Uses the title/aria-label
    });
    fireEvent.click(doneButton);

    await waitFor(() => {
      // Assert that the 'markDone' PATCH call was made successfully
      expect(axios.patch).toHaveBeenCalledWith(
        expect.stringContaining(`/tasks/${mockPendingTask.id}/done`)
      );

      // Assert that the task has disappeared from the "Latest Tasks" list
      expect(
        screen.queryByText("Test Task to Complete")
      ).not.toBeInTheDocument();

      // Check the completed count (assuming App.jsx displays the number '1' for 1 completed task)
      expect(screen.getByText("1")).toBeInTheDocument();
    });
  });
});
