"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Award, Edit, Trash2, Users } from "lucide-react"

interface PositionCardProps {
  position: {
    id: string
    title: string
    description: string
    maxCandidates: number
    isRequired: boolean
    currentCandidates?: number
  }
  onEdit?: (position: any) => void
  onDelete?: (id: string) => void
  showActions?: boolean
}

export function PositionCard({ position, onEdit, onDelete, showActions = true }: PositionCardProps) {
  return (
    <Card className="border border-red-200">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-red-900" />
              <h3 className="text-lg font-semibold text-red-900">{position.title}</h3>
              {position.isRequired && <Badge className="bg-red-100 text-red-800">Required</Badge>}
            </div>
            <p className="text-gray-600 mb-3">{position.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>Max: {position.maxCandidates}</span>
              </div>
              {position.currentCandidates !== undefined && (
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>Current: {position.currentCandidates}</span>
                </div>
              )}
            </div>
          </div>
          {showActions && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit?.(position)}
                className="border-red-200 text-red-900"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="destructive" onClick={() => onDelete?.(position.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
