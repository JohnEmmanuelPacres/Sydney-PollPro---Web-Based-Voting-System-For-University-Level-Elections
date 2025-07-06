"use client"
import { useState, useEffect, useRef } from "react"
import { useAdminOrg } from '../AdminedOrgContext'; //React Context
import { useSearchParams } from 'next/navigation';
import { supabase } from "@/utils/supabaseClient"
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
import { Plus, Settings, Eye, CheckCircle, User, Award, Users, Trash2 } from "lucide-react"

// Import custom components
import { ElectionTabs } from "../../../components/CreateElectionComponents/election-tabs"
import { BasicInfoSection, ScheduleSection } from "../../../components/CreateElectionComponents/election-form-sections"
import { PositionCard } from "../../../components/CreateElectionComponents/position-card"
import { CandidateCard } from "../../../components/CreateElectionComponents/candidate-card"
import { CandidateDetailModal } from "../../../components/CreateElectionComponents/candidate-detail-modal"
import { EmptyState } from "../../../components/CreateElectionComponents/empty-state"
import { MultiSelectDropdown } from "../../../components/CreateElectionComponents/multi-select-dropdown"
import AdminHeader from "../../../components/AdminHeader"

interface Position {
  id?: string
  title: string
  description: string
  maxCandidates: number
  maxWinners?: number
  isRequired: boolean
}

interface Candidate {
  id?: string
  name: string
  email: string
  positionId: string
  status: "pending" | "approved" | "disqualified"
  credentials: string
  course: string
  year: string
  platform: string
  picture_url?: string
  detailedCredentials?: string
  achievements?: string[]
  experience?: string[]
  qualifications_url?: string
}

interface Election {
  name: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  positions: Position[];
  candidates: Candidate[];
  settings: {
    isUniLevel: boolean;
    allowAbstain: boolean;
    eligibleCourseYear: string[];
  };
}

