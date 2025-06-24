"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Settings, Eye, CheckCircle, User, Award, Users } from "lucide-react"

// Import custom components
import { ElectionTabs } from "../../../components/CreateElectionComponents/election-tabs"
import { BasicInfoSection, ScheduleSection } from "../../../components/CreateElectionComponents/election-form-sections"
import { PositionCard } from "../../../components/CreateElectionComponents/position-card"
import { CandidateCard } from "../../../components/CreateElectionComponents/candidate-card"
import { CandidateDetailModal } from "../../../components/CreateElectionComponents/candidate-detail-modal"
import { EmptyState } from "../../../components/CreateElectionComponents/empty-state"
import AdminHeader from "../../../components/AdminHeader"

interface Position {
  id: string
  title: string
  description: string
  maxCandidates: number
  isRequired: boolean
}

interface Candidate {
  id: string
  name: string
  email: string
  positionId: string
  status: "pending" | "approved" | "disqualified"
  credentials: string
  course: string
  year: string
  platform: string
  detailedCredentials?: string
  achievements?: string[]
  experience?: string[]
}

interface Election {
  name: string
  description: string
  startDate: string
  startTime: string
  endDate: string
  endTime: string
  positions: Position[]
  candidates: Candidate[]
  settings: {
    allowMultipleVotes: boolean
    requireVerification: boolean
    showResults: boolean
    allowAbstain: boolean
    eligibleYears: string[]
    eligibleCourses: string[]
  }
}

const defaultPositions: Position[] = [
  {
    id: "1",
    title: "President",
    description: "Chief executive of the student body",
    maxCandidates: 5,
    isRequired: true,
  },
  {
    id: "2",
    title: "Vice President",
    description: "Second in command and legislative leader",
    maxCandidates: 5,
    isRequired: true,
  },
  {
    id: "3",
    title: "Secretary",
    description: "Records keeper and communications officer",
    maxCandidates: 3,
    isRequired: true,
  },
  {
    id: "4",
    title: "Treasurer",
    description: "Financial officer and budget manager",
    maxCandidates: 3,
    isRequired: true,
  },
]

const yearLevels = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Graduate"]
const courses = [
  "Computer Science",
  "Business Administration",
  "Engineering",
  "Education",
  "Liberal Arts",
  "Nursing",
  "Medicine",
  "Law",
  "Architecture",
]

