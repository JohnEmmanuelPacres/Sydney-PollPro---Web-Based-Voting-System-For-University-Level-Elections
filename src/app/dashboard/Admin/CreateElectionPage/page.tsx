"use client"
import { useState, useEffect, useRef } from "react"
import { supabase } from "@/utils/supabaseClient"
import { useAdminOrg } from '../AdminedOrgContext'; //React Context
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
import { Plus, Settings, Eye, CheckCircle, User, Award, Users } from "lucide-react"

// Import custom components
import { ElectionTabs } from "../../../components/CreateElectionComponents/election-tabs"
import { BasicInfoSection, ScheduleSection } from "../../../components/CreateElectionComponents/election-form-sections"
import { PositionCard } from "../../../components/CreateElectionComponents/position-card"
import { CandidateCard } from "../../../components/CreateElectionComponents/candidate-card"
import { CandidateDetailModal } from "../../../components/CreateElectionComponents/candidate-detail-modal"
import { EmptyState } from "../../../components/CreateElectionComponents/empty-state"
import { MultiSelectDropdown } from "../../../components/CreateElectionComponents/multi-select-dropdown"
import AdminHeader from "../../../components/AdminHeader"
import { useSearchParams } from "next/navigation";

interface Position {
  id: string
  title: string
  description: string
  maxCandidates: number
  maxWinners?: number
  isRequired: boolean
}

interface Candidate {
  id: string
  name: string
  email: string
  positionId: string
  status: "pending" | "approved" | "disqualified"
  credentials: string
  course: string
  year: string
  platform: string
  detailedCredentials?: string
  achievements?: string[]
  experience?: string[]
  picture_url?: string
  isAbstain?: boolean
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
  };
}

const defaultPositions: Position[] = [
  {
    id: crypto.randomUUID(),
    title: "President",
    description: "Chief executive of the student body",
    maxCandidates: 5,
    maxWinners: 1, // Typically only one president
    isRequired: true,
  },
  {
    id: crypto.randomUUID(),
    title: "Vice President",
    description: "Second in command and legislative leader",
    maxCandidates: 5,
    maxWinners: 1, // Typically only one vice president
    isRequired: true,
  },
  {
    id: crypto.randomUUID(),
    title: "Secretary",
    description: "Records keeper and communications officer",
    maxCandidates: 3,
    maxWinners: 1, // Typically only one secretary
    isRequired: true,
  },
  {
    id: crypto.randomUUID(),
    title: "Treasurer",
    description: "Financial officer and budget manager",
    maxCandidates: 3,
    maxWinners: 1, // Typically only one treasurer
    isRequired: true,
  },
]
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

