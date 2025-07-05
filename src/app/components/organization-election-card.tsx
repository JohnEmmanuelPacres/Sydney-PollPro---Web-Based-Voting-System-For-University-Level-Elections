"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Vote, Eye, Calendar, Clock, Users, Building, TrendingUp, CheckCircle, AlertCircle } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { supabase } from '@/utils/supabaseClient';
import ApplyCandidateModal from './ApplyCandidateModal';

// Define Position type locally
interface Position {
  id: string;
  title: string;
  description?: string;
  maxCandidates?: number;
  maxWinners?: number;
  isRequired?: boolean;
}

interface OrganizationElectionCardProps {
  election: {
    id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    organizationId: string;
    totalVotes?: number;
    voterTurnout?: number;
    candidates: any[];
    positions: Position[];
  };
  organization:
    | {
        name: string;
      }
    | undefined;
  hasVoted: boolean;
  onVoteNow: (electionId: string) => void;
  onViewDetails: (election: any) => void;
}

export function OrganizationElectionCard({
  election,
  organization,
  hasVoted,
  onVoteNow,
  onViewDetails,
}: OrganizationElectionCardProps) {
  const [votersCount, setVotersCount] = useState<string | null>(null);
  const [votesCount, setVotesCount] = useState<string | null>(null);
  const [participation, setParticipation] = useState<string | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [applicationStatus, setApplicationStatus] = useState<'none' | 'pending' | 'approved' | 'rejected'>('none');
  const justSubmitted = useRef(false);
  const [statusLoading, setStatusLoading] = useState(true);

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

  useEffect(() => {
    async function fetchUserAndEmail() {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
      if (user?.id) {
        const { data } = await supabase
          .from('voter_profiles')
          .select('email')
          .eq('id', user.id)
          .single();
        if (data?.email) setUserEmail(data.email);
      }
    }
    fetchUserAndEmail();
  }, []);

  // Fetch application status per election
  useEffect(() => {
    if (!userEmail || !election.id) return;
    if (justSubmitted.current) return;
    setStatusLoading(true);
    async function fetchStatus() {
      const emailToCheck = userEmail!.toLowerCase();
      console.log('Checking candidate status for:', emailToCheck, election.id);
      const { data } = await supabase
        .from('candidates')
        .select('status')
        .eq('election_id', election.id)
        .eq('email', emailToCheck)
        .maybeSingle();
      console.log('Candidate status result:', data);
      if (!data) setApplicationStatus('none');
      else if (data.status === 'pending') setApplicationStatus('pending');
      else if (data.status === 'approved') setApplicationStatus('approved');
      else setApplicationStatus('rejected');
      setStatusLoading(false);
    }
    fetchStatus();
  }, [userEmail, election.id, showApplyModal]);

  const getElectionStatusColor = (election: any) => {
    const now = new Date()
    const startDate = new Date(election.startDate)
    const endDate = new Date(election.endDate)

    if (now < startDate) return "bg-blue-100 text-blue-800 border-blue-200"
    if (now > endDate) return "bg-gray-100 text-gray-800 border-gray-200"
    return "bg-green-100 text-green-800 border-green-200"
  }

  const getElectionStatus = () => {
    const now = new Date()
    const startDate = new Date(election.startDate)
    const endDate = new Date(election.endDate)

    if (now < startDate) return "Upcoming"
    if (now > endDate) return "Ended"
    return "Active"
  }

  const status = getElectionStatus()
  const approvedCandidates = election.candidates.filter((c: any) => c.status === "approved")

  return (
    <Card className="border-2 border-red-100 hover:border-yellow-700 transition-all duration-200 hover:shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
              <Building className="w-5 h-5 text-yellow-600" />
              <Badge variant="outline" className="text-xs">
                Organization
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
          {statusLoading && (
            <Button disabled className="flex-1 bg-gray-300 text-gray-500 cursor-not-allowed">Checking...</Button>
          )}
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
          {status === "Upcoming" && userId && applicationStatus === 'none' && !statusLoading && (
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setShowApplyModal(true)}>
              Apply
            </Button>
          )}
          {status === "Upcoming" && userId && applicationStatus === 'pending' && !statusLoading && (
            <Button disabled className="flex-1 bg-yellow-400 text-white cursor-not-allowed">
              Pending
            </Button>
          )}
          {status === "Upcoming" && userId && applicationStatus === 'approved' && !statusLoading && (
            <Button disabled className="flex-1 bg-green-600 text-white cursor-not-allowed">
              Accepted
            </Button>
          )}
          {status === "Upcoming" && userId && applicationStatus === 'rejected' && !statusLoading && (
            <Button disabled className="flex-1 bg-red-600 text-white cursor-not-allowed">
              Application Rejected
            </Button>
          )}
          {status === "Upcoming" && !userId && (
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
        {userId && userEmail && (
          <ApplyCandidateModal
            open={showApplyModal}
            onClose={() => setShowApplyModal(false)}
            electionId={election.id}
            positions={election.positions || []}
            userId={userId}
            onApplicationSubmitted={() => {
              setApplicationStatus('pending');
              justSubmitted.current = true;
              setTimeout(() => { justSubmitted.current = false; }, 1500); // allow DB check after 1.5s
            }}
          />
        )}
      </CardContent>
    </Card>
  )
}
