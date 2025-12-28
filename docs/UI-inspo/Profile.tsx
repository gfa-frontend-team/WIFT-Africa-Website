import { useState } from "react";
import {
  Camera,
  MapPin,
  Mail,
  Globe,
  Edit3,
  Plus,
  Award,
  Users,
  Eye,
  Briefcase,
  FileText,
  Upload,
  Download,
  Trash2,
  CheckCircle,
  X,
} from "lucide-react";
import { currentUser } from "../../data/mockData";
import { type User } from "../../types";
import Badge from "../../components/ui/Badge";
import AvailabilityBanner from "../../components/ui/AvailabilityBanner";
import BadgeManager from "../../components/ui/BadgeManager";
import Avatar from "../../components/ui/Avatar";
import { Button } from "../../components/ui/button";

// CV Upload Section Component
function CVUploadSection({ user }: { user: User }) {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Simulate existing CV from user data
  const existingCV = user.cvFileName;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['.pdf', '.doc', '.docx'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (!validTypes.includes(fileExtension)) {
        alert('Please upload a PDF, DOC, or DOCX file');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }

      setCvFile(file);
      setUploadSuccess(false);
    }
  };

  const handleUpload = async () => {
    if (!cvFile) return;

    setIsUploading(true);
    
    // Simulate upload
    setTimeout(() => {
      console.log('Uploading CV:', cvFile.name);
      setIsUploading(false);
      setUploadSuccess(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setUploadSuccess(false);
        setCvFile(null);
      }, 3000);
    }, 1500);
  };

  const handleDelete = () => {
    console.log('Deleting CV');
    setShowDeleteConfirm(false);
    // In real app: call API to delete CV
  };

  const handleDownload = () => {
    console.log('Downloading CV:', existingCV);
    // In real app: download the CV file
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Professional Documents
        </h2>
      </div>

      {/* Current CV Display */}
      {existingCV && !cvFile && (
        <div className="mb-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-foreground truncate">
                  {existingCV}
                </p>
                <p className="text-xs text-muted-foreground">
                  Uploaded: {user.createdAt.toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              <button
                onClick={handleDownload}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
                title="Download CV"
              >
                <Download className="h-4 w-4 text-muted-foreground" />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                title="Delete CV"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-foreground mb-3">
            Are you sure you want to delete your CV?
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Upload New CV */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {existingCV ? 'Update CV/Resume' : 'Upload CV/Resume'}
        </label>
        <p className="text-xs text-muted-foreground mb-3">
          PDF, DOC, or DOCX (Max 10MB)
        </p>

        {/* File Input */}
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileSelect}
          className="hidden"
          id="cv-file-input"
        />

        {!cvFile ? (
          <button
            onClick={() => document.getElementById('cv-file-input')?.click()}
            className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-border rounded-lg hover:bg-accent transition-colors"
          >
            <Upload className="h-4 w-4" />
            <span className="text-sm">Choose File</span>
          </button>
        ) : (
          <div className="space-y-3">
            {/* Selected File */}
            <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm font-medium truncate">
                    {cvFile.name}
                  </span>
                </div>
                <button
                  onClick={() => setCvFile(null)}
                  className="p-1 hover:bg-accent rounded transition-colors flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {(cvFile.size / 1024).toFixed(1)} KB
              </p>
            </div>

            {/* Upload Button */}
            <Button
              onClick={handleUpload}
              disabled={isUploading}
              className="w-full"
            >
              {isUploading ? (
                <>
                  <Upload className="h-4 w-4 mr-2 animate-pulse" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload CV
                </>
              )}
            </Button>
          </div>
        )}

        {/* Success Message */}
        {uploadSuccess && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-800">
              CV uploaded successfully!
            </span>
          </div>
        )}
      </div>

      {/* Help Text */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800">
          <strong>Tip:</strong> Keep your CV updated to increase your chances of being discovered by recruiters and collaborators.
        </p>
      </div>
    </div>
  );
}

export default function Profile() {
  const user = currentUser;

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Banner */}
        <div className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-t-2xl h-48 mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-t-2xl" />
          <button className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full transition-colors">
            <Camera className="h-5 w-5" />
          </button>
        </div>

        {/* Profile Header */}
        <div className="bg-card border border-border rounded-b-2xl -mt-6 relative">
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Photo */}
              <div className="relative -mt-16 md:-mt-20">
                <div className="border-4 border-card rounded-full">
                  <Avatar
                    src={user.profilePhoto}
                    name={user.name}
                    size="2xl"
                    className="w-32 h-32"
                  />
                </div>
                <button className="absolute bottom-2 right-2 p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                      {user.name}
                    </h1>
                    <p className="text-xl text-muted-foreground mb-2">
                      {user.professionalTitle}
                    </p>
                    <div className="flex flex-col gap-2 mb-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{user.location}</span>
                      </div>
                      {user.chapter && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>
                            {user.chapter === 'hq' ? 'WIFT Africa (HQ)' : `WIFT ${user.chapter.charAt(0).toUpperCase() + user.chapter.slice(1).replace('_', ' ')}`}
                          </span>
                          {user.chapterStatus === 'accepted' && (
                            <CheckCircle className="h-3 w-3 text-green-500" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
                    <Edit3 className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </button>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <div className="flex flex-wrap gap-2">
                    {user.badges.map((badge) => (
                      <Badge key={badge.id} badge={badge} size="sm" />
                    ))}
                  </div>
                </div>

                {/* Profile Stats */}
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-2xl font-bold text-foreground mb-1">
                      <Eye className="h-5 w-5 text-primary" />
                      <span>2.5K</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Profile Views
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-2xl font-bold text-foreground mb-1">
                      <Users className="h-5 w-5 text-primary" />
                      <span>156</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Connections</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-2xl font-bold text-foreground mb-1">
                      <Briefcase className="h-5 w-5 text-primary" />
                      <span>12</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Projects</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Availability Banner */}
        <div className="mt-6">
          <AvailabilityBanner
            isAvailable={user.isAvailableForWork}
            message={user.availabilityMessage}
            isOwner={true}
          />
        </div>

        {/* Profile Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* About Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">About</h2>
                <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                  <Edit3 className="h-4 w-4" />
                </button>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {user.biography}
              </p>
            </div>

            {/* Badges Section */}
            <div className="bg-card border border-border rounded-lg p-6">
              <BadgeManager
                userBadges={user.badges}
                isOwner={true}
                onAddBadge={(badge) => console.log("Adding badge:", badge)}
                onRemoveBadge={(badgeId) =>
                  console.log("Removing badge:", badgeId)
                }
              />
            </div>

            {/* Experience Section */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">
                  Experience
                </h2>
                <button className="flex items-center gap-2 px-3 py-1 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors">
                  <Plus className="h-4 w-4" />
                  <span>Add Experience</span>
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">
                      Film Director
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Independent • 2020 - Present
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Directing narrative films that explore African identity
                      and culture.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Portfolio Section */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">
                  Portfolio
                </h2>
                <button className="flex items-center gap-2 px-3 py-1 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors">
                  <Plus className="h-4 w-4" />
                  <span>Add Work</span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <span className="text-muted-foreground">Demo Reel</span>
                </div>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <span className="text-muted-foreground">
                    Project Showcase
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  Contact
                </h2>
                <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                  <Edit3 className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-primary">
                    www.amaraokafor.com
                  </span>
                </div>
              </div>
            </div>

            {/* Professional Documents */}
            <CVUploadSection user={user} />

            {/* Profile Completion */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Profile Strength
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Completion</span>
                    <span className="text-sm text-muted-foreground">
                      {user.completionPercentage}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${user.completionPercentage}%` }}
                    />
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Add more details to increase your profile visibility
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Recent Achievements
              </h2>
              <div className="space-y-3">
                {user.badges.slice(0, 2).map((badge) => (
                  <div key={badge.id} className="flex items-center gap-3">
                    <span className="text-2xl">{badge.icon}</span>
                    <div>
                      <p className="font-medium text-sm">{badge.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {badge.earnedAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
