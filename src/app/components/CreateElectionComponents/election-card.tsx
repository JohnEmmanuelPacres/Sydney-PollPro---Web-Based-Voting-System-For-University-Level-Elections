"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Users, Settings, Eye, Edit, Trash2 } from "lucide-react"

interface ElectionCardProps {
  election: {
    id: string
    name: string
    description: string
    startDate: string
    endDate: string
    status: "draft" | "active" | "completed"
    totalCandidates: number
    totalPositions: number
  }
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onView?: (id: string) => void
}

export function ElectionCard({ election, onEdit, onDelete, onView }: ElectionCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
    }
  }

  return (
    <Card className="border-2 border-red-100 hover:border-red-200 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg text-red-900 mb-1">{election.name}</CardTitle>
            <p className="text-sm text-gray-600 line-clamp-2">{election.description}</p>
          </div>
          <Badge className={getStatusColor(election.status)}>{election.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-red-600" />
            <div>
              <p className="font-medium text-red-900">Start Date</p>
              <p className="text-gray-600">{election.startDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-red-600" />
            <div>
              <p className="font-medium text-red-900">End Date</p>
              <p className="text-gray-600">{election.endDate}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-yellow-600" />
              <span className="text-gray-600">{election.totalCandidates} candidates</span>
            </div>
            <div className="flex items-center gap-1">
              <Settings className="w-4 h-4 text-yellow-600" />
              <span className="text-gray-600">{election.totalPositions} positions</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-2 border-t border-red-100">
          <Button size="sm" variant="outline" onClick={() => onView?.(election.id)} className="flex-1">
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>
          <Button size="sm" variant="outline" onClick={() => onEdit?.(election.id)} className="flex-1">
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button size="sm" variant="destructive" onClick={() => onDelete?.(election.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
