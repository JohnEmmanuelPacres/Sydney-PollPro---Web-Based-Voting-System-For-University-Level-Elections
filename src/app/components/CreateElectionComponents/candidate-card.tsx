"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, FileText, Edit, Trash2, Check, X } from "lucide-react"

interface CandidateCardProps {
  candidate: {
    id: string
    name: string
    email: string
    position: string
    status: "pending" | "approved" | "disqualified"
    credentials: string
    course: string
    year: string
    platform?: string
    picture_url?: string
    qualifications_url?: string
  }
  onEdit?: (candidate: any) => void
  onDelete?: (id: string) => void
  onApprove?: (id: string) => void
  onDisqualify?: (id: string) => void
  onViewDetails?: (candidate: any) => void
  showActions?: boolean
}

export function CandidateCard({
  candidate,
  onEdit,
  onDelete,
  onApprove,
  onDisqualify,
  onViewDetails,
  showActions = true,
}: CandidateCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200"
      case "disqualified":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
    }
  }

  return (
    <Card className="border-2 border-red-100 hover:border-red-200 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-900 rounded-full flex items-center justify-center overflow-hidden">
              {candidate.picture_url ? (
                <img src={candidate.picture_url} alt={candidate.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <CardTitle className="text-lg text-red-900">{candidate.name}</CardTitle>
              <p className="text-sm text-gray-600">{candidate.email}</p>
            </div>
          </div>
          <Badge className={getStatusColor(candidate.status)}>{candidate.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm">
          <p>
            <span className="font-semibold text-red-900">Position:</span> {candidate.position}
          </p>
          <p>
            <span className="font-semibold text-red-900">Course:</span> {candidate.course}
          </p>
          <p>
            <span className="font-semibold text-red-900">Year:</span> {candidate.year}
          </p>
        </div>

        {candidate.credentials && (
          <div
            className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 cursor-pointer hover:bg-yellow-100 transition-colors"
            onClick={() => onViewDetails?.(candidate)}
          >
            <div className="flex items-start gap-2">
              <FileText className="w-4 h-4 text-yellow-700 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-yellow-800">Credentials</p>
                <p className="text-sm text-yellow-700 line-clamp-2">{candidate.credentials}</p>
                <p className="text-xs text-yellow-600 mt-1 font-medium">Click to view details →</p>
              </div>
            </div>
          </div>
        )}

        {showActions && (
          <div className="flex flex-wrap gap-2 pt-2">
            {candidate.status === "pending" && (
              <>
                <Button
                  size="sm"
                  onClick={() => onApprove?.(candidate.id)}
                  className="bg-green-600 hover:bg-green-700 text-white flex-1 sm:flex-none"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDisqualify?.(candidate.id)}
                  className="flex-1 sm:flex-none"
                >
                  <X className="w-4 h-4 mr-1" />
                  Disqualify
                </Button>
              </>
            )}

            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit?.(candidate)}
              className="border-red-200 text-red-900 hover:bg-red-50"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>

            <Button size="sm" variant="destructive" onClick={() => onDelete?.(candidate.id)}>
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