export default function CreateElectionPage() {
  const [election, setElection] = useState<Election>({
    name: "",
    description: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    positions: defaultPositions,
    candidates: [],
    settings: {
      allowMultipleVotes: false,
      requireVerification: true,
      showResults: false,
      allowAbstain: true,
      eligibleYears: [],
      eligibleCourses: [],
    },
  })

  const [activeTab, setActiveTab] = useState<
    "basic" | "schedule" | "positions" | "candidates" | "settings" | "preview"
  >("basic")
  const [isAddPositionOpen, setIsAddPositionOpen] = useState(false)
  const [isAddCandidateOpen, setIsAddCandidateOpen] = useState(false)
  const [detailViewCandidate, setDetailViewCandidate] = useState<Candidate | null>(null)
  const [newPosition, setNewPosition] = useState<Partial<Position>>({
    title: "",
    description: "",
    maxCandidates: 3,
    isRequired: false,
  })
  const [newCandidate, setNewCandidate] = useState<Partial<Candidate>>({
    name: "",
    email: "",
    positionId: "",
    credentials: "",
    course: "",
    year: "",
    platform: "",
    status: "pending",
  })

  const handleElectionChange = (field: string, value: string) => {
    setElection((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddPosition = () => {
    if (newPosition.title && newPosition.description) {
      const position: Position = {
        id: Date.now().toString(),
        title: newPosition.title!,
        description: newPosition.description!,
        maxCandidates: newPosition.maxCandidates || 3,
        isRequired: newPosition.isRequired || false,
      }
      setElection((prev) => ({
        ...prev,
        positions: [...prev.positions, position],
      }))
      setNewPosition({ title: "", description: "", maxCandidates: 3, isRequired: false })
      setIsAddPositionOpen(false)
    }
  }

  const handleAddCandidate = () => {
    if (newCandidate.name && newCandidate.email && newCandidate.positionId) {
      const candidate: Candidate = {
        id: Date.now().toString(),
        name: newCandidate.name!,
        email: newCandidate.email!,
        positionId: newCandidate.positionId!,
        status: "pending",
        credentials: newCandidate.credentials || "",
        course: newCandidate.course || "",
        year: newCandidate.year || "",
        platform: newCandidate.platform || "",
      }
      setElection((prev) => ({
        ...prev,
        candidates: [...prev.candidates, candidate],
      }))
      setNewCandidate({
        name: "",
        email: "",
        positionId: "",
        credentials: "",
        course: "",
        year: "",
        platform: "",
        status: "pending",
      })
      setIsAddCandidateOpen(false)
    }
  }

  const handleDeletePosition = (positionId: string) => {
    setElection((prev) => ({
      ...prev,
      positions: prev.positions.filter((p) => p.id !== positionId),
      candidates: prev.candidates.filter((c) => c.positionId !== positionId),
    }))
  }

  const handleDeleteCandidate = (candidateId: string) => {
    setElection((prev) => ({
      ...prev,
      candidates: prev.candidates.filter((c) => c.id !== candidateId),
    }))
  }

  const handleStatusChange = (candidateId: string, newStatus: "approved" | "disqualified") => {
    setElection((prev) => ({
      ...prev,
      candidates: prev.candidates.map((c) => (c.id === candidateId ? { ...c, status: newStatus } : c)),
    }))
  }

  const handleCreateElection = () => {
    console.log("Creating election:", election)
    alert("Election created successfully!")
  }

  const getPositionCandidates = (positionId: string) => {
    return election.candidates.filter((c) => c.positionId === positionId)
  }

  const getPositionById = (positionId: string) => {
    return election.positions.find((p) => p.id === positionId)
  }

  return (
    <div className="min-h-screen bg-[#52100D]">
        <header className="fixed top-0 left-0 right-0 z-50">
            <AdminHeader />
        </header>
        {/* Semantic Main Content */}
        <main className="pt-32"> {/* Adjust based on header height */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold">Create New Election</h1>
                <p className="text-red-100 mt-1">Set up a new election with positions, candidates, and voting rules</p>
            </div>
            <div className="max-w-7xl mx-auto p-6">
                {/* Navigation Tabs */}
                <ElectionTabs
                activeTab={activeTab}
                onTabChange={(tab: string) => setActiveTab(tab as typeof activeTab)}
                />
                {/* Basic Information Tab */}
                {activeTab === "basic" && <BasicInfoSection election={election} onChange={handleElectionChange} />}

                {/* Schedule Tab */}
                {activeTab === "schedule" && <ScheduleSection election={election} onChange={handleElectionChange} />}

                {/* Positions Tab */}
                {activeTab === "positions" && (
                <Card>
                    <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-red-900 flex items-center gap-2">
                        <Award className="w-5 h-5" />
                        Election Positions
                        </CardTitle>
                        <Dialog open={isAddPositionOpen} onOpenChange={setIsAddPositionOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-yellow-600 hover:bg-yellow-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Position
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                            <DialogTitle className="text-red-900">Add New Position</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                            <div>
                                <Label htmlFor="position-title">Position Title</Label>
                                <Input
                                id="position-title"
                                value={newPosition.title || ""}
                                onChange={(e) => setNewPosition((prev) => ({ ...prev, title: e.target.value }))}
                                placeholder="e.g., President"
                                />
                            </div>
                            <div>
                                <Label htmlFor="position-description">Description</Label>
                                <Textarea
                                id="position-description"
                                value={newPosition.description || ""}
                                onChange={(e) => setNewPosition((prev) => ({ ...prev, description: e.target.value }))}
                                placeholder="Describe the role and responsibilities..."
                                rows={3}
                                />
                            </div>
                            <div>
                                <Label htmlFor="max-candidates">Maximum Candidates</Label>
                                <Input
                                id="max-candidates"
                                type="number"
                                min="1"
                                max="10"
                                value={newPosition.maxCandidates || 3}
                                onChange={(e) =>
                                    setNewPosition((prev) => ({ ...prev, maxCandidates: Number.parseInt(e.target.value) }))
                                }
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                id="is-required"
                                checked={newPosition.isRequired || false}
                                onCheckedChange={(checked) =>
                                    setNewPosition((prev) => ({ ...prev, isRequired: checked as boolean }))
                                }
                                />
                                <Label htmlFor="is-required">Required position (voters must vote for this)</Label>
                            </div>
                            <Button onClick={handleAddPosition} className="w-full bg-red-900 hover:bg-red-800">
                                Add Position
                            </Button>
                            </div>
                        </DialogContent>
                        </Dialog>
                    </div>
                    </CardHeader>
                    <CardContent>
                    <div className="space-y-4">
                        {election.positions.map((position) => (
                        <PositionCard
                            key={position.id}
                            position={{
                            ...position,
                            currentCandidates: getPositionCandidates(position.id).length,
                            }}
                            onDelete={handleDeletePosition}
                        />
                        ))}
                    </div>
                    </CardContent>
                </Card>
                )}

                {/* Candidates Tab */}
                {activeTab === "candidates" && (
                <Card>
                    <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-red-900 flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Candidates Management
                        </CardTitle>
                        <Dialog open={isAddCandidateOpen} onOpenChange={setIsAddCandidateOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-yellow-600 hover:bg-yellow-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Candidate
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                            <DialogTitle className="text-red-900">Add New Candidate</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                            <div>
                                <Label htmlFor="candidate-name">Full Name</Label>
                                <Input
                                id="candidate-name"
                                value={newCandidate.name || ""}
                                onChange={(e) => setNewCandidate((prev) => ({ ...prev, name: e.target.value }))}
                                placeholder="Enter full name"
                                />
                            </div>
                            <div>
                                <Label htmlFor="candidate-email">Email</Label>
                                <Input
                                id="candidate-email"
                                type="email"
                                value={newCandidate.email || ""}
                                onChange={(e) => setNewCandidate((prev) => ({ ...prev, email: e.target.value }))}
                                placeholder="Enter email address"
                                />
                            </div>
                            <div>
                                <Label htmlFor="candidate-position">Position</Label>
                                <Select onValueChange={(value) => setNewCandidate((prev) => ({ ...prev, positionId: value }))}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select position" />
                                </SelectTrigger>
                                <SelectContent>
                                    {election.positions.map((position) => (
                                    <SelectItem key={position.id} value={position.id}>
                                        {position.title}
                                    </SelectItem>
                                    ))}
                                </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="candidate-course">Course</Label>
                                <Select onValueChange={(value) => setNewCandidate((prev) => ({ ...prev, course: value }))}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select course" />
                                </SelectTrigger>
                                <SelectContent>
                                    {courses.map((course) => (
                                    <SelectItem key={course} value={course}>
                                        {course}
                                    </SelectItem>
                                    ))}
                                </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="candidate-year">Year Level</Label>
                                <Select onValueChange={(value) => setNewCandidate((prev) => ({ ...prev, year: value }))}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select year" />
                                </SelectTrigger>
                                <SelectContent>
                                    {yearLevels.map((year) => (
                                    <SelectItem key={year} value={year}>
                                        {year}
                                    </SelectItem>
                                    ))}
                                </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="candidate-credentials">Credentials</Label>
                                <Textarea
                                id="candidate-credentials"
                                value={newCandidate.credentials || ""}
                                onChange={(e) => setNewCandidate((prev) => ({ ...prev, credentials: e.target.value }))}
                                placeholder="Enter candidate credentials..."
                                rows={3}
                                />
                            </div>
                            <div>
                                <Label htmlFor="candidate-platform">Platform Summary</Label>
                                <Textarea
                                id="candidate-platform"
                                value={newCandidate.platform || ""}
                                onChange={(e) => setNewCandidate((prev) => ({ ...prev, platform: e.target.value }))}
                                placeholder="Enter candidate's platform..."
                                rows={4}
                                />
                            </div>
                            <Button onClick={handleAddCandidate} className="w-full bg-red-900 hover:bg-red-800">
                                Add Candidate
                            </Button>
                            </div>
                        </DialogContent>
                        </Dialog>
                    </div>
                    </CardHeader>
                    <CardContent>
                    {election.positions.map((position) => (
                        <div key={position.id} className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <h3 className="text-lg font-semibold text-red-900">{position.title}</h3>
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                            {getPositionCandidates(position.id).length} candidates
                            </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {getPositionCandidates(position.id).map((candidate) => (
                            <CandidateCard
                                key={candidate.id}
                                candidate={{
                                ...candidate,
                                position: position.title,
                                }}
                                onDelete={handleDeleteCandidate}
                                onApprove={(id) => handleStatusChange(id, "approved")}
                                onDisqualify={(id) => handleStatusChange(id, "disqualified")}
                                onViewDetails={setDetailViewCandidate}
                            />
                            ))}
                        </div>
                        {getPositionCandidates(position.id).length === 0 && (
                            <EmptyState
                            icon={<User className="w-12 h-12" />}
                            title="No candidates yet"
                            description={`No candidates have been added for ${position.title} position.`}
                            />
                        )}
                        </div>
                    ))}
                    </CardContent>
                </Card>
                )}

                {/* Settings Tab */}
                {activeTab === "settings" && (
                <Card>
                    <CardHeader>
                    <CardTitle className="text-red-900 flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        Election Settings
                    </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-red-900">Voting Rules</h3>
                        <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                            <Label htmlFor="multiple-votes">Allow Multiple Votes per Position</Label>
                            <p className="text-sm text-gray-600">
                                Allow voters to select multiple candidates for each position
                            </p>
                            </div>
                            <Switch
                            id="multiple-votes"
                            checked={election.settings.allowMultipleVotes}
                            onCheckedChange={(checked) =>
                                setElection((prev) => ({
                                ...prev,
                                settings: { ...prev.settings, allowMultipleVotes: checked },
                                }))
                            }
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                            <Label htmlFor="require-verification">Require Email Verification</Label>
                            <p className="text-sm text-gray-600">Voters must verify their email before voting</p>
                            </div>
                            <Switch
                            id="require-verification"
                            checked={election.settings.requireVerification}
                            onCheckedChange={(checked) =>
                                setElection((prev) => ({
                                ...prev,
                                settings: { ...prev.settings, requireVerification: checked },
                                }))
                            }
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                            <Label htmlFor="show-results">Show Live Results</Label>
                            <p className="text-sm text-gray-600">Display voting results in real-time</p>
                            </div>
                            <Switch
                            id="show-results"
                            checked={election.settings.showResults}
                            onCheckedChange={(checked) =>
                                setElection((prev) => ({
                                ...prev,
                                settings: { ...prev.settings, showResults: checked },
                                }))
                            }
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                            <Label htmlFor="allow-abstain">Allow Abstain Option</Label>
                            <p className="text-sm text-gray-600">Voters can choose to abstain from voting on positions</p>
                            </div>
                            <Switch
                            id="allow-abstain"
                            checked={election.settings.allowAbstain}
                            onCheckedChange={(checked) =>
                                setElection((prev) => ({
                                ...prev,
                                settings: { ...prev.settings, allowAbstain: checked },
                                }))
                            }
                            />
                        </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-red-900">Voter Eligibility</h3>
                        <div>
                        <Label>Eligible Year Levels</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                            {yearLevels.map((year) => (
                            <div key={year} className="flex items-center space-x-2">
                                <Checkbox
                                id={`year-${year}`}
                                checked={election.settings.eligibleYears.includes(year)}
                                onCheckedChange={(checked) => {
                                    if (checked) {
                                    setElection((prev) => ({
                                        ...prev,
                                        settings: {
                                        ...prev.settings,
                                        eligibleYears: [...prev.settings.eligibleYears, year],
                                        },
                                    }))
                                    } else {
                                    setElection((prev) => ({
                                        ...prev,
                                        settings: {
                                        ...prev.settings,
                                        eligibleYears: prev.settings.eligibleYears.filter((y) => y !== year),
                                        },
                                    }))
                                    }
                                }}
                                />
                                <Label htmlFor={`year-${year}`} className="text-sm">
                                {year}
                                </Label>
                            </div>
                            ))}
                        </div>
                        </div>
                        <div>
                        <Label>Eligible Courses</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                            {courses.map((course) => (
                            <div key={course} className="flex items-center space-x-2">
                                <Checkbox
                                id={`course-${course}`}
                                checked={election.settings.eligibleCourses.includes(course)}
                                onCheckedChange={(checked) => {
                                    if (checked) {
                                    setElection((prev) => ({
                                        ...prev,
                                        settings: {
                                        ...prev.settings,
                                        eligibleCourses: [...prev.settings.eligibleCourses, course],
                                        },
                                    }))
                                    } else {
                                    setElection((prev) => ({
                                        ...prev,
                                        settings: {
                                        ...prev.settings,
                                        eligibleCourses: prev.settings.eligibleCourses.filter((c) => c !== course),
                                        },
                                    }))
                                    }
                                }}
                                />
                                <Label htmlFor={`course-${course}`} className="text-sm">
                                {course}
                                </Label>
                            </div>
                            ))}
                        </div>
                        </div>
                    </div>
                    </CardContent>
                </Card>
                )}

                {/* Preview Tab */}
                {activeTab === "preview" && (
                <Card>
                    <CardHeader>
                    <CardTitle className="text-red-900 flex items-center gap-2">
                        <Eye className="w-5 h-5" />
                        Election Preview
                    </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                    <div className="bg-gradient-to-r from-red-50 to-yellow-50 p-6 rounded-lg border border-red-200">
                        <h2 className="text-2xl font-bold text-red-900 mb-2">{election.name || "Untitled Election"}</h2>
                        <p className="text-gray-700 mb-4">{election.description || "No description provided"}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-semibold text-red-900">Voting Opens:</span>
                            <p>
                            {election.startDate} {election.startTime}
                            </p>
                        </div>
                        <div>
                            <span className="font-semibold text-red-900">Voting Closes:</span>
                            <p>
                            {election.endDate} {election.endTime}
                            </p>
                        </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-red-900 mb-4">Positions & Candidates</h3>
                        <div className="space-y-4">
                        {election.positions.map((position) => (
                            <Card key={position.id} className="border border-red-200">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-red-900">{position.title}</h4>
                                <Badge className="bg-yellow-100 text-yellow-800">
                                    {getPositionCandidates(position.id).length} candidates
                                </Badge>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">{position.description}</p>
                                <div className="flex flex-wrap gap-2">
                                {getPositionCandidates(position.id).map((candidate) => (
                                    <Badge key={candidate.id} variant="outline" className="bg-white">
                                    {candidate.name}
                                    </Badge>
                                ))}
                                </div>
                            </CardContent>
                            </Card>
                        ))}
                        </div>
                    </div>

                    <div className="flex justify-center pt-6">
                        <Button
                        onClick={handleCreateElection}
                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
                        disabled={
                            !election.name || !election.startDate || !election.endDate || election.positions.length === 0
                        }
                        >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Create Election
                        </Button>
                    </div>
                    </CardContent>
                </Card>
                )}

                {/* Candidate Detail Modal */}
                <CandidateDetailModal
                candidate={detailViewCandidate}
                isOpen={!!detailViewCandidate}
                onClose={() => setDetailViewCandidate(null)}
                onApprove={(id) => handleStatusChange(id, "approved")}
                onDisqualify={(id) => handleStatusChange(id, "disqualified")}
                />
            </div>
        </main>
    </div>
  )
}
