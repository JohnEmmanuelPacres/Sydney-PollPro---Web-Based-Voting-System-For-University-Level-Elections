"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Calendar, Clock } from "lucide-react"

interface BasicInfoSectionProps {
  election: {
    name: string
    description: string
  }
  onChange: (field: string, value: string) => void
}

export function BasicInfoSection({ election, onChange }: BasicInfoSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-red-900 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Basic Election Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="election-name">Election Name</Label>
          <Input
            id="election-name"
            value={election.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="e.g., Student Government Elections 2024"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="election-description">Election Description</Label>
          <Textarea
            id="election-description"
            value={election.description}
            onChange={(e) => onChange("description", e.target.value)}
            placeholder="Describe the purpose and scope of this election..."
            rows={4}
            className="mt-1"
          />
        </div>
      </CardContent>
    </Card>
  )
}

interface ScheduleSectionProps {
  election: {
    startDate: string
    startTime: string
    endDate: string
    endTime: string
  }
  onChange: (field: string, value: string) => void
}

export function ScheduleSection({ election, onChange }: ScheduleSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-red-900 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Election Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 text-blue-800">
            <Clock className="w-4 h-4" />
            <span className="font-semibold">Timezone Information</span>
          </div>
          <p className="text-blue-700 mt-1 text-sm">
            All times will be saved in Singapore timezone (UTC+8). Please ensure you select the correct local time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-red-900">Voting Opens</h3>
            <div>
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={election.startDate}
                onChange={(e) => onChange("startDate", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="start-time">Start Time (SGT)</Label>
              <Input
                id="start-time"
                type="time"
                value={election.startTime}
                onChange={(e) => onChange("startTime", e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-red-900">Voting Closes</h3>
            <div>
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={election.endDate}
                onChange={(e) => onChange("endDate", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="end-time">End Time (SGT)</Label>
              <Input
                id="end-time"
                type="time"
                value={election.endTime}
                onChange={(e) => onChange("endTime", e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </div>
        {election.startDate && election.endDate && (
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-center gap-2 text-yellow-800">
              <Clock className="w-4 h-4" />
              <span className="font-semibold">Election Duration (Singapore Time)</span>
            </div>
            <p className="text-yellow-700 mt-1">
              From {election.startDate} {election.startTime} to {election.endDate} {election.endTime} (UTC+8)
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
