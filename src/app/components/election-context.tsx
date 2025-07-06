"use client"

import { createContext, useContext, useState, type ReactNode, useEffect } from "react"
import { supabase } from "@/utils/supabaseClient"

export interface Position {
  id: string
  title: string
  description: string
  maxCandidates: number
  isRequired: boolean
}

export interface Candidate {
  id: string
  name: string
  email: string
  positionId: string
  position: string // Derived from positionId
  status: "pending" | "approved" | "disqualified"
  credentials: string
  detailedCredentials: string
  course: string
  year: string
  platform: string
  achievements: string[]
  experience: string[]
  avatar?: string
  createdAt: string
  electionId: string
}

export interface Organization {
  id: string
  name: string
  type: "university" | "college" | "department" | "club" | "society"
  description: string
  parentId?: string // For hierarchical organizations
}

export interface Election {
  id: string
  name: string
  description: string
  startDate: string
  startTime: string
  endDate: string
  endTime: string
  positions: Position[]
  candidates: Candidate[]
  status: "draft" | "active" | "completed" | "cancelled"
  organizationId: string
  organizationLevel: "university" | "organization"
  settings: {
    allowMultipleVotes: boolean
    requireVerification: boolean
    showResults: boolean
    allowAbstain: boolean
    eligibleYears: string[]
    eligibleCourses: string[]
    eligibleOrganizations: string[]
  }
  createdAt: string
  totalVotes?: number
  voterTurnout?: number
}

export interface Voter {
  id: string
  name: string
  email: string
  studentId: string
  course: string
  year: string
  organizationMemberships: string[] // Organization IDs the voter belongs to
  hasVoted: string[] // Election IDs the voter has voted in
}

interface ElectionContextType {
  elections: Election[]
  organizations: Organization[]
  currentElection: Election | null
  currentVoter: Voter | null
  candidates: Candidate[]
  positions: Position[]
  addElection: (election: Omit<Election, "id" | "createdAt">) => string
  updateElection: (id: string, election: Partial<Election>) => void
  deleteElection: (id: string) => void
  setCurrentElection: (id: string | null) => void
  setCurrentVoter: (voter: Voter | null) => void
  addCandidate: (candidate: Omit<Candidate, "id" | "createdAt" | "position">) => void
  updateCandidate: (id: string, candidate: Partial<Candidate>) => void
  deleteCandidate: (id: string) => void
  updateCandidateStatus: (id: string, status: "pending" | "approved" | "disqualified") => void
  getApprovedCandidates: () => Candidate[]
  getCandidatesByPosition: (positionId: string) => Candidate[]
  getPositionById: (id: string) => Position | undefined
  getActiveElections: () => Election[]
  getEligibleElections: (voterId: string) => Election[]
  getOrganizationById: (id: string) => Organization | undefined
  recordVote: (electionId: string, voterId: string) => void
}

const ElectionContext = createContext<ElectionContextType | undefined>(undefined)

// Helper to normalize a single election object
function normalizeElection(election: any) {
  if (!election) return election;
  // Prefer explicit fields, fallback to backend fields
  const startDate = election.startDate || election.start_date || '';
  const endDate = election.endDate || election.end_date || '';
  const startTime = election.startTime || (election.start_date ? new Date(election.start_date).toTimeString().slice(0,5) : '');
  const endTime = election.endTime || (election.end_date ? new Date(election.end_date).toTimeString().slice(0,5) : '');
  return {
    ...election,
    startDate,
    startTime,
    endDate,
    endTime,
    organizationId: election.organizationId || election.org_id,
  };
}

