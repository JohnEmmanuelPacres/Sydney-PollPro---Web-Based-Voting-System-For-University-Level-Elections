import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/utils/supabaseClient';

interface Position {
  id: string;
  title: string;
}

interface ApplyCandidateModalProps {
  open: boolean;
  onClose: () => void;
  electionId: string;
  positions: Position[];
  userId: string;
  onApplicationSubmitted?: () => void;
}

const courseYearOptions = [
  'BS Civil Engineering - 1st Year',
  'BS Civil Engineering - 2nd Year',
  'BS Civil Engineering - 3rd Year',
  'BS Civil Engineering - 4th Year',
  'BS Civil Engineering - 5th Year',
  'BS Computer Science - 1st Year',
  'BS Computer Science - 2nd Year',
  'BS Computer Science - 3rd Year',
  'BS Computer Science - 4th Year',
  'BS Computer Science - 5th Year',
  // Add more as needed
];

export const ApplyCandidateModal: React.FC<ApplyCandidateModalProps> = ({ open, onClose, electionId, positions, userId, onApplicationSubmitted }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [positionId, setPositionId] = useState('');
  const [courseYear, setCourseYear] = useState('');
  const [credentials, setCredentials] = useState('');
  const [platform, setPlatform] = useState('');
  const [pictureFile, setPictureFile] = useState<File | null>(null);
  const [pictureUrl, setPictureUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [qualificationsFile, setQualificationsFile] = useState<File | null>(null);
  const [qualificationsPreview, setQualificationsPreview] = useState<string | null>(null);
  const [qualificationsUrl, setQualificationsUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const qualificationsInputRef = useRef<HTMLInputElement>(null);

  // Fetch user email and course_year from voter_profiles
  useEffect(() => {
    if (!userId) return;
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('voter_profiles')
        .select('email, full_name, course_year')
        .eq('user_id', userId)
        .single();
      if (data) {
        setEmail(data.email || '');
        setFullName(data.full_name || '');
        setCourseYear(data.course_year || '');
      }
    };
    fetchProfile();
  }, [userId]);

  // Check if already applied
  useEffect(() => {
    if (!userId || !electionId || !positionId) return;
    const checkApplied = async () => {
      const { data } = await supabase
        .from('candidates')
        .select('id')
        .eq('election_id', electionId)
        .eq('position_id', positionId)
        .eq('email', email)
        .maybeSingle();
      setAlreadyApplied(!!(data && data.id));
    };
    checkApplied();
  }, [userId, electionId, positionId, email, open]);

  // Handle image preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPictureFile(file);
      setPictureUrl(URL.createObjectURL(file));
    }
  };

  // Handle qualifications image preview and upload
  const handleQualificationsChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setQualificationsFile(file);
    setQualificationsPreview(URL.createObjectURL(file));
    // Upload to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `qualifications-${userId}-${Date.now()}.${fileExt}`;
    const filePath = `Qualifications/${fileName}`;
    const { error } = await supabase.storage.from('election').upload(filePath, file, { upsert: true });
    if (error) {
      setError('Failed to upload qualifications image');
      return;
    }
    const { data } = supabase.storage.from('election').getPublicUrl(filePath);
    setQualificationsUrl(data.publicUrl);
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    let uploadedUrl = null;
    // Debug: log all relevant fields
    console.log('Submit values:', { fullName, positionId, credentials, platform, courseYear, userId, qualificationsUrl });
    if (!fullName || !positionId || !credentials || !platform) {
      setError('Missing required fields.');
      setSubmitting(false);
      return;
    }
    // Ensure courseYear is not undefined
    const safeCourseYear = courseYear || '';
    try {
      // Upload image if present
      if (pictureFile) {
        setUploading(true);
        const fileExt = pictureFile.name.split('.').pop();
        const filePath = `candidate1/candidate-${userId}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('election').upload(filePath, pictureFile, { upsert: true });
        if (uploadError) throw new Error('Failed to upload image');
        const { data } = supabase.storage.from('election').getPublicUrl(filePath);
        uploadedUrl = data.publicUrl;
        setUploading(false);
      }
      // Submit application
      const res = await fetch('/api/apply-candidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          electionId,
          positionId,
          fullName,
          courseYear: safeCourseYear, // from profile, always defined
          credentials,
          platform,
          pictureUrl: uploadedUrl,
          qualifications_url: qualificationsUrl,
          userId,
        }),
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.error || 'Failed to apply');
      setSuccess(true);
      if (onApplicationSubmitted) onApplicationSubmitted();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFullName('');
    setPositionId('');
    setCourseYear('');
    setCredentials('');
    setPlatform('');
    setPictureFile(null);
    setPictureUrl(null);
    setError(null);
    setSuccess(false);
    setAlreadyApplied(false);
    setQualificationsFile(null);
    setQualificationsPreview(null);
    setQualificationsUrl(null);
  };

  useEffect(() => {
    if (!open) resetForm();
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[20rem] rounded-3xl p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-red-900">Apply as Candidate</DialogTitle>
        </DialogHeader>
        {success || alreadyApplied ? (
          <div className="text-green-700 text-center py-8">
            <p>You have already applied for this position. You cannot apply again.</p>
            <Button className="mt-4" onClick={onClose}>Close</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-red-900">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-2">
                {pictureUrl ? (
                  <img src={pictureUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-red-900">No Image</span>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
                disabled={uploading}
              />
              <Button type="button" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="bg-red-900 text-white">
                {uploading ? 'Uploading...' : (pictureUrl ? 'Change Picture' : 'Upload Picture')}
              </Button>
            </div>
            <div>
              <Label className="text-red-900">Insert Qualifications</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  value={qualificationsUrl ? qualificationsUrl.split('/').pop() : ''}
                  readOnly
                  placeholder="No file uploaded"
                  className="flex-1 text-red-900 placeholder-red-300"
                />
                <input
                  type="file"
                  accept="image/*"
                  ref={qualificationsInputRef}
                  style={{ display: 'none' }}
                  onChange={handleQualificationsChange}
                  disabled={uploading}
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={() => qualificationsInputRef.current?.click()}
                  disabled={uploading}
                  className="bg-red-900 text-white"
                >
                  Upload
                </Button>
              </div>
            </div>
            <div>
              <Label className="text-red-900">Full Name</Label>
              <Input value={fullName} onChange={e => setFullName(e.target.value)} required className="text-gray-400 placeholder-red-300" />
            </div>
            <div>
              <Label className="text-red-900">Position</Label>
              <select className="w-full border rounded p-2 text-gray-400" value={positionId} onChange={e => setPositionId(e.target.value)} required>
                <option value="" className="text-red-300">Select position</option>
                {positions.map(pos => (
                  <option key={pos.id} value={pos.id} className="text-red-900">{pos.title}</option>
                ))}
              </select>
            </div>
            <div>
              <Label className="text-red-900">Credentials</Label>
              <textarea 
                className="w-full border rounded p-2 text-red-900 placeholder-gray-400 resize-none" 
                value={credentials} 
                onChange={e => setCredentials(e.target.value)} 
                required 
                rows={3}
                placeholder="Enter your credentials, achievements, and experience..."
                style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
              />
            </div>
            <div>
              <Label className="text-red-900">Platform Summary</Label>
              <textarea 
                className="w-full border rounded p-2 text-red-900 placeholder-gray-400 resize-none" 
                value={platform} 
                onChange={e => setPlatform(e.target.value)} 
                required 
                rows={3}
                placeholder="Describe your platform and goals..."
                style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
              />
            </div>
            {error && <div className="text-red-600 text-sm text-center">{error}</div>}
            <div className="flex flex-col gap-2 pt-1">
              <Button type="submit" disabled={submitting || alreadyApplied} className="bg-red-900 text-white w-full">
                {alreadyApplied ? 'Already Applied' : (submitting ? 'Submitting...' : 'Submit Application')}
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="outline" className="text-red-900 border-red-900 w-full" onClick={onClose}>Cancel</Button>
              </DialogClose>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ApplyCandidateModal; 