export default function CreateElectionPage() {
  const searchParams = useSearchParams();
  const { administeredOrg: contextAdminOrg } = useAdminOrg();
  const administeredOrg = searchParams.get('administered_Org') || contextAdminOrg || '';
  const [orgID, setOrgId] = useState('');
  const [adminDepartmentOrg, setAdminDepartmentOrg] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrgId = async () => {
        const { data: org } = await supabase
        .from('organizations')
        .select('id')
        .eq('organization_name', administeredOrg || '')
        .single();

        if (org) setOrgId(org.id);
    };
    
    fetchOrgId();
  }, []);

  useEffect(() => {
    async function fetchAdminDepartmentOrg() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) {
        setAdminDepartmentOrg(administeredOrg || null); // fallback to context/search param
        return;
      }
      const { data: profile } = await supabase
        .from('admin_profiles')
        .select('administered_org')
        .eq('email', user.email)
        .single();
      setAdminDepartmentOrg(profile?.administered_org || administeredOrg || null); // fallback to context/search param
    }
    fetchAdminDepartmentOrg();
  }, []);

  const [election, setElection] = useState<Election>({
    name: "",
    description: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    positions: defaultPositions,
    candidates: [],
    settings: {
      isUniLevel: false,
      allowAbstain: true,
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
  const [editingPosition, setEditingPosition] = useState<Position | null>(null);
  const [isEditPositionOpen, setIsEditPositionOpen] = useState(false);
  const [editPositionFields, setEditPositionFields] = useState<Partial<Position>>({});

  const handleElectionChange = (field: string, value: string) => {
    setElection((prev) => ({ ...prev, [field]: value }))
  }

  // Function to create abstain candidate for a position
  const createAbstainCandidate = (positionId: string): Candidate => {
    console.log(`🔧 Creating abstain candidate for position ${positionId}`);
    const abstainCandidate: Candidate = {
      id: Date.now().toString(),
      name: "Abstain",
      email: "abstain@election.system",
      positionId: positionId,
      status: "approved" as const, // Abstain is always approved
      credentials: "Voter chose to abstain from voting for this position",
      course: "",
      year: "",
      platform: "This option allows voters to abstain from voting for this position",
      isAbstain: true,
      picture_url: "",
    };
    console.log('✅ Created abstain candidate:', abstainCandidate);
    return abstainCandidate;
  }

  // Function to add abstain candidates to all positions
  const addAbstainCandidatesToAllPositions = () => {
    console.log('🔄 Adding abstain candidates to all positions...');
    if (!election.settings.allowAbstain) {
      console.log('❌ Abstain is disabled, skipping...');
      return;
    }
    // Remove all existing abstain candidates first
    setElection(prev => {
      const filteredCandidates = prev.candidates.filter(c => !c.isAbstain);
      // Add one abstain candidate per position
      const abstainCandidates = prev.positions.map(position => createAbstainCandidate(position.id));
      console.log(`📝 Adding ${abstainCandidates.length} new abstain candidates (after clearing old ones)`);
      return {
        ...prev,
        candidates: [...filteredCandidates, ...abstainCandidates]
      };
    });
  }

  // Function to remove abstain candidates from all positions
  const removeAbstainCandidatesFromAllPositions = () => {
    console.log('🗑️ Removing abstain candidates from all positions...');
    setElection(prev => {
      const filteredCandidates = prev.candidates.filter(c => !c.isAbstain);
      console.log(`📝 Removed ${prev.candidates.length - filteredCandidates.length} abstain candidates`);
      return {
        ...prev,
        candidates: filteredCandidates
      };
    });
  }

  // Effect to handle abstain candidates when allowAbstain setting changes
  useEffect(() => {
    console.log('🔄 Abstain setting changed:', election.settings.allowAbstain);
    if (election.settings.allowAbstain) {
      addAbstainCandidatesToAllPositions();
    } else {
      removeAbstainCandidatesFromAllPositions();
    }
  }, [election.settings.allowAbstain, election.positions.length]);

  const handleAddPosition = () => {
    if (newPosition.title && newPosition.description) {
      const position: Position = {
        id: Date.now().toString(),
        title: newPosition.title!,
        description: newPosition.description!,
        maxCandidates: newPosition.maxCandidates || 3,
        maxWinners: newPosition.maxWinners || 1,
        isRequired: newPosition.isRequired || false,
      }
      setElection((prev) => ({
        ...prev,
        positions: [...prev.positions, position],
      }))
      setNewPosition({ title: "", description: "", maxCandidates: 3, maxWinners: 1, isRequired: false })
      setIsAddPositionOpen(false)
    }
  }

  const handleAddCandidate = () => {
    if (newCandidate.name && newCandidate.email && newCandidate.positionId) {
      // Parse the course-year input
      const { course, year } = parseCourseYear(newCandidate.course);
      
      const candidate: Candidate = {
        id: Date.now().toString(),
        name: newCandidate.name!,
        email: newCandidate.email!,
        positionId: newCandidate.positionId!,
        status: "pending",
        credentials: newCandidate.credentials || "",
        course: course, // Use parsed course
        year: year, // Use parsed year
        platform: newCandidate.platform || "",
        picture_url: newCandidate.picture_url || "",
      }
      
      setElection((prev) => ({
        ...prev,
        candidates: [...prev.candidates, candidate],
      }))
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
      })
      setImageUrl(''); // Reset the image URL
      setIsAddCandidateOpen(false)
    }
  }

  const handleEditCandidate = (candidate: Candidate) => {
    setEditingCandidate(candidate)
    const formattedCourse = candidate.course && candidate.year ? `${candidate.course} - ${candidate.year}` : candidate.course || '';
    
    setNewCandidate({
      name: candidate.name,
      email: candidate.email,
      positionId: candidate.positionId,
      credentials: candidate.credentials,
      course: formattedCourse,
      year: candidate.year,
      platform: candidate.platform,
      status: candidate.status,
      picture_url: candidate.picture_url || "",
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
                picture_url: newCandidate.picture_url || c.picture_url || "",
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

  const handleDeleteCandidate = (candidateId: string) => {
    setElection((prev) => ({
      ...prev,
      candidates: prev.candidates.filter((c) => c.id !== candidateId),
    }))
  }

  const handleStatusChange = (candidateId: string, newStatus: "approved" | "disqualified") => {
    setElection((prev) => ({
      ...prev,
      candidates: prev.candidates.map((c) => (c.id === candidateId ? { ...c, status: newStatus } : c)),
    }))
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
        (c) => c.name.trim() !== '' && c.email.trim() !== '' //&& c.positionId.trim() !== ''
      )
      // Add any other validation rules you need
    );
  };

  const handleCreateElection = async () => {
    console.log('🚀 Starting handleCreateElection...');
    console.log('🔍 Current election state:', election);
    
    if (!validateElection(election)) {
        console.error('❌ Election validation failed');
        alert('Please complete all required fields before publishing');
        return;
    }
    if (!orgID) {
        console.error('❌ Organization ID is missing');
        alert('Organization ID is missing. Cannot create election.');
        return;
    }
    if (!election.settings.isUniLevel && !adminDepartmentOrg) {
        console.error('❌ Admin department/organization is missing');
        alert('Admin department/organization is missing. Cannot create organization election.');
        return;
    }
    
    console.log('✅ Validation passed, processing candidates...');
    
    // Map candidates to API shape, excluding abstain candidates from regular candidate processing
    const regularCandidates = election.candidates.filter(c => !c.isAbstain);
    const abstainCandidates = election.candidates.filter(c => c.isAbstain);
    
    console.log('📊 Candidate breakdown:', {
      total: election.candidates.length,
      regular: regularCandidates.length,
      abstain: abstainCandidates.length
    });
    
    const mappedCandidates = regularCandidates.map((c) => {
      const courseYear = c.course + (c.year ? ` - ${c.year}` : '');
      console.log(`📝 Mapping regular candidate ${c.name}:`, {
        course: c.course,
        year: c.year,
        courseYear: courseYear
      });
      
      return {
        id: c.id,
        name: c.name,
        email: c.email,
        course_Year: courseYear,
        positionId: c.positionId,
        status: c.status,
        platform: c.platform,
        detailed_achievements: c.credentials || '',
        picture_url: c.picture_url || '',
      };
    });

    // Map abstain candidates separately with proper course_year handling
    const mappedAbstainCandidates = abstainCandidates.map((c) => {
      console.log(`📝 Mapping abstain candidate ${c.name}:`, {
        course: c.course,
        year: c.year,
        positionId: c.positionId
      });
      
      return {
        id: c.id,
        name: c.name,
        email: c.email,
        course_Year: 'System Generated', // Give abstain candidates a proper course_year
        positionId: c.positionId,
        status: c.status,
        platform: c.platform,
        detailed_achievements: c.credentials || '',
        picture_url: c.picture_url || '',
        isAbstain: true,
      };
    });

    const allCandidates = [...mappedCandidates, ...mappedAbstainCandidates];
    console.log('📋 Final candidate mapping:', allCandidates);

    const payload = {
      electionData: {
        name: election.name,
        description: election.description,
        startDate: election.startDate,
        startTime: election.startTime,
        endDate: election.endDate,
        endTime: election.endTime,
        positions: election.positions,
        candidates: allCandidates,
        settings: {
          isUniLevel: election.settings.isUniLevel,
          allowAbstain: election.settings.allowAbstain,
        },
        department_org: !election.settings.isUniLevel ? (adminDepartmentOrg || administeredOrg) : null
      },
      orgID: orgID
    };
    
    console.log('📤 Payload sent to /api/create-elections:', JSON.stringify(payload, null, 2));
    
    try {
        console.log('🌐 Making API call to /api/create-elections...');
        const response = await fetch('/api/create-elections', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        
        console.log('📥 Response status:', response.status);
        console.log('📥 Response ok:', response.ok);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ API Error Response:', errorText);
            throw new Error(`Failed to create election: ${errorText}`);
        }
        
        const result = await response.json();
        console.log("✅ Election creation successful:", result);
        alert('Election created successfully!');
        // Redirect or reset form as needed
    } catch (error) {
        console.error('❌ Error creating election:', error);
        alert(`Failed to create election: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  const getPositionCandidates = (positionId: string) => {
    return election.candidates.filter((c) => c.positionId === positionId && !c.isAbstain)
  }

  const getPositionAbstainCandidate = (positionId: string) => {
    return election.candidates.find((c) => c.positionId === positionId && c.isAbstain)
  }

  const getPositionById = (positionId: string) => {
    return election.positions.find((p) => p.id === positionId)
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

  const handleEditPosition = (position: Position) => {
    setEditingPosition(position);
    setEditPositionFields({ ...position });
    setIsEditPositionOpen(true);
  };

  const handleEditPositionFieldChange = (field: keyof Position, value: any) => {
    setEditPositionFields((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveEditPosition = () => {
    if (!editingPosition) return;
    setElection((prev) => ({
      ...prev,
      positions: prev.positions.map((pos) =>
        pos.id === editingPosition.id ? { ...pos, ...editPositionFields } : pos
      ),
    }));
    setIsEditPositionOpen(false);
    setEditingPosition(null);
    setEditPositionFields({});
  };

  return (
    <div className="min-h-screen bg-[#52100D]">
        <header className="fixed top-0 left-0 right-0 z-50">
            <AdminHeader />
        </header>
        {/* Semantic Main Content */}
        <main className="pt-32"> {/* Adjust based on header height */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold">Create New Election</h1>
                <p className="text-red-100 mt-1">Set up a new election with positions, candidates, and voting rules</p>
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
                            <Button onClick={handleAddPosition} className="w-full bg-red-900 hover:bg-red-800">
                                Add Position
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
                            key={position.id}
                            position={{
                            ...position,
                            currentCandidates: getPositionCandidates(position.id).length,
                            }}
                            onDelete={handleDeletePosition}
                            onEdit={handleEditPosition}
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
                        <DialogContent className="w-full max-w-2xl max-h-[90vh] flex flex-col p-6">
                            <DialogHeader>
                            <DialogTitle className="text-red-900">Add New Candidate</DialogTitle>
                            </DialogHeader>
                            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
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
                                <Input className="text-black focus:ring-2 focus:ring-red-200 hover:bg-gray-50" id="candidate-name" value={newCandidate.name || ""} onChange={(e) => setNewCandidate((prev) => ({ ...prev, name: e.target.value }))} placeholder="Enter full name" />
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
                                    <SelectItem key={position.id} value={position.id}>
                                        {position.title}
                                    </SelectItem>
                                    ))}
                                </SelectContent>
                                </Select>
                            </div>
                            <div className="text-black">
                                <Label htmlFor="candidate-course" className="text-black">Course and Year</Label>
                                <Select onValueChange={(value) => setNewCandidate((prev) => ({ ...prev, course: value }))} value={newCandidate.course || ""}>
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
                            </div>
                            <div className="pt-4 border-t border-gray-200 bg-white">
                                <Button onClick={handleAddCandidate} className="w-full bg-red-900 hover:bg-red-700 focus:bg-red-700">
                                    Add Candidate
                                </Button>
                            </div>
                        </DialogContent>
                        </Dialog>
                    </div>
                    </CardHeader>
                    <CardContent>
                    {election.positions.map((position) => (
                        <div key={position.id} className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <h3 className="text-lg font-semibold text-red-900">{position.title}</h3>
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                            {getPositionCandidates(position.id).length} candidates
                            </Badge>
                            {election.settings.allowAbstain && (
                              <Badge variant="outline" className="bg-blue-100 text-blue-800">
                                + Abstain option
                              </Badge>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {getPositionCandidates(position.id).map((candidate) => (
                              <CandidateCard
                                  key={candidate.id}
                                  candidate={{
                                  ...candidate,
                                  position: position.title,
                                  picture_url: candidate.picture_url || "",
                                  }}
                                  onDelete={handleDeleteCandidate}
                                  onApprove={(id) => handleStatusChange(id, "approved")}
                                  onDisqualify={(id) => handleStatusChange(id, "disqualified")}
                                  onViewDetails={setDetailViewCandidate}
                                  onEdit={handleEditCandidate}
                              />
                            ))}
                        </div>
                        
                        {/* Show abstain candidate if enabled */}
                        {election.settings.allowAbstain && getPositionAbstainCandidate(position.id) && (
                          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              <div className="flex-1">
                                <h4 className="text-blue-900 font-semibold">Abstain Option</h4>
                                <p className="text-blue-700 text-sm">Voters can choose to abstain from voting for this position</p>
                              </div>
                              <Badge className="bg-blue-600 text-white">System Generated</Badge>
                            </div>
                          </div>
                        )}
                        
                        {getPositionCandidates(position.id).length === 0 && (
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
                    <DialogContent className="w-full max-w-2xl max-h-[90vh] flex flex-col p-6">
                        <DialogHeader>
                        <DialogTitle className="text-red-900">Edit Candidate</DialogTitle>
                        </DialogHeader>
                        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="text-black">
                                <Label htmlFor="edit-candidate-position" className="text-black">Position</Label>
                                <Select onValueChange={(value) => setNewCandidate((prev) => ({ ...prev, positionId: value }))}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select position" />
                                </SelectTrigger>
                                <SelectContent>
                                    {election.positions.map((position) => (
                                    <SelectItem key={position.id} value={position.id}>
                                        {position.title}
                                    </SelectItem>
                                    ))}
                                </SelectContent>
                                </Select>
                            </div>
                            <div className="text-black">
                                <Label htmlFor="edit-candidate-course" className="text-black">Course and Year</Label>
                                <Select onValueChange={(value) => setNewCandidate((prev) => ({ ...prev, course: value }))} value={newCandidate.course || ""}>
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
                        </div>
                        <div className="text-black">
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
                        </div>
                        <div className="pt-4 border-t border-gray-200 bg-white">
                            <Button onClick={handleUpdateCandidate} className="w-full bg-red-900 hover:bg-red-800">
                                Update Candidate
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Edit Position Dialog */}
                <Dialog open={isEditPositionOpen} onOpenChange={setIsEditPositionOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="text-red-900">Edit Position</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="edit-position-title" className="text-black">Position Title</Label>
                                <Input className="text-black"
                                    id="edit-position-title"
                                    value={editPositionFields.title || ''}
                                    onChange={(e) => handleEditPositionFieldChange('title', e.target.value)}
                                    placeholder="e.g., President"
                                />
                            </div>
                            <div>
                                <Label htmlFor="edit-position-description" className="text-black">Description</Label>
                                <Textarea className="text-black"
                                    id="edit-position-description"
                                    value={editPositionFields.description || ''}
                                    onChange={(e) => handleEditPositionFieldChange('description', e.target.value)}
                                    placeholder="Describe the role and responsibilities..."
                                    rows={3}
                                />
                            </div>
                            <div>
                                <Label htmlFor="edit-max-candidates" className="text-black">Maximum Candidates</Label>
                                <Input className="text-black"
                                    id="edit-max-candidates"
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={editPositionFields.maxCandidates || 3}
                                    onChange={(e) => handleEditPositionFieldChange('maxCandidates', Number.parseInt(e.target.value))}
                                />
                            </div>
                            <div>
                                <Label htmlFor="edit-is-required" className="text-black">Required position</Label>
                                <input
                                    type="checkbox"
                                    id="edit-is-required"
                                    checked={!!editPositionFields.isRequired}
                                    onChange={(e) => handleEditPositionFieldChange('isRequired', e.target.checked)}
                                />
                                <span className="ml-2 text-black">Voters must vote for this</span>
                            </div>
                            <Button onClick={handleSaveEditPosition} className="w-full bg-red-900 hover:bg-red-800">
                                Save Changes
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
                    <div className="bg-gradient-to-r from-red-50 to-yellow-50 p-6 rounded-lg border border-red-200">
                        <h2 className="text-2xl font-bold text-red-900 mb-2">{election.name || "Untitled Election"}</h2>
                        <p className="text-gray-700 mb-4">{election.description || "No description provided"}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-semibold text-red-900">Voting Opens:</span>
                            <p>
                            {election.startDate} {election.startTime} (SGT)
                            </p>
                        </div>
                        <div>
                            <span className="font-semibold text-red-900">Voting Closes:</span>
                            <p>
                            {election.endDate} {election.endTime} (SGT)
                            </p>
                        </div>
                        </div>
                        <div className="mt-2 text-xs text-blue-600">
                            <p>All times are in Singapore timezone (UTC+8)</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-red-900 mb-4">Positions & Candidates</h3>
                        <div className="space-y-4">
                        {election.positions.map((position) => (
                            <Card key={position.id} className="border border-red-200">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-red-900">{position.title}</h4>
                                <div className="flex gap-2">
                                  <Badge className="bg-yellow-100 text-yellow-800">
                                    {getPositionCandidates(position.id).length} candidates
                                  </Badge>
                                  {election.settings.allowAbstain && (
                                    <Badge className="bg-blue-100 text-blue-800">
                                      + Abstain option
                                    </Badge>
                                  )}
                                </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">{position.description}</p>
                                <div className="flex flex-wrap gap-2">
                                {getPositionCandidates(position.id).map((candidate) => (
                                    <Badge key={candidate.id} variant="outline" className="bg-white">
                                    {candidate.name}
                                    </Badge>
                                ))}
                                {election.settings.allowAbstain && (
                                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                    Abstain
                                  </Badge>
                                )}
                                </div>
                            </CardContent>
                            </Card>
                        ))}
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-blue-900 mb-2">Election Settings</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-blue-700">University Level Election:</span>
                                <span className="font-medium">{election.settings.isUniLevel ? 'Yes' : 'No'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-blue-700">Allow Abstain Votes:</span>
                                <span className="font-medium">{election.settings.allowAbstain ? 'Yes' : 'No'}</span>
                            </div>
                            {election.settings.allowAbstain && (
                                <p className="text-blue-600 text-xs mt-2">
                                    ℹ️ Voters will see an "Abstain" option for each position, allowing them to choose not to vote for any candidate.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-center pt-6">
                        <Button
                        onClick={handleCreateElection}
                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
                        disabled={
                            !election.name || !election.startDate || !election.endDate || election.positions.length === 0
                        }
                        >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Create Election
                        </Button>
                    </div>
                    </CardContent>
                </Card>
                )}

                {/* Candidate Detail Modal */}
                <CandidateDetailModal
                candidate={
                  detailViewCandidate? {
                    ...detailViewCandidate,
                    positionName: getPositionById(detailViewCandidate.positionId)?.title || "Unknown Position"
                  } : null
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
  )
}
