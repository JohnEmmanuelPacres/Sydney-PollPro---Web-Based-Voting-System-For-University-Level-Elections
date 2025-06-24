"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, Award, FileText, Check, X, Edit } from "lucide-react"

interface CandidateDetailModalProps {
  candidate: {
    id: string
    name: string
    email: string
    positionId: string
    status: "pending" | "approved" | "disqualified"
    credentials: string
    detailedCredentials?: string
    course: string
    year: string
    platform?: string
    achievements?: string[]
    experience?: string[]
  } | null
  isOpen: boolean
  onClose: () => void
  onApprove?: (id: string) => void
  onDisqualify?: (id: string) => void
  onEdit?: (candidate: any) => void
}

export function CandidateDetailModal({
  candidate,
  isOpen,
  onClose,
  onApprove,
  onDisqualify,
  onEdit,
}: CandidateDetailModalProps) {
  if (!candidate) return null

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b border-red-100 pb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-red-900 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl text-red-900">{candidate.name}</DialogTitle>
              <p className="text-red-600">{candidate.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-red-100 text-red-800">{candidate.positionId}</Badge>
                <Badge className={getStatusColor(candidate.status)}>{candidate.status}</Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-semibold text-red-900 mb-2">Academic Information</h3>
              <p>
                <span className="font-medium">Course:</span> {candidate.course}
              </p>
              <p>
                <span className="font-medium">Year Level:</span> {candidate.year}
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">Running For</h3>
              <p className="text-lg font-semibold text-yellow-900">{candidate.positionId}</p>
            </div>
          </div>

          {/* Platform Summary */}
          {candidate.platform && (
            <div className="bg-gradient-to-r from-red-50 to-yellow-50 p-6 rounded-lg border border-red-200">
              <h3 className="text-xl font-bold text-red-900 mb-3 flex items-center gap-2">
                <Award className="w-5 h-5" />
                Platform Summary
              </h3>
              <p className="text-gray-700 leading-relaxed">{candidate.platform}</p>
            </div>
          )}

          {/* Detailed Credentials */}
          <div className="bg-white p-6 rounded-lg border border-red-200">
            <h3 className="text-xl font-bold text-red-900 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Credentials
            </h3>
            <p className="text-gray-700 leading-relaxed">{candidate.detailedCredentials || candidate.credentials}</p>
          </div>

          {/* Achievements and Experience */}
          {(candidate.achievements || candidate.experience) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {candidate.achievements && (
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <h3 className="text-lg font-bold text-green-900 mb-4">🏆 Achievements</h3>
                  <ul className="space-y-2">
                    {candidate.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-green-800">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {candidate.experience && (
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-bold text-blue-900 mb-4">💼 Experience</h3>
                  <ul className="space-y-2">
                    {candidate.experience.map((exp, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-blue-800">{exp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-red-100">
            {candidate.status === "pending" && (
              <>
                <Button
                  onClick={() => {
                    onApprove?.(candidate.id)
                    onClose()
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Approve Candidate
                </Button>
                <Button
                  onClick={() => {
                    onDisqualify?.(candidate.id)
                    onClose()
                  }}
                  variant="destructive"
                >
                  <X className="w-4 h-4 mr-2" />
                  Disqualify Candidate
                </Button>
              </>
            )}
            <Button
              onClick={() => {
                onEdit?.(candidate)
                onClose()
              }}
              variant="outline"
              className="border-red-200 text-red-900 hover:bg-red-50"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Details
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
