"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Vote, Eye, Calendar, Clock, Users, University, TrendingUp, CheckCircle, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"

interface UniversityElectionCardProps {
  election: {
    id: string
    name: string
    description: string
    startDate: string
    //startTime: string
    endDate: string
    //endTime: string
    organizationId: string
    totalVotes?: number
    voterTurnout?: number
    candidates: any[]
  }
  organization:
    | {
        name: string
      }
    | undefined
  hasVoted: boolean
  onVoteNow: (electionId: string) => void
  onViewDetails: (election: any) => void
}

export function UniversityElectionCard({
  election,
  organization,
  hasVoted,
  onVoteNow,
  onViewDetails,
}: UniversityElectionCardProps) {
  const [votersCount, setVotersCount] = useState<string | null>(null);
  const [votesCount, setVotesCount] = useState<string | null>(null);
  const [participation, setParticipation] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      const res = await fetch(`/api/global-stats?electionId=${election.id}`);
      const data = await res.json();
      setVotersCount(data.voters !== undefined ? data.voters.toLocaleString() : 'N/A');
      setVotesCount(data.votes !== undefined ? data.votes.toLocaleString() : 'N/A');
      setParticipation(data.participation !== undefined ? `${data.participation}%` : 'N/A');
    }
    fetchStats();
  }, []);


  const getElectionStatusColor = (election: any) => {
    const now = new Date()
    const startDate = new Date(`${election.startDate}T${election.startTime}`)
    const endDate = new Date(`${election.endDate}T${election.endTime}`)

    if (now < startDate) return "bg-blue-100 text-blue-800 border-blue-200"
    if (now > endDate) return "bg-gray-100 text-gray-800 border-gray-200"
    return "bg-green-100 text-green-800 border-green-200"
  }

  const getElectionStatus = (election: any) => {
    const now = new Date()
    const startDate = new Date(`${election.startDate}T${election.startTime}`)
    const endDate = new Date(`${election.endDate}T${election.endTime}`)

    if (now < startDate) return "Upcoming"
    if (now > endDate) return "Ended"
    return "Active"
  }

  const status = getElectionStatus(election)
  const approvedCandidates = election.candidates.filter((c: any) => c.status === "approved")

  return (
    <Card className="border-2 border-red-100 hover:border-yellow-700 transition-all duration-200 hover:shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <University className="w-5 h-5 text-red-600" />
              <Badge variant="outline" className="text-xs">
                University-wide
              </Badge>
            </div>
            <CardTitle className="text-xl text-red-900 mb-1">{election.name}</CardTitle>
            <p className="text-sm text-gray-600 mb-2">{organization?.name}</p>
            <p className="text-sm text-gray-700 line-clamp-2">{election.description}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className={getElectionStatusColor(election)}>{status}</Badge>
            {hasVoted && (
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <CheckCircle className="w-3 h-3 mr-1" />
                Voted
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Election Timeline */}
        <div className="bg-red-50 p-3 rounded-lg border border-red-200">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-red-600" />
            <span className="text-sm font-semibold text-red-800">Voting Period</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs text-red-700">
            <div>
              <p className="font-medium">Starts</p>
              <p>
                {`${election.startDate}`}
              </p>
            </div>
            <div>
              <p className="font-medium">Ends</p>
              <p>
                {`${election.endDate}`}
              </p>
            </div>
          </div>
        </div>

        {/* Election Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 text-center">
            <Users className="w-5 h-5 text-yellow-600 mx-auto mb-1" />
            <p className="text-lg font-bold text-yellow-900">{votersCount}</p>
            <p className="text-xs text-yellow-700">Eligible Users</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-center">
            <Vote className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <p className="text-lg font-bold text-blue-900">{votesCount}</p>
            <p className="text-xs text-blue-700">Votes Cast</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg border border-green-200 text-center">
            <TrendingUp className="w-5 h-5 text-green-600 mx-auto mb-1" />
            <p className="text-lg font-bold text-green-900">{participation}</p>
            <p className="text-xs text-green-700">Participation</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {status === "Active" && !hasVoted && (
            <Button
              onClick={() => onVoteNow(election.id)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <Vote className="w-4 h-4 mr-2" />
              Vote Now
            </Button>
          )}
          {status === "Active" && hasVoted && (
            <Button disabled className="flex-1 bg-gray-400 text-white cursor-not-allowed">
              <CheckCircle className="w-4 h-4 mr-2" />
              Already Voted
            </Button>
          )}
          {status === "Upcoming" && (
            <Button disabled className="flex-1 bg-blue-400 text-white cursor-not-allowed">
              <Clock className="w-4 h-4 mr-2" />
              Voting Opens Soon
            </Button>
          )}
          {status === "Ended" && (
            <Button disabled className="flex-1 bg-gray-400 text-white cursor-not-allowed">
              <AlertCircle className="w-4 h-4 mr-2" />
              Voting Ended
            </Button>
          )}
          <Button
            onClick={() => onViewDetails(election)}
            variant="outline"
            className="border-red-200 text-red-900 hover:bg-red-50"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