export function ElectionProvider({ children }: { children: ReactNode }) {
  const [elections, setElections] = useState<Election[]>([])
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [currentElection, setCurrentElectionState] = useState<Election | null>(null)
  const [currentVoter, setCurrentVoter] = useState<Voter | null>(null)

  // Fetch organizations, elections, and voter on mount
  useEffect(() => {
    async function fetchData() {
      // Fetch organizations
      const { data: orgs } = await supabase.from('organizations').select('*')
      setOrganizations(orgs || [])

      // Fetch elections
      const { data: electionRows } = await supabase.from('elections').select('*')
      setElections((electionRows || []).map(normalizeElection))

      // Fetch current voter (example: get from auth or session)
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Fetch voter profile by user id
        const { data: voterRows } = await supabase.from('voter_profiles').select('*').eq('user_id', user.id).single()
        setCurrentVoter(voterRows || null)
      }
    }
    fetchData()
  }, [])

  // Derived state
  const candidates = currentElection?.candidates || []
  const positions = currentElection?.positions || []

  const addElection = (electionData: Omit<Election, "id" | "createdAt">): string => {
    const newElection: Election = normalizeElection({
      ...electionData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    });
    setElections((prev) => [...prev, newElection])
    return newElection.id
  }

  const updateElection = (id: string, updates: Partial<Election>) => {
    setElections((prev) => prev.map((election) => (election.id === id ? normalizeElection({ ...election, ...updates }) : election)))
    if (currentElection?.id === id) {
      setCurrentElectionState((prev) => (prev ? normalizeElection({ ...prev, ...updates }) : null))
    }
  }

  const deleteElection = (id: string) => {
    setElections((prev) => prev.filter((election) => election.id !== id))
    if (currentElection?.id === id) {
      setCurrentElectionState(null)
    }
  }

  const setCurrentElection = (id: string | null) => {
    const election = id ? elections.find((e) => e.id === id) || null : null
    setCurrentElectionState(election)
  }

  const addCandidate = (candidateData: Omit<Candidate, "id" | "createdAt" | "position">) => {
    const position = positions.find((p) => p.id === candidateData.positionId)
    const newCandidate: Candidate = {
      ...candidateData,
      id: Date.now().toString(),
      position: position?.title || "",
      createdAt: new Date().toISOString(),
    }

    if (currentElection) {
      const updatedElection = {
        ...currentElection,
        candidates: [...currentElection.candidates, newCandidate],
      }
      updateElection(currentElection.id, { candidates: updatedElection.candidates })
    }
  }

  const updateCandidate = (id: string, updates: Partial<Candidate>) => {
    if (currentElection) {
      const updatedCandidates = currentElection.candidates.map((candidate) => {
        if (candidate.id === id) {
          const updatedCandidate = { ...candidate, ...updates }
          // Update position name if positionId changed
          if (updates.positionId) {
            const position = positions.find((p) => p.id === updates.positionId)
            updatedCandidate.position = position?.title || ""
          }
          return updatedCandidate
        }
        return candidate
      })
      updateElection(currentElection.id, { candidates: updatedCandidates })
    }
  }

  const deleteCandidate = (id: string) => {
    if (currentElection) {
      const updatedCandidates = currentElection.candidates.filter((candidate) => candidate.id !== id)
      updateElection(currentElection.id, { candidates: updatedCandidates })
    }
  }

  const updateCandidateStatus = (id: string, status: "pending" | "approved" | "disqualified") => {
    updateCandidate(id, { status })
  }

  const getApprovedCandidates = (): Candidate[] => {
    return candidates.filter((candidate) => candidate.status === "approved")
  }

  const getCandidatesByPosition = (positionId: string): Candidate[] => {
    return candidates.filter((candidate) => candidate.positionId === positionId)
  }

  const getPositionById = (id: string): Position | undefined => {
    return positions.find((position) => position.id === id)
  }

  const getActiveElections = (): Election[] => {
    return elections.filter((election) => election.status === "active")
  }

  const getEligibleElections = (voterId: string): Election[] => {
    const voter = voterId === currentVoter?.id ? currentVoter : null
    if (!voter) return []

    return getActiveElections().filter((election) => {
      // University level elections are visible to all voters
      if (election.organizationLevel === "university") {
        return true
      }

      // Organization level elections are only visible to members
      if (election.organizationLevel === "organization") {
        return voter.organizationMemberships.includes(election.organizationId)
      }

      return false
    })
  }

  const getOrganizationById = (id: string): Organization | undefined => {
    return organizations.find((org) => org.id === id)
  }

  const recordVote = (electionId: string, voterId: string) => {
    if (currentVoter && currentVoter.id === voterId) {
      setCurrentVoter({
        ...currentVoter,
        hasVoted: [...currentVoter.hasVoted, electionId],
      })
    }
  }

  return (
    <ElectionContext.Provider
      value={{
        elections,
        organizations,
        currentElection,
        currentVoter,
        candidates,
        positions,
        addElection,
        updateElection,
        deleteElection,
        setCurrentElection,
        setCurrentVoter,
        addCandidate,
        updateCandidate,
        deleteCandidate,
        updateCandidateStatus,
        getApprovedCandidates,
        getCandidatesByPosition,
        getPositionById,
        getActiveElections,
        getEligibleElections,
        getOrganizationById,
        recordVote,
      }}
    >
      {children}
    </ElectionContext.Provider>
  )
}

export function useElection() {
  const context = useContext(ElectionContext)
  if (context === undefined) {
    throw new Error("useElection must be used within an ElectionProvider")
  }
  return context
}
