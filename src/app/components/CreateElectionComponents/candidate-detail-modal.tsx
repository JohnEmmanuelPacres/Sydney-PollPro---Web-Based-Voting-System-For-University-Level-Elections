"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, Award, FileText, Check, X, Edit } from "lucide-react"
import { useRef, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { createPortal } from 'react-dom';

interface CandidateDetailModalProps {
  candidate: {
    id: string
    name: string
    email: string
    positionId: string
    positionName: string
    status: "pending" | "approved" | "disqualified"
    credentials: string
    detailedCredentials?: string
    course: string
    year: string
    platform?: string
    achievements?: string[]
    experience?: string[]
    picture_url?: string
    qualifications_url?: string
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

  console.log('Candidate in modal:', candidate);

  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(candidate.picture_url || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showQualificationsPreview, setShowQualificationsPreview] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const filePath = `candidates/candidate-${candidate.id}-${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage.from('election').upload(filePath, file, { upsert: true });
    if (error) {
      alert('Failed to upload image');
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from('election').getPublicUrl(filePath);
    setImageUrl(data.publicUrl);
    setUploading(false);
    // Optionally, update the candidate object with the new image URL
    onEdit?.({ ...candidate, picture_url: data.publicUrl });
  };

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
            <div className="w-16 h-16 bg-red-900 rounded-full flex items-center justify-center overflow-hidden">
              {imageUrl ? (
                <img src={imageUrl} alt="Candidate" className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-white" />
              )}
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl text-red-900">{candidate.name}</DialogTitle>
              <p className="text-red-600">{candidate.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-red-100 text-red-800">{candidate.positionName}</Badge>
                <Badge className={getStatusColor(candidate.status)}>{candidate.status}</Badge>
              </div>
            </div>
          </div>
          <div className="mt-2">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
              disabled={uploading}
            />
            <Button
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="mt-2"
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : (imageUrl ? 'Change Picture' : 'Upload Picture')}
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-semibold text-red-900 mb-2">Academic Information</h3>
              <p className="text-gray-700 leading-relaxed">
                <span className="font-medium">Course:</span> {candidate.course}
              </p>
              <p className="text-gray-700 leading-relaxed">
                <span className="font-medium">Year Level:</span> {candidate.year}
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">Running For</h3>
              <p className="text-lg font-semibold text-yellow-900">{candidate.positionName}</p>
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

          {/* Qualifications Section - separate box */}
          {candidate.qualifications_url && (
            <div className="bg-white p-6 rounded-lg border border-red-200 mt-4">
              <h3 className="text-xl font-bold text-red-900 mb-3 flex items-center gap-2">
                Qualifications
              </h3>
              <img
                src={candidate.qualifications_url}
                alt="Qualifications"
                className="rounded border object-contain max-h-64 max-w-full cursor-pointer hover:shadow-lg transition-shadow"
                style={{ background: "#f3f4f6" }}
                onClick={() => setShowQualificationsPreview(true)}
              />
              {showQualificationsPreview && typeof window !== 'undefined' && createPortal(
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm pointer-events-auto"
                  style={{ background: "rgba(255,255,255,0.5)" }}
                  onClick={() => setShowQualificationsPreview(false)}
                >
                  <div className="relative" onClick={e => e.stopPropagation()}>
                    <img
                      src={candidate.qualifications_url}
                      alt="Qualifications Full Preview"
                      className="max-h-[80vh] max-w-[90vw] rounded shadow-lg border-4 border-white"
                      style={{ background: "#fff" }}
                    />
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setShowQualificationsPreview(false);
                      }}
                      className="absolute top-2 right-2 z-50 pointer-events-auto bg-white bg-opacity-80 rounded-full px-3 py-1 text-red-900 font-bold text-lg shadow hover:bg-opacity-100 border border-red-200"
                      type="button"
                      aria-label="Close preview"
                    >
                      ×
                    </button>
                  </div>
                </div>,
                window.document.body
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
