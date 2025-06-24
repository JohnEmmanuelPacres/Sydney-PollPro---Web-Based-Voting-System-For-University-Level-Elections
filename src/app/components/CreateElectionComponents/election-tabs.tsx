"use client"

import { Button } from "@/components/ui/button"
import { FileText, Calendar, Award, Users, Settings, Eye } from "lucide-react"

interface ElectionTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const tabs = [
  { id: "basic", label: "Basic Info", icon: FileText },
  { id: "schedule", label: "Schedule", icon: Calendar },
  { id: "positions", label: "Positions", icon: Award },
  { id: "candidates", label: "Candidates", icon: Users },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "preview", label: "Preview", icon: Eye },
]

export function ElectionTabs({ activeTab, onTabChange }: ElectionTabsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6 bg-white p-2 rounded-lg shadow-sm border border-red-100">
      {tabs.map((tab) => {
        const Icon = tab.icon
        return (
          <Button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            variant={activeTab === tab.id ? "default" : "ghost"}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === tab.id ? "bg-red-900 text-white" : "text-red-900 hover:bg-red-50"
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </Button>
        )
      })}
    </div>
  )
}
