import VoteNow from "./VoteNow";
import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import * as nextNavigation from "next/navigation";

// Mock the dependencies
jest.mock("@/utils/supabaseClient", () => ({
  supabase: {
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: { user: { id: "user-1" } },
        error: null,
      }),
      signOut: jest.fn(),
    },
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: [],
            error: null,
          }),
        }),
      }),
    }),
  },
}));
jest.mock("@/utils/dateUtils", () => ({
  formatDateOnlyToSingaporeTime: jest.fn((date) => `Formatted: ${date}`),
  formatTimeRemainingInSingaporeTime: jest.fn((date) => `Remaining: ${date}`),
}));

// Mock fetch globally
global.fetch = jest.fn();

// Mock window.alert
global.alert = jest.fn();

// Mock VoterHeader component
jest.mock("./VoteDash_Header", () => {
  return function MockVoterHeader() {
    return <div data-testid="voter-header">Voter Header</div>;
  };
});

const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
};

// Get the mocked supabase
const { supabase } = require("@/utils/supabaseClient");

describe("VoteNow Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(nextNavigation, "useRouter").mockReturnValue(mockRouter);
    jest.spyOn(nextNavigation, "useSearchParams").mockReturnValue({
      get: () => null,
      getAll: () => [],
      has: () => false,
      entries: function* () { yield ["", ""]; return undefined; },
      keys: function* () { yield ""; return undefined; },
      values: function* () { yield ""; return undefined; },
      forEach: () => {},
      toString: () => '',
      append: () => {},
      delete: () => {},
      set: () => {},
      sort: () => {},
      [Symbol.iterator]: function* () { yield ["", ""]; return undefined; },
      size: 0,
    });
    (global.fetch as jest.Mock).mockClear();
    (global.alert as jest.Mock).mockClear();
  });

  // Helper function to select a candidate
  const selectCandidate = (candidateName: string) => {
    // Find the candidate card by name and click the selection button
    // The button is the first button in the candidate card
    const candidateCard = screen.getByText(candidateName).closest("div")?.parentElement?.parentElement?.parentElement?.parentElement;
    const selectButton = candidateCard?.querySelector("button");
    if (selectButton) {
      fireEvent.click(selectButton);
    } else {
      // Fallback: try to find any button near the candidate name
      const candidateElement = screen.getByText(candidateName);
      const nearbyButton = candidateElement.closest("div")?.querySelector("button");
      if (nearbyButton) {
        fireEvent.click(nearbyButton);
      } else {
        throw new Error(`Could not find select button for candidate: ${candidateName}`);
      }
    }
  };

  const mockElectionData = {
    elections: [
      {
        id: "election-1",
        name: "Student Council Election 2024",
        description: "Annual student council election",
        start_date: "2024-01-01T00:00:00Z",
        end_date: "2024-12-31T23:59:59Z",
        is_uni_level: false,
        allow_abstain: true,
        eligible_courseYear: ["2024", "2023"],
        org_id: "org-1",
        positions: [
          {
            id: "pos-1",
            title: "President",
            description: "Student Council President",
            max_candidates: 5,
            max_winners: 1,
            is_required: true,
            election_id: "election-1",
          },
          {
            id: "pos-2",
            title: "Vice President",
            description: "Student Council Vice President",
            max_candidates: 3,
            max_winners: 1,
            is_required: true,
            election_id: "election-1",
          },
        ],
        candidates: [
          {
            id: "candidate-1",
            name: "John Doe",
            email: "john@example.com",
            course_year: "Computer Science 2024",
            position_id: "pos-1",
            status: "approved",
            platform: "Building a better campus community",
            detailed_achievements: "Former class representative, 3.8 GPA",
            picture_url: "https://example.com/john.jpg",
          },
          {
            id: "candidate-2",
            name: "Jane Smith",
            email: "jane@example.com",
            course_year: "Engineering 2024",
            position_id: "pos-1",
            status: "approved",
            platform: "Innovation and inclusivity",
            detailed_achievements: "Student leader, community service award",
            picture_url: null,
          },
        ],
        candidatesByPosition: {
          "pos-1": [
            {
              id: "candidate-1",
              name: "John Doe",
              email: "john@example.com",
              course_year: "Computer Science 2024",
              position_id: "pos-1",
              status: "approved",
              platform: "Building a better campus community",
              detailed_achievements: "Former class representative, 3.8 GPA",
              picture_url: "https://example.com/john.jpg",
            },
            {
              id: "candidate-2",
              name: "Jane Smith",
              email: "jane@example.com",
              course_year: "Engineering 2024",
              position_id: "pos-1",
              status: "approved",
              platform: "Innovation and inclusivity",
              detailed_achievements: "Student leader, community service award",
              picture_url: null,
            },
          ],
          "pos-2": [],
        },
      },
    ],
    totalElections: 1,
  };

  describe("Data Fetching", () => {
    it("should fetch election data on component mount", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockElectionData,
      });

      supabase.auth.getUser.mockResolvedValueOnce({
        data: { user: { id: "user-1" } },
      });

      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({
              data: [],
              error: null,
            }),
          }),
        }),
      });

      render(<VoteNow electionId="election-1" />);

      // Should show loading initially
      expect(screen.getByText("Loading election data...")).toBeInTheDocument();

      // Wait for data to load
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          "/api/get-voting-data?electionId=election-1"
        );
      });

      await waitFor(() => {
        expect(screen.getByText("Student Council Election 2024")).toBeInTheDocument();
      });
    });

    it("should handle API fetch errors gracefully", async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error("Network error")
      );

      render(<VoteNow electionId="election-1" />);

      await waitFor(() => {
        expect(screen.getByText("Failed to load election data. Please try again.")).toBeInTheDocument();
      });

      expect(screen.getByText("Try Again")).toBeInTheDocument();
    });

    it("should handle API response errors", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        text: async () => "Server error",
      });

      render(<VoteNow electionId="election-1" />);

      await waitFor(() => {
        expect(screen.getByText("Failed to load election data. Please try again.")).toBeInTheDocument();
      });
    });

    it("should handle empty election data", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ elections: [] }),
      });

      render(<VoteNow electionId="election-1" />);

      await waitFor(() => {
        expect(screen.getByText("No Active Elections")).toBeInTheDocument();
      });
    });
  });

  describe("User Authentication and Vote Checking", () => {
    it("should check if user has already voted", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockElectionData,
      });

      supabase.auth.getUser.mockResolvedValueOnce({
        data: { user: { id: "user-1" } },
      });

      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({
              data: [{ id: "vote-1" }], // User has already voted
              error: null,
            }),
          }),
        }),
      });

      render(<VoteNow electionId="election-1" />);

      await waitFor(() => {
        expect(screen.getByText("You have already voted in this election.")).toBeInTheDocument();
      });
    });

    it("should allow voting if user hasn't voted yet", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockElectionData,
      });

      supabase.auth.getUser.mockResolvedValueOnce({
        data: { user: { id: "user-1" } },
      });

      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({
              data: [], // User hasn't voted
              error: null,
            }),
          }),
        }),
      });

      render(<VoteNow electionId="election-1" />);

      await waitFor(() => {
        expect(screen.getByText("John Doe")).toBeInTheDocument();
        expect(screen.getByText("Jane Smith")).toBeInTheDocument();
      });
    });
  });

  describe("Candidate Selection", () => {
    beforeEach(async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockElectionData,
      });

      supabase.auth.getUser.mockResolvedValueOnce({
        data: { user: { id: "user-1" } },
      });

      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({
              data: [],
              error: null,
            }),
          }),
        }),
      });
    });

    it("should allow selecting candidates for positions", async () => {
      render(<VoteNow electionId="election-1" />);

      await waitFor(() => {
        expect(screen.getByText("John Doe")).toBeInTheDocument();
      });

      // Select John Doe as candidate
      selectCandidate("John Doe");
    });

    it("should display candidate information correctly", async () => {
      render(<VoteNow electionId="election-1" />);

      await waitFor(() => {
        expect(screen.getByText("John Doe")).toBeInTheDocument();
        expect(screen.getByText("Computer Science 2024")).toBeInTheDocument();
        expect(screen.getByText("Building a better campus community")).toBeInTheDocument();
        expect(screen.getByText("Former class representative, 3.8 GPA")).toBeInTheDocument();
      });
    });

    it("should handle candidates without profile pictures", async () => {
      render(<VoteNow electionId="election-1" />);

      await waitFor(() => {
        expect(screen.getByText("Jane Smith")).toBeInTheDocument();
      });

      // Should show default avatar icon for candidates without pictures
      // Look for the SVG icon that represents the default avatar
      const avatarIcons = screen.getAllByText((content, element) => {
        return element?.tagName.toLowerCase() === 'svg' && 
               element?.getAttribute('class')?.includes('text-gray-400') || false;
      });
      expect(avatarIcons.length).toBeGreaterThan(0);
    });
  });

  describe("Vote Submission", () => {
    beforeEach(async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockElectionData,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        });

      supabase.auth.getUser.mockResolvedValueOnce({
        data: { user: { id: "user-1" } },
      });

      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({
              data: [],
              error: null,
            }),
          }),
        }),
      });
    });

    it("should submit votes successfully", async () => {
      // Mock that user hasn't voted yet
      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({
              data: [], // User hasn't voted
              error: null,
            }),
          }),
        }),
      });

      render(<VoteNow electionId="election-1" />);

      await waitFor(() => {
        expect(screen.getByText("Submit Vote")).toBeInTheDocument();
      });

      // Select a candidate
      selectCandidate("John Doe");

      // Submit vote
      const submitButton = screen.getByText("Submit Vote");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith("/api/submit-votes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            votes: { "pos-1": "candidate-1" },
            electionId: "election-1",
            userId: "user-1",
          }),
        });
      });
    });

    it("should handle vote submission errors", async () => {
      // Set up mocks for this test
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockElectionData,
        })
        .mockResolvedValueOnce({
          ok: false,
          json: async () => ({ error: "Vote submission failed" }),
        });

      supabase.auth.getUser.mockResolvedValueOnce({
        data: { user: { id: "user-1" } },
      });

      // Mock that user hasn't voted yet - this needs to be set up before render
      const mockSelect = jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: [], // User hasn't voted
            error: null,
          }),
        }),
      });

      supabase.from.mockReturnValue({
        select: mockSelect,
      });

      render(<VoteNow electionId="election-1" />);

      await waitFor(() => {
        expect(screen.getByText("Submit Vote")).toBeInTheDocument();
      });

      // Select a candidate
      selectCandidate("John Doe");

      // Submit vote
      const submitButton = screen.getByText("Submit Vote");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith("Vote submission failed. Please try again.");
      });
    });

    it("should show loading state during vote submission", async () => {
      let resolveSubmit: (value: any) => void;
      const submitPromise = new Promise((resolve) => {
        resolveSubmit = resolve;
      });

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockElectionData,
        })
        .mockReturnValueOnce(submitPromise);

      render(<VoteNow electionId="election-1" />);

      await waitFor(() => {
        expect(screen.getByText("Submit Vote")).toBeInTheDocument();
      });

      // Select a candidate
      selectCandidate("John Doe");

      // Submit vote
      const submitButton = screen.getByText("Submit Vote");
      fireEvent.click(submitButton);

      // Should show loading state
      await waitFor(() => {
        expect(screen.getByText("Submitting...")).toBeInTheDocument();
      });

      // Resolve the promise
      resolveSubmit!({
        ok: true,
        json: async () => ({ success: true }),
      });
    });
  });

  describe("Navigation", () => {
    it("should navigate back to dashboard when back button is clicked", async () => {
      // Set up mocks for this test
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockElectionData,
      });

      supabase.auth.getUser.mockResolvedValueOnce({
        data: { user: { id: "user-1" } },
      });

      // Mock that user hasn't voted yet
      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({
              data: [], // User hasn't voted
              error: null,
            }),
          }),
        }),
      });

      render(<VoteNow electionId="election-1" />);

      await waitFor(() => {
        expect(screen.getByText("Submit Vote")).toBeInTheDocument();
      });

      const backButton = screen.getByText("Back to Dashboard");
      fireEvent.click(backButton);

      expect(mockRouter.push).toHaveBeenCalledWith("/Voterdashboard");
    });

    it("should navigate to dashboard after successful vote submission", async () => {
      // Set up mocks for this test
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockElectionData,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        });

      supabase.auth.getUser.mockResolvedValueOnce({
        data: { user: { id: "user-1" } },
      });

      // Mock that user hasn't voted yet
      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({
              data: [], // User hasn't voted
              error: null,
            }),
          }),
        }),
      });

      render(<VoteNow electionId="election-1" />);

      await waitFor(() => {
        expect(screen.getByText("Submit Vote")).toBeInTheDocument();
      });

      // Select a candidate
      selectCandidate("John Doe");

      // Submit vote
      const submitButton = screen.getByText("Submit Vote");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith("/Voterdashboard");
      });
    });
  });

  describe("Component Rendering", () => {
    it("should render the component with correct structure", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockElectionData,
      });

      supabase.auth.getUser.mockResolvedValueOnce({
        data: { user: { id: "user-1" } },
      });

      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({
              data: [],
              error: null,
            }),
          }),
        }),
      });

      render(<VoteNow electionId="election-1" />);

      await waitFor(() => {
        expect(screen.getByTestId("voter-header")).toBeInTheDocument();
        expect(screen.getByText("Organization Election")).toBeInTheDocument();
        expect(screen.getByText("Select your preferred candidates for Student Council Election 2024 election")).toBeInTheDocument();
        expect(screen.getByText("President")).toBeInTheDocument();
        expect(screen.getByText("Vice President")).toBeInTheDocument();
      });
    });

    it("should display election time information correctly", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockElectionData,
      });

      supabase.auth.getUser.mockResolvedValueOnce({
        data: { user: { id: "user-1" } },
      });

      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({
              data: [],
              error: null,
            }),
          }),
        }),
      });

      render(<VoteNow electionId="election-1" />);

      await waitFor(() => {
        expect(screen.getByText("Remaining: 2024-12-31T23:59:59Z")).toBeInTheDocument();
        expect(screen.getByText("Voting ends: Formatted: 2024-12-31T23:59:59Z")).toBeInTheDocument();
      });
    });
  });
});