const courseYearOptions = [
// Architecture
'BS Architecture - 1st Year',
'BS Architecture - 2nd Year',
'BS Architecture - 3rd Year',
'BS Architecture - 4th Year',
'BS Architecture - 5th Year',

// Engineering Programs
'BS Chemical Engineering - 1st Year',
'BS Chemical Engineering - 2nd Year',
'BS Chemical Engineering - 3rd Year',
'BS Chemical Engineering - 4th Year',

'BS Civil Engineering - 1st Year',
'BS Civil Engineering - 2nd Year',
'BS Civil Engineering - 3rd Year',
'BS Civil Engineering - 4th Year',

'BS Computer Engineering - 1st Year',
'BS Computer Engineering - 2nd Year',
'BS Computer Engineering - 3rd Year',
'BS Computer Engineering - 4th Year',

'BS Electrical Engineering - 1st Year',
'BS Electrical Engineering - 2nd Year',
'BS Electrical Engineering - 3rd Year',
'BS Electrical Engineering - 4th Year',

'BS Electronics Engineering - 1st Year',
'BS Electronics Engineering - 2nd Year',
'BS Electronics Engineering - 3rd Year',
'BS Electronics Engineering - 4th Year',

'BS Industrial Engineering - 1st Year',
'BS Industrial Engineering - 2nd Year',
'BS Industrial Engineering - 3rd Year',
'BS Industrial Engineering - 4th Year',

'BS Mechanical Engineering - 1st Year',
'BS Mechanical Engineering - 2nd Year',
'BS Mechanical Engineering - 3rd Year',
'BS Mechanical Engineering - 4th Year',

'BS Mechanical Engineering with Computational Science - 1st Year',
'BS Mechanical Engineering with Computational Science - 2nd Year',
'BS Mechanical Engineering with Computational Science - 3rd Year',
'BS Mechanical Engineering with Computational Science - 4th Year',

'BS Mechanical Engineering with Mechatronics - 1st Year',
'BS Mechanical Engineering with Mechatronics - 2nd Year',
'BS Mechanical Engineering with Mechatronics - 3rd Year',
'BS Mechanical Engineering with Mechatronics - 4th Year',

'BS Mining Engineering - 1st Year',
'BS Mining Engineering - 2nd Year',
'BS Mining Engineering - 3rd Year',
'BS Mining Engineering - 4th Year',

// Accountancy and Business Programs
'BS Accountancy - 1st Year',
'BS Accountancy - 2nd Year',
'BS Accountancy - 3rd Year',
'BS Accountancy - 4th Year',

'BS Accounting Information Systems - 1st Year',
'BS Accounting Information Systems - 2nd Year',
'BS Accounting Information Systems - 3rd Year',
'BS Accounting Information Systems - 4th Year',

'BS Management Accounting - 1st Year',
'BS Management Accounting - 2nd Year',
'BS Management Accounting - 3rd Year',
'BS Management Accounting - 4th Year',

'BS Business Administration (Banking & Financial Management) - 1st Year',
'BS Business Administration (Banking & Financial Management) - 2nd Year',
'BS Business Administration (Banking & Financial Management) - 3rd Year',
'BS Business Administration (Banking & Financial Management) - 4th Year',

'BS Business Administration (Business Analytics) - 1st Year',
'BS Business Administration (Business Analytics) - 2nd Year',
'BS Business Administration (Business Analytics) - 3rd Year',
'BS Business Administration (Business Analytics) - 4th Year',

'BS Business Administration (General Business Management) - 1st Year',
'BS Business Administration (General Business Management) - 2nd Year',
'BS Business Administration (General Business Management) - 3rd Year',
'BS Business Administration (General Business Management) - 4th Year',

'BS Business Administration (Human Resource Management) - 1st Year',
'BS Business Administration (Human Resource Management) - 2nd Year',
'BS Business Administration (Human Resource Management) - 3rd Year',
'BS Business Administration (Human Resource Management) - 4th Year',

'BS Business Administration (Marketing Management) - 1st Year',
'BS Business Administration (Marketing Management) - 2nd Year',
'BS Business Administration (Marketing Management) - 3rd Year',
'BS Business Administration (Marketing Management) - 4th Year',

'BS Business Administration (Operations Management) - 1st Year',
'BS Business Administration (Operations Management) - 2nd Year',
'BS Business Administration (Operations Management) - 3rd Year',
'BS Business Administration (Operations Management) - 4th Year',

'BS Business Administration (Quality Management) - 1st Year',
'BS Business Administration (Quality Management) - 2nd Year',
'BS Business Administration (Quality Management) - 3rd Year',
'BS Business Administration (Quality Management) - 4th Year',

'BS Hospitality Management - 1st Year',
'BS Hospitality Management - 2nd Year',
'BS Hospitality Management - 3rd Year',
'BS Hospitality Management - 4th Year',

'BS Tourism Management - 1st Year',
'BS Tourism Management - 2nd Year',
'BS Tourism Management - 3rd Year',
'BS Tourism Management - 4th Year',

'BS Office Administration - 1st Year',
'BS Office Administration - 2nd Year',
'BS Office Administration - 3rd Year',
'BS Office Administration - 4th Year',

'Associate in Office Administration - 1st Year',
'Associate in Office Administration - 2nd Year',

'Bachelor in Public Administration - 1st Year',
'Bachelor in Public Administration - 2nd Year',
'Bachelor in Public Administration - 3rd Year',
'Bachelor in Public Administration - 4th Year',

// Arts and Humanities
'AB Communication - 1st Year',
'AB Communication - 2nd Year',
'AB Communication - 3rd Year',
'AB Communication - 4th Year',

'AB English with Applied Linguistics - 1st Year',
'AB English with Applied Linguistics - 2nd Year',
'AB English with Applied Linguistics - 3rd Year',
'AB English with Applied Linguistics - 4th Year',

// Education
'Bachelor of Elementary Education - 1st Year',
'Bachelor of Elementary Education - 2nd Year',
'Bachelor of Elementary Education - 3rd Year',
'Bachelor of Elementary Education - 4th Year',

'Bachelor of Secondary Education (English) - 1st Year',
'Bachelor of Secondary Education (English) - 2nd Year',
'Bachelor of Secondary Education (English) - 3rd Year',
'Bachelor of Secondary Education (English) - 4th Year',

'Bachelor of Secondary Education (Filipino) - 1st Year',
'Bachelor of Secondary Education (Filipino) - 2nd Year',
'Bachelor of Secondary Education (Filipino) - 3rd Year',
'Bachelor of Secondary Education (Filipino) - 4th Year',

'Bachelor of Secondary Education (Mathematics) - 1st Year',
'Bachelor of Secondary Education (Mathematics) - 2nd Year',
'Bachelor of Secondary Education (Mathematics) - 3rd Year',
'Bachelor of Secondary Education (Mathematics) - 4th Year',

'Bachelor of Secondary Education (Science) - 1st Year',
'Bachelor of Secondary Education (Science) - 2nd Year',
'Bachelor of Secondary Education (Science) - 3rd Year',
'Bachelor of Secondary Education (Science) - 4th Year',

'Bachelor of Multimedia Arts - 1st Year',
'Bachelor of Multimedia Arts - 2nd Year',
'Bachelor of Multimedia Arts - 3rd Year',
'Bachelor of Multimedia Arts - 4th Year',

// Sciences
'BS Biology - 1st Year',
'BS Biology - 2nd Year',
'BS Biology - 3rd Year',
'BS Biology - 4th Year',

'BS Math with Applied Industrial Mathematics - 1st Year',
'BS Math with Applied Industrial Mathematics - 2nd Year',
'BS Math with Applied Industrial Mathematics - 3rd Year',
'BS Math with Applied Industrial Mathematics - 4th Year',

'BS Psychology - 1st Year',
'BS Psychology - 2nd Year',
'BS Psychology - 3rd Year',
'BS Psychology - 4th Year',

// Health Sciences
'BS Nursing - 1st Year',
'BS Nursing - 2nd Year',
'BS Nursing - 3rd Year',
'BS Nursing - 4th Year',

'BS Pharmacy - 1st Year',
'BS Pharmacy - 2nd Year',
'BS Pharmacy - 3rd Year',
'BS Pharmacy - 4th Year',

'BS Medical Technology - 1st Year',
'BS Medical Technology - 2nd Year',
'BS Medical Technology - 3rd Year',
'BS Medical Technology - 4th Year',

// Computing
'BS Computer Science - 1st Year',
'BS Computer Science - 2nd Year',
'BS Computer Science - 3rd Year',
'BS Computer Science - 4th Year',

'BS Information Technology - 1st Year',
'BS Information Technology - 2nd Year',
'BS Information Technology - 3rd Year',
'BS Information Technology - 4th Year',

// Criminology
'BS Criminology - 1st Year',
'BS Criminology - 2nd Year',
'BS Criminology - 3rd Year',
'BS Criminology - 4th Year'
];

const defaultPositions: Position[] = [
  {
    id: "1",
    title: "President",
    description: "Chief executive of the student body",
    maxCandidates: 5,
    maxWinners: 1, // Typically only one president
    isRequired: true,
  },
  {
    id: "2",
    title: "Vice President",
    description: "Second in command and legislative leader",
    maxCandidates: 5,
    maxWinners: 1, // Typically only one vice president
    isRequired: true,
  },
  {
    id: "3",
    title: "Secretary",
    description: "Records keeper and communications officer",
    maxCandidates: 3,
    maxWinners: 1, // Typically only one secretary
    isRequired: true,
  },
  {
    id: "4",
    title: "Treasurer",
    description: "Financial officer and budget manager",
    maxCandidates: 3,
    maxWinners: 1, // Typically only one treasurer
    isRequired: true,
  },
  // Add more default positions here if needed, but do NOT add 'muse'
];

export default function UpdateElectionPage() {
  const { administeredOrg } = useAdminOrg();
  const searchParams = useSearchParams();
  const electionId = searchParams.get('electionId');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Temporary: Add this line to see what electionId we're getting
  console.log('URL electionId:', electionId);

  // Move fetchElectionData outside of useEffect so it can be called elsewhere
  const fetchElectionData = async () => {
    console.log("🔄 fetchElectionData called");
    if (!electionId) {
      setError('No election ID provided');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/get-election-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ electionId }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Failed to fetch election data');
        setLoading(false);
        return;
      }
      if (!result.election) {
        setError('No election data returned');
        setLoading(false);
        return;
      }

      console.log("📊 Fetched election data:", {
        name: result.election.name,
        positionsCount: result.election.positions.length,
        candidatesCount: result.election.candidates.length,
        candidates: result.election.candidates.map((c: any) => ({ name: c.name, id: c.id }))
      });

      setElection(result.election);
      setNewCandidate({
        name: "",
        email: "",
        positionId: "",
        credentials: "",
        course: "",
        year: "",
        platform: "",
        status: "pending",
        picture_url: "",
      });
      setEditingCandidate(null);
      setDetailViewCandidate(null);
      setIsEditCandidateOpen(false);
      console.log('✅ Set election data:', result.election);
      console.log('🔍 Candidates after refetch:', result.election.candidates);
      console.log('🔍 Candidate IDs check:');
      result.election.candidates.forEach((c: any) => {
        const isUUID = c.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(c.id);
        console.log(`  - ${c.name}: ID=${c.id}, isUUID=${isUUID}`);
      });
    } catch (error) {
      setError('Unexpected error fetching election data');
      console.error('Error fetching election data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchElectionData();
  }, [electionId]);

  const [election, setElection] = useState<Election>({
    name: "",
    description: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    positions: [],
    candidates: [],
    settings: {
      isUniLevel: false,
      allowAbstain: true,
      eligibleCourseYear: [],
    },
  })

  const [activeTab, setActiveTab] = useState<
    "basic" | "schedule" | "positions" | "candidates" | "settings" | "preview"
  >("basic")
  const [isAddPositionOpen, setIsAddPositionOpen] = useState(false)
  const [isAddCandidateOpen, setIsAddCandidateOpen] = useState(false)
  const [isEditCandidateOpen, setIsEditCandidateOpen] = useState(false)
  const [detailViewCandidate, setDetailViewCandidate] = useState<Candidate | null>(null)
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null)
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
    picture_url: "",
  })

  const [imageUploading, setImageUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isAddingPosition, setIsAddingPosition] = useState(false);
  const [isAddingCandidate, setIsAddingCandidate] = useState(false);
  const isAddingCandidateRef = useRef(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeletingElection, setIsDeletingElection] = useState(false);

  // Add state for qualifications upload
  const [qualificationsFile, setQualificationsFile] = useState<File | null>(null);
  const [qualificationsUrl, setQualificationsUrl] = useState<string | null>(null);
  const qualificationsInputRef = useRef<HTMLInputElement>(null);

  const handleElectionChange = (field: string, value: string) => {
    setElection((prev) => ({ ...prev, [field]: value }))
  }

  // Helper function to parse course_year string (same as in API route)
  const parseCourseYear = (courseYearString: string | null | undefined): { course: string; year: string } => {
    if (!courseYearString || typeof courseYearString !== 'string') {
      return { course: '', year: '' };
    }

    const trimmed = courseYearString.trim();
    
    // Handle the format "BS Civil Engineering - 1st Year"
    if (trimmed.includes(' - ')) {
      const parts = trimmed.split(' - ');
      if (parts.length >= 2) {
        return {
          course: parts[0].trim(),
          year: parts[1].trim()
        };
      }
    }
    
    // Handle alternative formats like "BS Civil Engineering-1st Year" (no spaces around dash)
    if (trimmed.includes('-')) {
      const parts = trimmed.split('-');
      if (parts.length >= 2) {
        return {
          course: parts[0].trim(),
          year: parts[1].trim()
        };
      }
    }
    
    // If no separator found, treat the whole string as course
    return {
      course: trimmed,
      year: ''
    };
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Only accept image files
    const acceptedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
    if (!acceptedTypes.includes(file.type)) {
      alert('Only image files (png, jpg, jpeg, gif, webp) are allowed.');
      return;
    }
    setImageUploading(true);
    const fileExt = file.name.split('.').pop();
    const filePath = `candidate1/candidate-${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from('election').upload(filePath, file, { upsert: true });
    if (uploadError) {
      alert('Failed to upload image: ' + uploadError.message);
      setImageUploading(false);
      return;
    }
    const { data } = supabase.storage.from('election').getPublicUrl(filePath);
    setImageUrl(data.publicUrl);
    setNewCandidate((prev) => ({ ...prev, picture_url: data.publicUrl }));
    setImageUploading(false);
  };

  const handleQualificationsChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setQualificationsFile(file);
    // Upload to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `qualifications-admin-${Date.now()}.${fileExt}`;
    const filePath = `Qualifications/${fileName}`;
    const { error } = await supabase.storage.from('election').upload(filePath, file, { upsert: true });
    if (error) {
      alert('Failed to upload qualifications image');
      return;
    }
    const { data } = supabase.storage.from('election').getPublicUrl(filePath);
    setQualificationsUrl(data.publicUrl);
    setNewCandidate(prev => ({ ...prev, qualifications_url: data.publicUrl }));
  };

  const handleAddPosition = async () => {
    if (newPosition.title && newPosition.description) {
      setIsAddingPosition(true);
      try {
        // Save to DB immediately
        const response = await fetch('/api/add-position', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            electionId,
            title: newPosition.title,
            description: newPosition.description,
            maxCandidates: newPosition.maxCandidates || 3,
            maxWinners: newPosition.maxWinners || 1,
            isRequired: newPosition.isRequired || false,
          }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Failed to add position');
        // Refetch election data to get new UUIDs
        await fetchElectionData();
        setNewPosition({ title: "", description: "", maxCandidates: 3, maxWinners: 1, isRequired: false });
        setIsAddPositionOpen(false);
      } catch (err: any) {
        alert('Failed to add position: ' + err.message);
      } finally {
        setIsAddingPosition(false);
      }
    }
  }

  const handleAddCandidate = async () => {
    // Prevent multiple simultaneous calls
    if (isAddingCandidateRef.current) {
      console.log("🚫 handleAddCandidate already in progress, skipping...");
      return;
    }
    
    if (newCandidate.name && newCandidate.email && newCandidate.positionId) {
      console.log("🔍 Starting to add candidate:", newCandidate.name);
      isAddingCandidateRef.current = true;
      setIsAddingCandidate(true);
      // Parse the course-year input
      const { course, year } = parseCourseYear(newCandidate.course);
      try {
        console.log("🔍 Calling API to add candidate...");
        // Save to DB immediately
        const response = await fetch('/api/add-candidate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            electionId,
            name: newCandidate.name,
            email: newCandidate.email,
            positionId: newCandidate.positionId,
            status: 'pending',
            credentials: newCandidate.credentials || '',
            course: course,
            year: year,
            platform: newCandidate.platform || '',
            picture_url: newCandidate.picture_url || '',
            qualifications_url: newCandidate.qualifications_url || '',
          }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Failed to add candidate');
        console.log("✅ Candidate added successfully, refetching data...");
        // Refetch election data to get new UUIDs and correct position mapping
        await fetchElectionData();
        console.log("✅ Data refetched, resetting form...");
        setNewCandidate({
          name: "",
          email: "",
          positionId: "",
          credentials: "",
          course: "",
          year: "",
          platform: "",
          status: "pending",
          picture_url: "",
          qualifications_url: "",
        });
        setIsAddCandidateOpen(false);
        console.log("✅ Candidate addition completed");
      } catch (err: any) {
        console.error("❌ Error adding candidate:", err);
        alert('Failed to add candidate: ' + err.message);
      } finally {
        setIsAddingCandidate(false);
        isAddingCandidateRef.current = false;
      }
    }
  }

  const handleEditCandidate = (candidate: Candidate) => {
    setEditingCandidate(candidate)
    setNewCandidate({
      name: candidate.name,
      email: candidate.email,
      positionId: candidate.positionId,
      credentials: candidate.credentials,
      course: candidate.course && candidate.year ? `${candidate.course} - ${candidate.year}` : candidate.course || '',
      year: candidate.year,
      platform: candidate.platform,
      status: candidate.status,
      picture_url: candidate.picture_url || "",
      qualifications_url: candidate.qualifications_url || '',
    })
    setImageUrl(candidate.picture_url || ''); // Set the image URL for the edit dialog
    setIsEditCandidateOpen(true)
  }

  const handleUpdateCandidate = () => {
    if (editingCandidate && newCandidate.name && newCandidate.email && newCandidate.positionId) {
      // Parse the course-year input
      const { course, year } = parseCourseYear(newCandidate.course);
      
      setElection((prev) => ({
        ...prev,
        candidates: prev.candidates.map((c) =>
          c.id === editingCandidate.id
            ? {
                ...c,
                name: newCandidate.name!,
                email: newCandidate.email!,
                positionId: newCandidate.positionId!,
                credentials: newCandidate.credentials || "",
                course: course, // Use parsed course
                year: year, // Use parsed year
                platform: newCandidate.platform || "",
                status: newCandidate.status || "pending",
                picture_url: newCandidate.picture_url || "",
                qualifications_url: newCandidate.qualifications_url || '',
              }
            : c
        ),
      }))
      
      // Reset form
      setNewCandidate({
        name: "",
        email: "",
        positionId: "",
        credentials: "",
        course: "",
        year: "",
        platform: "",
        status: "pending",
        picture_url: "",
        qualifications_url: '',
      })
      setImageUrl(''); // Reset the image URL
      setEditingCandidate(null)
      setIsEditCandidateOpen(false)
    }
  }

  const handleDeletePosition = (positionId: string) => {
    setElection((prev) => ({
      ...prev,
      positions: prev.positions.filter((p) => p.id !== positionId),
      candidates: prev.candidates.filter((c) => c.positionId !== positionId),
    }))
  }

  const handleDeleteCandidate = async (candidateId: string) => {
    // Remove from local state immediately
    setElection((prev) => ({
      ...prev,
      candidates: prev.candidates.filter((c) => c.id !== candidateId),
    }));
    // Remove from Supabase
    try {
      const response = await fetch('/api/delete-candidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateId }),
      });
      const result = await response.json();
      if (!response.ok) {
        console.error('❌ Failed to delete candidate from Supabase:', result.error);
        alert('Failed to delete candidate from database: ' + result.error);
        // Optionally, refetch data to ensure consistency
        await fetchElectionData();
      } else {
        console.log('✅ Candidate deleted from Supabase');
      }
    } catch (err: any) {
      console.error('❌ Error deleting candidate from Supabase:', err);
      alert('Failed to delete candidate from database: ' + err.message);
      // Optionally, refetch data to ensure consistency
      await fetchElectionData();
    }
  }

  const handleStatusChange = async (candidateId: string, newStatus: "approved" | "disqualified") => {
    console.log("🔍 handleStatusChange called with:", { candidateId, newStatus });
    console.log("🔍 Current candidates:", election.candidates.map(c => ({ id: c.id, name: c.name, status: c.status })));
    
    // Check if candidateId is a valid UUID
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(candidateId);
    console.log("🔍 Is candidateId a UUID?", isUUID);
    
    if (!isUUID) {
      console.error("❌ Candidate ID is not a UUID:", candidateId);
      alert("Cannot approve/disqualify candidate. Please update the election first to get proper IDs.");
      return;
    }
    
    try {
      // Update local state first for immediate UI feedback
      setElection((prev) => ({
        ...prev,
        candidates: prev.candidates.map((c) => 
          c.id === candidateId ? { ...c, status: newStatus } : c
        ),
      }));
      
      // Persist to database
      const response = await fetch('/api/update-candidate-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateId, status: newStatus }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        console.error("❌ API error:", result);
        alert(`Failed to update candidate status: ${result.error}`);
        // Revert local state on error
        await fetchElectionData();
        return;
      }
      
      console.log("✅ Candidate status updated successfully:", result);
      
    } catch (error) {
      console.error("❌ Error in handleStatusChange:", error);
      alert("Failed to update candidate status. Please try again.");
      // Revert local state on error
      await fetchElectionData();
    }
  }

  const validateElection = (election: Election): boolean => {
    return (
      election.name.trim() !== '' &&
      election.description.trim() !== '' &&
      !!election.startDate &&
      !!election.endDate &&
      election.positions.length > 0 &&
      election.positions.every(
        (pos) => pos.title.trim() !== '' && pos.description.trim() !== ''
      ) &&
      election.candidates.length > 0 &&
      election.candidates.every(
        (c) => c.name.trim() !== '' && c.email.trim() !== ''
      )
    );
  };

  const handleUpdateElection = async () => {
    if (!validateElection(election)) {
        alert('Please complete all required fields before updating');
        return;
    }
    if (!electionId) {
        alert('Election ID is missing. Cannot update election.');
        return;
    }

    try {
        console.log("🔄 Starting election update...");
        const response = await fetch('/api/update-election', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                electionId,
                electionData: election
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Failed to update election');
        }

        alert('Election updated successfully!');
        console.log("✅ Election updated successfully");
        
        // Clear all local state and dialogs
        setNewCandidate({
            name: "",
            email: "",
            positionId: "",
            credentials: "",
            course: "",
            year: "",
            platform: "",
            status: "pending",
            picture_url: "",
            qualifications_url: '',
        });
        setNewPosition({
            title: "",
            description: "",
            maxCandidates: 3,
            maxWinners: 1,
            isRequired: false,
        });
        setEditingCandidate(null);
        setDetailViewCandidate(null);
        setIsEditCandidateOpen(false);
        setIsAddCandidateOpen(false);
        setIsAddPositionOpen(false);
        setImageUrl('');
        
        // Refetch the latest data so IDs are correct
        console.log("🔄 Refetching election data after update...");
        await fetchElectionData();
        console.log("✅ Election data refetched successfully");

    } catch (error) {
        console.error('❌ Error updating election:', error);
        alert('Failed to update election. Please try again.');
    }
  }

  const handleDeleteElection = async () => {
    if (!electionId) {
        alert('Election ID is missing. Cannot delete election.');
        return;
    }

    try {
        setIsDeletingElection(true);
        console.log("🗑️ Starting election deletion...");
        
        const response = await fetch('/api/delete-election', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ electionId }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Failed to delete election');
        }

        alert(result.message || 'Election deleted successfully!');
        console.log("✅ Election deleted successfully");
        
        // Redirect back to admin dashboard
        window.location.href = '/dashboard/Admin';
        
    } catch (error) {
        console.error('❌ Error deleting election:', error);
        alert('Failed to delete election. Please try again.');
    } finally {
        setIsDeletingElection(false);
        setIsDeleteDialogOpen(false);
    }
  }

  const getPositionCandidates = (positionId: string) => {
    return election.candidates.filter((c) => c.positionId === positionId)
  }

  const getPositionById = (positionId: string) => {
    return election.positions.find((p) => p.id === positionId)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#52100D] flex flex-col items-center justify-center">
        <div className="text-white text-xl">Loading election data...</div>
        <div className="text-white text-sm mt-2">Election ID: {electionId || 'None'}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#52100D] flex flex-col items-center justify-center">
        <div className="text-red-400 text-xl">{error}</div>
        <div className="text-white text-sm mt-2">Election ID: {electionId || 'None'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#52100D]">
        <header className="fixed top-0 left-0 right-0 z-50">
            <AdminHeader />
        </header>
        {/* Semantic Main Content */}
        <main className="pt-32"> {/* Adjust based on header height */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Update Election</h1>
                        <p className="text-red-100 mt-1">Update election with positions, candidates, and voting rules</p>
                    </div>
                    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                        <DialogTrigger asChild>
                            <Button 
                                variant="destructive" 
                                className="bg-red-800 hover:bg-red-500 text-white"
                                size="lg"
                            >
                                <Trash2 className="w-5 h-5 mr-2" />
                                Delete Election
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle className="text-red-900 text-xl">Delete Election</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Trash2 className="w-8 h-8 text-red-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        Are you absolutely sure?
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        This action cannot be undone. This will permanently delete the election 
                                        <span className="font-semibold text-red-900"> "{election.name}"</span> and all associated data including:
                                    </p>
                                    <ul className="text-left text-sm text-gray-600 space-y-1 mb-6">
                                        <li>• All positions and candidates</li>
                                        <li>• All votes and voting records</li>
                                        <li>• All election settings and configurations</li>
                                    </ul>
                                    <p className="text-red-600 font-medium">
                                        This action is irreversible!
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsDeleteDialogOpen(false)}
                                        className="flex-1"
                                        disabled={isDeletingElection}
                                    >
                                        <div className="text-black">Cancel</div>
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={handleDeleteElection}
                                        className="flex-1 bg-red-600 hover:bg-red-700"
                                        disabled={isDeletingElection}
                                    >
                                        {isDeletingElection ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                Deleting...
                                            </>
                                        ) : (
                                            <>
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Delete Permanently
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
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
                                <Label htmlFor="position-title" className="text-black">Position Title</Label>
                                <Input className="text-black"
                                id="position-title"
                                value={newPosition.title || ""}
                                onChange={(e) => setNewPosition((prev) => ({ ...prev, title: e.target.value }))}
                                placeholder="e.g., President"
                                />
                            </div>
                            <div>
                                <Label htmlFor="position-description" className="text-black">Description</Label>
                                <Textarea className="text-black"
                                id="position-description"
                                value={newPosition.description || ""}
                                onChange={(e) => setNewPosition((prev) => ({ ...prev, description: e.target.value }))}
                                placeholder="Describe the role and responsibilities..."
                                rows={3}
                                />
                            </div>
                            <div>
                                <Label htmlFor="max-candidates" className="text-black">Maximum Candidates</Label>
                                <Input className="text-black"
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
                            <div>
                                <Label htmlFor="max-winners" className="text-black">Maximum Winners</Label>
                                <Input className="text-black"
                                id="max-winners"
                                type="number"
                                min="1"
                                max="10"
                                value={newPosition.maxWinners || 1}
                                onChange={(e) =>
                                    setNewPosition((prev) => ({ ...prev, maxWinners: Number.parseInt(e.target.value) }))
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
                                <Label htmlFor="is-required" className="text-black">Required position (voters must vote for this)</Label>
                            </div>
                            <Button onClick={handleAddPosition} className="w-full bg-red-900 hover:bg-red-800" disabled={isAddingPosition}>
                                {isAddingPosition ? 'Adding...' : 'Add Position'}
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
                            key={position.id ?? position.title ?? 'generated-id'}
                            position={{ ...position, id: position.id ?? position.title ?? 'generated-id' }}
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
                        <DialogContent className="max-h-[90vh] h-auto overflow-y-auto rounded-2xl p-4">
                            <DialogHeader>
                            <DialogTitle className="text-red-900">Add New Candidate</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                            <div className="flex flex-col items-center">
                                <div className="w-20 h-20 bg-red-900 rounded-full flex items-center justify-center overflow-hidden mb-2">
                                {imageUrl ? (
                                    <img src={imageUrl} alt="Candidate" className="w-full h-full object-cover" />
                                ) : (
                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                )}
                                </div>
                                <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={handleImageChange}
                                disabled={imageUploading}
                                />
                                <Button
                                size="sm"
                                onClick={() => fileInputRef.current?.click()}
                                className="mt-1 bg-gray-200 text-red-900 hover:bg-gray-100 focus:bg-gray-100 border border-gray-300"
                                disabled={imageUploading}
                                >
                                {imageUploading ? 'Uploading...' : (imageUrl ? 'Change Picture' : 'Upload Picture')}
                                </Button>
                            </div>
                            <div>
                                <Label htmlFor="candidate-name" className="text-black">Full Name</Label>
                                <Input className="text-black"
                                id="candidate-name"
                                value={newCandidate.name || ""}
                                onChange={(e) => setNewCandidate((prev) => ({ ...prev, name: e.target.value }))}
                                placeholder="Enter full name"
                                />
                            </div>
                            <div>
                                <Label htmlFor="candidate-email" className="text-black">Email</Label>
                                <Input className="text-black"
                                id="candidate-email"
                                type="email"
                                value={newCandidate.email || ""}
                                onChange={(e) => setNewCandidate((prev) => ({ ...prev, email: e.target.value }))}
                                placeholder="Enter email address"
                                />
                            </div>
                            <div className="text-black">
                                <Label htmlFor="candidate-position" className="text-black">Position</Label>
                                <Select onValueChange={(value) => setNewCandidate((prev) => ({ ...prev, positionId: value }))}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select position" />
                                </SelectTrigger>
                                <SelectContent>
                                    {election.positions.map((position) => (
                                    <SelectItem key={position.id ?? position.title ?? 'generated-id'} value={position.id ?? position.title ?? 'generated-id'}>
                                        {position.title}
                                    </SelectItem>
                                    ))}
                                </SelectContent>
                                </Select>
                            </div>
                            <div className="text-black">
                                <Label htmlFor="candidate-course" className="text-black">Course and Year</Label>
                                <Select onValueChange={(value) => setNewCandidate((prev) => ({ ...prev, course: value }))}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select course and Year" />
                                </SelectTrigger>
                                <SelectContent>
                                    {courseYearOptions.map((course) => (
                                    <SelectItem key={course} value={course}>
                                        {course}
                                    </SelectItem>
                                    ))}
                                </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="candidate-credentials" className="text-black">Credentials</Label>
                                <Textarea className="text-black"
                                id="candidate-credentials"
                                value={newCandidate.credentials || ""}
                                onChange={(e) => setNewCandidate((prev) => ({ ...prev, credentials: e.target.value }))}
                                placeholder="Enter candidate credentials..."
                                rows={3}
                                />
                            </div>
                            <div>
                                <Label htmlFor="candidate-platform" className="text-black">Platform Summary</Label>
                                <Textarea className="text-black"
                                id="candidate-platform"
                                value={newCandidate.platform || ""}
                                onChange={(e) => setNewCandidate((prev) => ({ ...prev, platform: e.target.value }))}
                                placeholder="Enter candidate's platform..."
                                rows={4}
                                />
                            </div>
                            <div>
                                <Label className="text-black">Qualifications</Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                    type="text"
                                    value={qualificationsUrl ? qualificationsUrl.split('/').pop() : ''}
                                    readOnly
                                    placeholder="No file uploaded"
                                    className="flex-1 text-black placeholder-gray-400"
                                    />
                                    <input
                                    type="file"
                                    accept="image/*"
                                    ref={qualificationsInputRef}
                                    style={{ display: 'none' }}
                                    onChange={handleQualificationsChange}
                                    />
                                    <Button
                                    type="button"
                                    size="sm"
                                    onClick={() => qualificationsInputRef.current?.click()}
                                    className="bg-red-900 text-white"
                                    >
                                    Upload
                                    </Button>
                                </div>
                            </div>
                            <Button onClick={handleAddCandidate} className="w-full bg-red-900 hover:bg-red-800" disabled={isAddingCandidate}>
                                {isAddingCandidate ? 'Adding...' : 'Add Candidate'}
                            </Button>
                            </div>
                        </DialogContent>
                        </Dialog>
                    </div>
                    </CardHeader>
                    <CardContent>
                    {election.positions.map((position) => (
                        <div key={position.id ?? position.title ?? 'generated-id'} className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <h3 className="text-lg font-semibold text-red-900">{position.title}</h3>
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                            {getPositionCandidates(position.id ?? position.title ?? 'generated-id').length} candidates
                            </Badge>
                        </div>
                        
                        {/* Warning for candidates without real UUIDs */}
                        {getPositionCandidates(position.id ?? position.title ?? 'generated-id').some(c => !c.id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(c.id)) && (
                          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-center gap-2 text-yellow-800">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              <span className="font-medium">New candidates detected</span>
                            </div>
                            <p className="text-yellow-700 text-sm mt-1">
                              Some candidates were recently added. Click "Update Election" to save them to the database and enable approval/disqualification.
                            </p>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {getPositionCandidates(position.id ?? position.title ?? 'generated-id').map((candidate) => {
                              // Ensure we have a real UUID for the candidate
                              const candidateId = candidate.id;
                              const isRealUUID = candidateId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(candidateId);
                              
                              console.log(`🔍 Candidate ${candidate.name}: ID=${candidateId}, isUUID=${isRealUUID}, status=${candidate.status}`);
                              
                              return (
                                <CandidateCard
                                  key={candidateId || candidate.email || 'temp-id'}
                                  candidate={{ 
                                    ...candidate, 
                                    id: candidateId || candidate.email || 'temp-id', 
                                    position: position.title,
                                    qualifications_url: candidate.qualifications_url
                                  }}
                                  onDelete={handleDeleteCandidate}
                                  onApprove={isRealUUID ? (id) => handleStatusChange(id, "approved") : undefined}
                                  onDisqualify={isRealUUID ? (id) => handleStatusChange(id, "disqualified") : undefined}
                                  onViewDetails={(candidate) => setDetailViewCandidate({ ...candidate, qualifications_url: candidate.qualifications_url })}
                                  onEdit={handleEditCandidate}
                                  showActions={true}
                                />
                              );
                            })}
                        </div>
                        {getPositionCandidates(position.id ?? position.title ?? 'generated-id').length === 0 && (
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

                {/* Edit Candidate Dialog */}
                <Dialog open={isEditCandidateOpen} onOpenChange={setIsEditCandidateOpen}>
                    <DialogContent className="max-h-[90vh] h-auto overflow-y-auto rounded-2xl p-4">
                        <DialogHeader>
                        <DialogTitle className="text-red-900">Edit Candidate</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 bg-red-900 rounded-full flex items-center justify-center overflow-hidden mb-2">
                            {imageUrl ? (
                                <img src={imageUrl} alt="Candidate" className="w-full h-full object-cover" />
                            ) : (
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            )}
                            </div>
                            <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleImageChange}
                            disabled={imageUploading}
                            />
                            <Button
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            className="mt-1 bg-gray-200 text-red-900 hover:bg-gray-100 focus:bg-gray-100 border border-gray-300"
                            disabled={imageUploading}
                            >
                            {imageUploading ? 'Uploading...' : (imageUrl ? 'Change Picture' : 'Upload Picture')}
                            </Button>
                        </div>
                        <div>
                            <Label htmlFor="edit-candidate-name" className="text-black">Full Name</Label>
                            <Input className="text-black"
                            id="edit-candidate-name"
                            value={newCandidate.name || ""}
                            onChange={(e) => setNewCandidate((prev) => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter full name"
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-candidate-email" className="text-black">Email</Label>
                            <Input className="text-black"
                            id="edit-candidate-email"
                            type="email"
                            value={newCandidate.email || ""}
                            onChange={(e) => setNewCandidate((prev) => ({ ...prev, email: e.target.value }))}
                            placeholder="Enter email address"
                            />
                        </div>
                        <div className="text-black">
                            <Label htmlFor="edit-candidate-position" className="text-black">Position</Label>
                            <Select onValueChange={(value) => setNewCandidate((prev) => ({ ...prev, positionId: value }))}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select position" />
                            </SelectTrigger>
                            <SelectContent>
                                {election.positions.map((position) => (
                                <SelectItem key={position.id ?? position.title ?? 'generated-id'} value={position.id ?? position.title ?? 'generated-id'}>
                                    {position.title}
                                </SelectItem>
                                ))}
                            </SelectContent>
                            </Select>
                        </div>
                        <div className="text-black">
                            <Label htmlFor="edit-candidate-course" className="text-black">Course and Year</Label>
                            <Select onValueChange={(value) => setNewCandidate((prev) => ({ ...prev, course: value }))}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select course and Year" />
                            </SelectTrigger>
                            <SelectContent>
                                {courseYearOptions.map((course) => (
                                <SelectItem key={course} value={course}>
                                    {course}
                                </SelectItem>
                                ))}
                            </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="edit-candidate-credentials" className="text-black">Credentials</Label>
                            <Textarea className="text-black"
                            id="edit-candidate-credentials"
                            value={newCandidate.credentials || ""}
                            onChange={(e) => setNewCandidate((prev) => ({ ...prev, credentials: e.target.value }))}
                            placeholder="Enter candidate credentials..."
                            rows={3}
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-candidate-platform" className="text-black">Platform Summary</Label>
                            <Textarea className="text-black"
                            id="edit-candidate-platform"
                            value={newCandidate.platform || ""}
                            onChange={(e) => setNewCandidate((prev) => ({ ...prev, platform: e.target.value }))}
                            placeholder="Enter candidate's platform..."
                            rows={4}
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-candidate-status" className="text-black">Status</Label>
                            <Select onValueChange={(value) => setNewCandidate((prev) => ({ ...prev, status: value as "pending" | "approved" | "disqualified" }))}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="disqualified">Disqualified</SelectItem>
                            </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="edit-candidate-qualifications" className="text-black">Qualifications</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                id="edit-candidate-qualifications"
                                type="text"
                                className="text-black flex-1"
                                value={newCandidate.qualifications_url ? newCandidate.qualifications_url.split('/').pop() : 'No file uploaded'}
                                readOnly
                                style={{ background: '#f3f3f3', cursor: 'not-allowed' }}
                                />
                                <Button
                                size="sm"
                                className="bg-gray-200 text-red-900 hover:bg-gray-100 focus:bg-gray-100 border border-gray-300"
                                onClick={() => qualificationsInputRef.current?.click()}
                                type="button"
                                >
                                Upload
                                </Button>
                                <input
                                type="file"
                                accept="image/*"
                                ref={qualificationsInputRef}
                                style={{ display: 'none' }}
                                onChange={handleQualificationsChange}
                                />
                                {newCandidate.qualifications_url && (
                                <Button
                                    size="sm"
                                    className="ml-2 bg-blue-100 text-blue-900 border border-blue-300"
                                    type="button"
                                    onClick={() => window.open(newCandidate.qualifications_url, '_blank')}
                                >
                                    View
                                </Button>
                                )}
                            </div>
                            {newCandidate.qualifications_url && (
                                <div className="mt-2 flex justify-center">
                                <img
                                    src={newCandidate.qualifications_url}
                                    alt="Qualifications Preview"
                                    className="max-h-32 rounded shadow border"
                                    style={{ objectFit: 'contain' }}
                                />
                                </div>
                            )}
                        </div>
                        <Button onClick={handleUpdateCandidate} className="w-full bg-red-900 hover:bg-red-800">
                            Update Candidate
                        </Button>
                        </div>
                    </DialogContent>
                </Dialog>

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
                            <div className="flex items-center justify-between">
                                <div>
                                <Label htmlFor="uni-level">University Level Election</Label>
                                <p className="text-sm text-gray-600">This election applies to all university students</p>
                                </div>
                                <Switch
                                id="uni-level"
                                checked={election.settings.isUniLevel}
                                onCheckedChange={(checked) =>
                                    setElection((prev) => ({
                                    ...prev,
                                    settings: { ...prev.settings, isUniLevel: checked },
                                    }))
                                }
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-red-900">Voter Eligibility</h3>
                        <div>
                        <MultiSelectDropdown
                            options={courseYearOptions}
                            selectedOptions={election.settings.eligibleCourseYear}
                            onSelectionChange={(selected) => {
                                setElection((prev) => ({
                                    ...prev,
                                    settings: {
                                        ...prev.settings,
                                        eligibleCourseYear: selected,
                                    },
                                }))
                            }}
                            placeholder="Select eligible courses and years"
                            label="Eligible Courses and Year"
                        />
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
                    <div className="[background:linear-gradient(90deg,_#f0fdf4,_#fefce8)] p-6 rounded-lg border border-red-200">
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
                            <Card key={position.id ?? position.title ?? 'generated-id'} className="border border-red-200">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-red-900">{position.title}</h4>
                                <Badge className="bg-yellow-100 text-yellow-800">
                                    {getPositionCandidates(position.id ?? position.title ?? 'generated-id').length} candidates
                                </Badge>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">{position.description}</p>
                                <div className="flex flex-wrap gap-2">
                                {getPositionCandidates(position.id ?? position.title ?? 'generated-id').map((candidate) => (
                                    <Badge key={candidate.id ?? candidate.email ?? 'generated-id'} variant="outline" className="bg-white">
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
                        onClick={handleUpdateElection}
                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
                        disabled={
                            !election.name || !election.startDate || !election.endDate || election.positions.length === 0
                        }
                        >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Update Election
                        </Button>
                    </div>
                    </CardContent>
                </Card>
                )}

                {/* Candidate Detail Modal */}
                <CandidateDetailModal
                candidate={
                  detailViewCandidate ? {
                    ...detailViewCandidate,
                    id: detailViewCandidate.id ?? detailViewCandidate.email ?? 'generated-id',
                    positionName: getPositionById(detailViewCandidate.positionId ?? detailViewCandidate.positionId ?? 'generated-id')?.title || "Unknown Position",
                    qualifications_url: detailViewCandidate.qualifications_url
                  } as any : null
                }
                isOpen={!!detailViewCandidate}
                onClose={() => setDetailViewCandidate(null)}
                onApprove={(id) => handleStatusChange(id, "approved")}
                onDisqualify={(id) => handleStatusChange(id, "disqualified")}
                onEdit={handleEditCandidate}
                />
            </div>
        </main>
    </div>
  );
}
