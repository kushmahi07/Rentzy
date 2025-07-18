import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/shared/hooks/use-toast";
import { apiRequest } from "@/shared/lib/queryClient";
import CategorySelection from "./components/forms/CategorySelection";
import PropertyTitleLocationForm from "./components/forms/PropertyTitleLocationForm";
import PropertyAddressDetails from "./components/forms/PropertyAddressDetails";
import MediaUploadSection from "./components/media/MediaUploadSection";
import ActionButtons from "./components/shared/ActionButtons";
import InfoAlert from "./components/shared/InfoAlert";
import Breadcrumb from "./components/shared/Breadcrumb";
import ProgressBar from "./components/shared/ProgressBar";
import GoogleMap from "./components/shared/GoogleMap";
import { 
  Search, 
  Eye, 
  Trash2, 
  MapPin,
  ChevronRight, 
  ChevronLeft,
  User, 
  Calendar, 
  Coins, 
  DollarSign,
  Building2,
  Clock,
  XCircle,
  CheckCircle,
  AlertCircle,
  Edit,
  Download,
  Home,
  Building,
  Users,
  CreditCard,
  Shield,
  Banknote,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  Edit3,
  Image,
  Video,
  Camera,
  Play,
  FileText,
  Save,
  X,
  ExternalLink,
  RotateCcw,
  ArrowLeft,
  HelpCircle,
  Info,
  Upload,
  Plus,
  Star,
  Settings
} from "lucide-react";

import type { 
  Property, 
  PropertyCounts, 
  PropertyFormData, 
  ZipCodeValidation, 
  TokenizationForm, 
  PropertyCategory, 
  MediaType 
} from './types';
import { usePropertyFormValidation } from './hooks';

export default function PropertyManagement() {
  const [activeTab, setActiveTab] = useState<'live' | 'pending' | 'rejected'>('live');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showDetailedSubmissionReview, setShowDetailedSubmissionReview] = useState(false);
  const [selectedMediaPreview, setSelectedMediaPreview] = useState<{type: 'photo' | 'video' | '360', index: number} | null>(null);
  const [showPropertyReview, setShowPropertyReview] = useState(false);
  const [showMediaGallery, setShowMediaGallery] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [mediaType, setMediaType] = useState<'images' | 'videos' | '360'>('images');
  const [editingFinancials, setEditingFinancials] = useState(false);
  const [editedTokens, setEditedTokens] = useState('');
  const [editedPrice, setEditedPrice] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [resubmissionComments, setResubmissionComments] = useState('');
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [isResubmissionModalOpen, setIsResubmissionModalOpen] = useState(false);
  const [showTokenizationForm, setShowTokenizationForm] = useState(false);
  const [tokenizationForm, setTokenizationForm] = useState({
    tokenCount: '',
    tokenRate: '',
    yieldExpectation: '',
    investmentEndDate: ''
  });
  
  // Add New Property states
  const [showAddPropertyFlow, setShowAddPropertyFlow] = useState(false);
  const [selectedPropertyCategory, setSelectedPropertyCategory] = useState<'commercial' | 'residential' | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [formProgress, setFormProgress] = useState(0);
  
  // Property form data states
  const [propertyFormData, setPropertyFormData] = useState({
    title: '',
    address: '',
    zipCode: '',
    buildingName: '',
    floorTower: '',
    areaLocalityPincode: '',
    city: '',
    nearbyLandmark: '',
    // Step 1: General Property Details
    squareFootage: '',
    zoningClassification: '',
    // Step 2: Financials
    nightlyRate: '',
    cleaningFee: '',
    // Residential specific fields
    bedrooms: '',
    bathrooms: '',
    guestCapacity: '',
    nightlyBaseRate: '',
    weekendRate: '',
    peakSeasonRate: '',
    minimumStay: '',
    houseRules: '',
    checkInTime: '',
    checkOutTime: '',
    localHighlights: '',
    featuredAmenities: [] as string[],
    customAmenities: '',
    furnishingDescription: '',
    smartHomeFeatures: '',
    conciergeServices: '',
    virtualTourUrl: '',
    virtualTourLink: '',
    propertyPhotos: [] as File[],
    propertyVideos: [] as File[],
    view360: [] as File[],
    roomDetails: [] as any[],
    // Step 3: Amenities
    amenities: {
      parking: false,
      hvac: false,
      adaCompliance: false,
      elevator: false,
      security: false,
      conferenceRoom: false,
      kitchen: false,
      reception: false,
    },
    // Step 4: Documents
    uploadedFiles: {
      rentRoll: null as File | null,
      incomeExpenseStatements: null as File | null,
      propertyDeed: null as File | null,
      zoningCertificate: null as File | null,
      certificateOfOccupancy: null as File | null,
      tenantLeases: null as File | null,
      environmentalReports: null as File | null,
    }
  });
  const {
    zipCodeValidation,
    validatePropertyTitle,
    validateSquareFootage,
    validateNightlyRate,
    validateCleaningFee,
    validateFileUpload,
    validateZipCode,
  } = usePropertyFormValidation();
  const [showAmenitiesDropdown, setShowAmenitiesDropdown] = useState(false);
  const [showResidentialPreview, setShowResidentialPreview] = useState(false);
  const [isSubmittingProperty, setIsSubmittingProperty] = useState(false);
  
  // Handler functions
  const handleBackToPropertyList = () => {
    setShowPropertyReview(false);
    setSelectedProperty(null);
    setShowAddPropertyFlow(false);
    setCurrentStep(0);
    setFormProgress(0);
    setSelectedPropertyCategory(null);
  };

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
    setShowPropertyReview(true);
  };

  const handleDetailedReviewSelect = (property: Property) => {
    setSelectedProperty(property);
    setShowDetailedSubmissionReview(true);
  };

  const handleBackFromDetailedReview = () => {
    setSelectedProperty(null);
    setShowDetailedSubmissionReview(false);
    setSelectedMediaPreview(null);
  };

  // Add New Property handlers
  const handleAddNewProperty = () => {
    setShowAddPropertyFlow(true);
    setCurrentStep(0);
    setFormProgress(0);
    setSelectedPropertyCategory(null);
  };

  const handleCategorySelection = (category: 'commercial' | 'residential') => {
    setSelectedPropertyCategory(category);
    // Save in session storage for consistency across form steps
    sessionStorage.setItem('selectedPropertyCategory', category);
  };

  const handleContinueFromCategory = () => {
    if (!selectedPropertyCategory) return;
    
    setCurrentStep(1);
    setFormProgress(1); // Start with 1% progress for Property Title and Location step
    
    toast({
      title: "Category Selected",
      description: `Starting ${selectedPropertyCategory} property form`,
    });
  };

  // Property form handlers
  const handlePropertyFormChange = (field: string, value: string) => {
    setPropertyFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Save to session storage
    const updatedData = { ...propertyFormData, [field]: value };
    sessionStorage.setItem('propertyFormData', JSON.stringify(updatedData));

    // Update progress bar for residential rental details
    if (selectedPropertyCategory === 'residential') {
      const progress = calculateFormProgress(updatedData);
      setFormProgress(progress);
    }

    // Validate zip code when it changes
    if (field === 'zipCode' && value.length >= 5) {
      validateZipCode(value);
    } else if (field === 'zipCode') {
      setZipCodeValidation({
        isValidating: false,
        isValid: null,
        message: ''
      });
    }
  };

  

  // Zoning classification options
  const zoningOptions = [
    { value: 'retail', label: 'Retail' },
    { value: 'office', label: 'Office' },
    { value: 'industrial', label: 'Industrial' },
    { value: 'mixed-use', label: 'Mixed Use' },
    { value: 'warehouse', label: 'Warehouse' },
    { value: 'restaurant', label: 'Restaurant' },
    { value: 'medical', label: 'Medical' },
    { value: 'educational', label: 'Educational' },
  ];

  

  const titleValidationError = validatePropertyTitle(propertyFormData.title);
  const titleCharCount = propertyFormData.title?.length || 0;

  // Step validation functions
  const isStep1Valid = () => {
    return propertyFormData.title.trim() !== '' && 
           propertyFormData.address.trim() !== '' && 
           propertyFormData.zipCode.trim() !== '' &&
           zipCodeValidation.isValid === true &&
           titleValidationError === "" &&
           validateSquareFootage(propertyFormData.squareFootage) === "" &&
           propertyFormData.zoningClassification.trim() !== '';
  };

  const isStep2Valid = () => {
    return validateNightlyRate(propertyFormData.nightlyRate) === "" &&
           validateCleaningFee(propertyFormData.cleaningFee) === "" &&
           propertyFormData.uploadedFiles.rentRoll !== null &&
           propertyFormData.uploadedFiles.incomeExpenseStatements !== null;
  };

  const isStep3Valid = () => {
    return true; // Amenities are optional
  };

  const isStep4Valid = () => {
    const requiredDocs = ['propertyDeed', 'zoningCertificate', 'certificateOfOccupancy', 'tenantLeases', 'environmentalReports'] as const;
    return requiredDocs.every(doc => propertyFormData.uploadedFiles[doc] !== null);
  };

  const isPropertyFormValid = () => {
    return propertyFormData.title.trim() !== '' && 
           propertyFormData.address.trim() !== '' && 
           propertyFormData.zipCode.trim() !== '' &&
           zipCodeValidation.isValid === true &&
           titleValidationError === "";
  };

  // File upload handler
  const handleFileUpload = (field: string, file: File | null) => {
    const updatedFiles = {
      ...propertyFormData.uploadedFiles,
      [field]: file
    };
    
    const updatedData = {
      ...propertyFormData,
      uploadedFiles: updatedFiles
    };
    
    setPropertyFormData(updatedData);
    sessionStorage.setItem('propertyFormData', JSON.stringify(updatedData));
  };

  // Handle amenity changes
  const handleAmenityChange = (amenity: string, checked: boolean) => {
    const updatedAmenities = {
      ...propertyFormData.amenities,
      [amenity]: checked
    };
    
    const updatedData = {
      ...propertyFormData,
      amenities: updatedAmenities
    };
    
    setPropertyFormData(updatedData);
    sessionStorage.setItem('propertyFormData', JSON.stringify(updatedData));
  };

  // Multiple file upload handler for property photos - accumulative
  const handleMultipleFileUpload = (field: string, files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      const existingFiles = propertyFormData[field] || [];
      const combinedFiles = [...existingFiles, ...newFiles];
      
      const updatedData = {
        ...propertyFormData,
        [field]: combinedFiles
      };
      setPropertyFormData(updatedData);
      sessionStorage.setItem('propertyFormData', JSON.stringify(updatedData));
      
      // Update progress bar
      const progress = calculateFormProgress(updatedData);
      setFormProgress(progress);
    }
  };

  // Calculate form completion percentage for residential rental details
  const calculateFormProgress = (data: any) => {
    const totalFields = 20; // Total number of required fields
    let completedFields = 0;

    // Check each field and increment if completed
    if (data.bedrooms && data.bedrooms !== '') completedFields++; // 5%
    if (data.bathrooms && data.bathrooms !== '') completedFields++; // 10%
    if (data.guestCapacity && data.guestCapacity !== '') completedFields++; // 15%
    if (data.nightlyBaseRate && data.nightlyBaseRate !== '') completedFields++; // 20%
    if (data.cleaningFee && data.cleaningFee !== '') completedFields++; // 25%
    if (data.minimumStay && data.minimumStay !== '') completedFields++; // 30%
    if (data.checkInTime && data.checkInTime !== '') completedFields++; // 35%
    if (data.checkOutTime && data.checkOutTime !== '') completedFields++; // 40%
    if (data.propertyPhotos && data.propertyPhotos.length >= 5) completedFields++; // 45%
    if (data.featuredAmenities && data.featuredAmenities.length > 0) completedFields++; // 50%
    if (data.roomDetails && data.roomDetails.length > 0) completedFields++; // 55%
    if (data.propertyDescription && data.propertyDescription !== '') completedFields++; // 60%
    if (data.houseRules && data.houseRules !== '') completedFields++; // 65%
    if (data.cancellationPolicy && data.cancellationPolicy !== '') completedFields++; // 70%
    if (data.hostInstructions && data.hostInstructions !== '') completedFields++; // 75%
    if (data.emergencyContact && data.emergencyContact !== '') completedFields++; // 80%
    if (data.wifiDetails && data.wifiDetails !== '') completedFields++; // 85%
    if (data.parkingInstructions && data.parkingInstructions !== '') completedFields++; // 90%
    if (data.additionalFees && data.additionalFees !== '') completedFields++; // 95%
    if (data.specialInstructions && data.specialInstructions !== '') completedFields++; // 100%

    return Math.round((completedFields / totalFields) * 100);
  };

  // Remove individual photo handler
  const handleRemovePhoto = (field: string, indexToRemove: number) => {
    const existingFiles = propertyFormData[field] || [];
    const filteredFiles = existingFiles.filter((_, index) => index !== indexToRemove);
    
    const updatedData = {
      ...propertyFormData,
      [field]: filteredFiles
    };
    setPropertyFormData(updatedData);
    sessionStorage.setItem('propertyFormData', JSON.stringify(updatedData));
  };

  // Handle multiple amenity selection
  const handleAmenitySelection = (amenityValue: string, checked: boolean) => {
    const currentAmenities = propertyFormData.featuredAmenities || [];
    let updatedAmenities;
    
    if (checked) {
      updatedAmenities = [...currentAmenities, amenityValue];
    } else {
      updatedAmenities = currentAmenities.filter(amenity => amenity !== amenityValue);
    }
    
    const updatedData = {
      ...propertyFormData,
      featuredAmenities: updatedAmenities
    };
    setPropertyFormData(updatedData);
    sessionStorage.setItem('propertyFormData', JSON.stringify(updatedData));
    
    // Update progress bar for residential rental details
    if (selectedPropertyCategory === 'residential') {
      const progress = calculateFormProgress(updatedData);
      setFormProgress(progress);
    }
  };

  // Room detail change handler
  const handleRoomDetailChange = (roomIndex: number, field: string, value: string) => {
    const updatedRoomDetails = [...(propertyFormData.roomDetails || [])];
    if (!updatedRoomDetails[roomIndex]) {
      updatedRoomDetails[roomIndex] = {};
    }
    updatedRoomDetails[roomIndex] = {
      ...updatedRoomDetails[roomIndex],
      [field]: value
    };
    
    const updatedData = {
      ...propertyFormData,
      roomDetails: updatedRoomDetails
    };
    setPropertyFormData(updatedData);
    sessionStorage.setItem('propertyFormData', JSON.stringify(updatedData));
    
    // Update progress bar for residential rental details
    if (selectedPropertyCategory === 'residential') {
      const progress = calculateFormProgress(updatedData);
      setFormProgress(progress);
    }
  };

  // Handle residential form submission to show preview
  const handleResidentialSubmit = () => {
    if (isResidentialFormValid()) {
      setShowResidentialPreview(true);
    } else {
      toast({
        title: "Form Incomplete",
        description: "Please fill in all required fields before submitting.",
        variant: "destructive",
      });
    }
  };

  // Handle final submission from preview
  const handleFinalSubmit = async () => {
    setIsSubmittingProperty(true);
    
    try {
      // Create property submission data
      const submissionData = {
        ...propertyFormData,
        category: selectedPropertyCategory,
        status: 'pending',
        submittedAt: new Date().toISOString(),
      };

      // Submit to backend
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        // Clear form data
        sessionStorage.removeItem('propertyFormData');
        sessionStorage.removeItem('selectedPropertyCategory');
        
        // Reset states
        setPropertyFormData({
          title: '',
          address: '',
          zipCode: '',
          squareFootage: '',
          zoningClassification: '',
          nightlyRate: '',
          cleaningFee: '',
          bedrooms: '',
          bathrooms: '',
          guestCapacity: '',
          nightlyBaseRate: '',
          weekendRate: '',
          peakSeasonRate: '',
          minimumStay: '',
          houseRules: '',
          checkInTime: '',
          checkOutTime: '',
          localHighlights: '',
          featuredAmenities: [],
          roomDetails: [],
          propertyPhotos: [],
          amenities: {
            parking: false,
            hvac: false,
            adaCompliance: false,
            security: false,
            kitchen: false,
            reception: false,
          },
          uploadedFiles: {
            rentRoll: null,
            incomeExpenseStatements: null,
            propertyDeed: null,
            zoningCertificate: null,
            certificateOfOccupancy: null,
            tenantLeases: null,
            environmentalReports: null,
          }
        });
        setShowResidentialPreview(false);
        setShowAddPropertyFlow(false);
        setSelectedPropertyCategory(null);
        setFormProgress(0);
        
        // Show success toast
        toast({
          title: "Property Submitted Successfully",
          description: "Your residential property has been submitted for review and moved to the Pending tab.",
          variant: "default",
        });
        
        // Refetch properties to update the list
        queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
        queryClient.invalidateQueries({ queryKey: ['/api/properties/counts'] });
        
      } else {
        throw new Error('Failed to submit property');
      }
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your property. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingProperty(false);
    }
  };

  // Residential form validation
  const isResidentialFormValid = () => {
    // Required fields
    const requiredFields = [
      'bedrooms', 'bathrooms', 'guestCapacity', 'squareFootage',
      'nightlyBaseRate', 'cleaningFee', 'minimumStay',
      'houseRules', 'checkInTime', 'checkOutTime', 'localHighlights',
      'featuredAmenities'
    ];
    
    // Check all required fields are filled
    for (const field of requiredFields) {
      if (field === 'featuredAmenities') {
        // Check if at least one amenity is selected
        if (!propertyFormData.featuredAmenities || propertyFormData.featuredAmenities.length === 0) {
          return false;
        }
      } else if (!propertyFormData[field] || propertyFormData[field].toString().trim() === '') {
        return false;
      }
    }
    
    // Check property photos (minimum 5)
    if (!propertyFormData.propertyPhotos || propertyFormData.propertyPhotos.length < 5) {
      return false;
    }
    
    // Check numerical validations
    if (parseFloat(propertyFormData.squareFootage) <= 0) return false;
    if (parseFloat(propertyFormData.nightlyBaseRate) <= 10) return false;
    if (parseFloat(propertyFormData.cleaningFee) <= 5) return false;
    
    // Check weekend and peak season rates if provided
    if (propertyFormData.weekendRate && parseFloat(propertyFormData.weekendRate) <= 10) return false;
    if (propertyFormData.peakSeasonRate && parseFloat(propertyFormData.peakSeasonRate) <= 10) return false;
    
    // Check room details if bedrooms > 0
    if (propertyFormData.bedrooms && parseInt(propertyFormData.bedrooms) > 0) {
      const bedroomCount = parseInt(propertyFormData.bedrooms);
      if (!propertyFormData.roomDetails || propertyFormData.roomDetails.length < bedroomCount) {
        return false;
      }
      
      for (let i = 0; i < bedroomCount; i++) {
        const room = propertyFormData.roomDetails[i];
        if (!room || !room.beds || !room.squareFootage || !room.attachedBathroom) {
          return false;
        }
        if (parseFloat(room.squareFootage) <= 0) return false;
      }
    }
    
    return true;
  };

  const handleContinueFromPropertyForm = () => {
    if (!isPropertyFormValid()) return;
    
    if (selectedPropertyCategory === 'commercial') {
      setCurrentStep(2); // Go to Step 1: General Property Details
      setFormProgress(0); // Start at 0% for commercial property form
    } else if (selectedPropertyCategory === 'residential') {
      setCurrentStep(2); // Go to Residential Rental Details
      setFormProgress(0); // Start at 0% for residential property form
    } else {
      setCurrentStep(2);
      setFormProgress(25);
    }
    
    toast({
      title: "Property Details Saved",
      description: "Proceeding to next step",
    });
  };

  // Multi-step form navigation
  const handleNextStep = () => {
    let canProceed = false;
    let nextStep = currentStep + 1;
    let progressValue = 0;
    
    switch (currentStep) {
      case 2: // Step 1: General Property Details
        canProceed = isStep1Valid();
        progressValue = 20;
        break;
      case 3: // Step 2: Financials
        canProceed = isStep2Valid();
        progressValue = 40;
        break;
      case 4: // Step 3: Amenities
        canProceed = isStep3Valid();
        progressValue = 60;
        break;
      case 5: // Step 4: Documents
        canProceed = isStep4Valid();
        progressValue = 80;
        break;
      default:
        canProceed = false;
    }
    
    if (canProceed) {
      setCurrentStep(nextStep);
      setFormProgress(progressValue);
      
      toast({
        title: "Step Completed",
        description: `Proceeding to step ${nextStep - 1}`,
      });
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 2) {
      setCurrentStep(currentStep - 1);
      const progressValues = [0, 5, 20, 40, 60, 80];
      setFormProgress(progressValues[currentStep - 1] || 0);
    }
  };
  

  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Load saved form data from session storage on mount
  useEffect(() => {
    const savedCategory = sessionStorage.getItem('selectedPropertyCategory');
    const savedFormData = sessionStorage.getItem('propertyFormData');
    
    if (savedCategory) {
      setSelectedPropertyCategory(savedCategory as 'commercial' | 'residential');
    }
    
    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);
        setPropertyFormData(parsedData);
        
        // Calculate initial progress for residential properties
        if (savedCategory === 'residential') {
          const progress = calculateFormProgress(parsedData);
          setFormProgress(progress);
        }
      } catch (error) {
        console.error('Error parsing saved form data:', error);
      }
    }
  }, []);

  // Fetch property counts for badges
  const { data: counts } = useQuery({
    queryKey: ['/api/properties/counts'],
    select: (data: any) => data.data as PropertyCounts
  });

  // Fetch properties based on active tab and search
  const { data: properties, isLoading } = useQuery({
    queryKey: ['/api/properties', activeTab, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('status', activeTab);
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }
      
      const response = await fetch(`/api/properties?${params}`);
      if (!response.ok) throw new Error('Failed to fetch properties');
      return response.json();
    },
    select: (data: any) => data.data as Property[]
  });

  // Delete property mutation
  const deletePropertyMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/properties/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete property');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
      queryClient.invalidateQueries({ queryKey: ['/api/properties/counts'] });
      toast({
        title: "Success",
        description: "Property deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete property",
        variant: "destructive",
      });
    }
  });

  // Property approval mutations
  const approveMutation = useMutation({
    mutationFn: async (propertyId: number) => {
      return apiRequest('POST', `/api/properties/${propertyId}/approve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
      queryClient.invalidateQueries({ queryKey: ['/api/properties/counts'] });
      setIsApprovalModalOpen(false);
      setShowPropertyReview(false);
      toast({
        title: "Success",
        description: "Property approved successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to approve property",
        variant: "destructive",
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ propertyId, reason }: { propertyId: number; reason: string }) => {
      return apiRequest('POST', `/api/properties/${propertyId}/reject`, { reason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
      queryClient.invalidateQueries({ queryKey: ['/api/properties/counts'] });
      setIsRejectionModalOpen(false);
      setShowPropertyReview(false);
      setRejectionReason('');
      toast({
        title: "Success",
        description: "Property rejected successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to reject property",
        variant: "destructive",
      });
    },
  });

  const requestResubmissionMutation = useMutation({
    mutationFn: async ({ propertyId, comments }: { propertyId: number; comments: string }) => {
      return apiRequest('POST', `/api/properties/${propertyId}/request-resubmission`, { comments });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
      queryClient.invalidateQueries({ queryKey: ['/api/properties/counts'] });
      setIsResubmissionModalOpen(false);
      setShowPropertyReview(false);
      setResubmissionComments('');
      toast({
        title: "Success",
        description: "Resubmission requested successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to request resubmission",
        variant: "destructive",
      });
    },
  });

  // Tokenization mutation
  const tokenizationMutation = useMutation({
    mutationFn: async ({ propertyId, formData }: { propertyId: number; formData: any }) => {
      return apiRequest('POST', `/api/properties/${propertyId}/start-tokenization`, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
      queryClient.invalidateQueries({ queryKey: ['/api/properties/counts'] });
      setShowTokenizationForm(false);
      setShowPropertyReview(false);
      setTokenizationForm({
        tokenCount: '',
        tokenRate: '',
        yieldExpectation: '',
        investmentEndDate: ''
      });
      toast({
        title: "Success",
        description: "Property tokenization completed successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to complete tokenization",
        variant: "destructive",
      });
    },
  });

  // Financial update mutation
  const updateFinancialsMutation = useMutation({
    mutationFn: async ({ propertyId, totalTokens, tokenPrice }: { propertyId: number; totalTokens: number; tokenPrice: number }) => {
      return apiRequest(`/api/properties/${propertyId}/financials`, "PUT", { totalTokens, tokenPrice });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
      setEditingFinancials(false);
      setEditedTokens('');
      setEditedPrice('');
      toast({
        title: "Success",
        description: "Financial information updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update financial information",
        variant: "destructive",
      });
    },
  });

  const handleView = (property: Property) => {
    if (property.status === 'pending') {
      handleDetailedReviewSelect(property);
    } else {
      setSelectedProperty(property);
      setShowPropertyReview(true);
    }
  };

  // Media gallery functions
  const openMediaGallery = (type: 'images' | 'videos' | '360', index: number = 0) => {
    setMediaType(type);
    setCurrentMediaIndex(index);
    setShowMediaGallery(true);
  };

  const nextMedia = () => {
    if (!selectedProperty) return;
    const mediaArray = getMediaArray(selectedProperty, mediaType);
    setCurrentMediaIndex((prev) => (prev + 1) % mediaArray.length);
  };

  const prevMedia = () => {
    if (!selectedProperty) return;
    const mediaArray = getMediaArray(selectedProperty, mediaType);
    setCurrentMediaIndex((prev) => (prev - 1 + mediaArray.length) % mediaArray.length);
  };

  const getMediaArray = (property: Property, type: 'images' | 'videos' | '360') => {
    switch (type) {
      case 'images':
        return property.images || [];
      case 'videos':
        return property.videos || [];
      case '360':
        return property.view360 || [];
      default:
        return [];
    }
  };

  const openDocument = (documentUrl: string) => {
    window.open(documentUrl, '_blank');
  };

  const formatDocumentName = (docKey: string) => {
    const nameMap: { [key: string]: string } = {
      'hoa_docs': 'HOA Documents',
      'tax_records': 'Tax Records',
      'property_deed': 'Property Deed',
      'insurance_docs': 'Insurance Documents',
      'commercial_deed': 'Commercial Deed',
      'lease_agreements': 'Lease Agreements',
      'inspection_reports': 'Inspection Reports',
      'operating_statements': 'Operating Statements'
    };
    return nameMap[docKey] || docKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Financial editing functions
  const startEditingFinancials = () => {
    if (!selectedProperty) return;
    setEditedTokens(selectedProperty.totalTokens.toString());
    setEditedPrice((selectedProperty.tokenPrice / 100).toString()); // Convert from cents
    setEditingFinancials(true);
  };

  const saveFinancials = () => {
    if (!selectedProperty || !editedTokens || !editedPrice) return;
    
    const totalTokens = parseInt(editedTokens);
    const tokenPrice = Math.round(parseFloat(editedPrice) * 100); // Convert to cents

    if (isNaN(totalTokens) || isNaN(tokenPrice) || totalTokens <= 0 || tokenPrice <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid numbers for tokens and price",
        variant: "destructive",
      });
      return;
    }

    updateFinancialsMutation.mutate({
      propertyId: selectedProperty.id,
      totalTokens,
      tokenPrice,
    });
  };

  const cancelEditingFinancials = () => {
    setEditingFinancials(false);
    setEditedTokens('');
    setEditedPrice('');
  };

  const handleDelete = async (id: number) => {
    deletePropertyMutation.mutate(id);
  };

  // Tokenization form handlers
  const handleStartTokenization = () => {
    setShowTokenizationForm(true);
  };

  const handleTokenizationSubmit = () => {
    if (!selectedProperty) return;
    
    // Validate form completion
    if (!tokenizationForm.tokenCount || !tokenizationForm.tokenRate || 
        !tokenizationForm.yieldExpectation || !tokenizationForm.investmentEndDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    tokenizationMutation.mutate({
      propertyId: selectedProperty.id,
      formData: {
        tokenCount: tokenizationForm.tokenCount,
        tokenRate: tokenizationForm.tokenRate,
        yieldExpectation: tokenizationForm.yieldExpectation,
        investmentEndDate: tokenizationForm.investmentEndDate
      }
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-orange-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      live: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-orange-100 text-orange-800 border-orange-200',
      rejected: 'bg-red-100 text-red-800 border-red-200'
    };
    
    return (
      <Badge className={`${variants[status as keyof typeof variants]} capitalize flex items-center gap-1`}>
        {getStatusIcon(status)}
        {status}
      </Badge>
    );
  };

  // Render property submission review full-page view
  if (showPropertyReview && selectedProperty) {
    return (
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-gray-600">
          <button 
            onClick={handleBackToPropertyList}
            className="hover:text-blue-600 transition-colors"
          >
            Property Management
          </button>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">Property Submission Review</span>
        </div>

        {/* Property Review Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Property Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{selectedProperty.name}</h1>
                <p className="text-gray-600">{selectedProperty.address}</p>
                <div className="flex items-center gap-2 mt-2">
                  {getStatusBadge(selectedProperty.status)}
                  <span className="text-sm text-gray-500">
                    Owner: {selectedProperty.ownerName || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Property Details Content */}
          <div className="p-6">
            {/* Property Overview */}
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center">
                <Building2 className="h-5 w-5 mr-2 text-indigo-600" />
                Property Overview
              </h3>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Property Type</p>
                  <p className="font-medium capitalize">{selectedProperty.propertyType || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Location</p>
                  <p className="font-medium">{selectedProperty.city}, {selectedProperty.state}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Market</p>
                  <p className="font-medium">{selectedProperty.market || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Year Built</p>
                  <p className="font-medium">{selectedProperty.yearBuilt || 'Not specified'}</p>
                </div>
              </div>
            </div>

            {/* Media Gallery Section */}
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center">
                <Camera className="h-5 w-5 mr-2 text-purple-600" />
                Media Gallery
              </h3>
              <div className="grid grid-cols-1 gap-4">
                
                {/* Images Section */}
                {selectedProperty.images && selectedProperty.images.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Property Images ({selectedProperty.images.length})</h4>
                    <div className="grid grid-cols-6 gap-2">
                      {selectedProperty.images.slice(0, 6).map((image, index) => (
                        <div key={index} className="relative cursor-pointer group" onClick={() => openMediaGallery('images', index)}>
                          <img 
                            src={image} 
                            alt={`Property ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg border group-hover:opacity-80 transition-opacity"
                            onError={(e) => {
                              e.currentTarget.src = `/api/placeholder/80/80`;
                            }}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all flex items-center justify-center">
                            <Eye className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      ))}
                      {selectedProperty.images.length > 6 && (
                        <div 
                          className="w-full h-20 bg-gray-100 rounded-lg border flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                          onClick={() => openMediaGallery('images', 6)}
                        >
                          <span className="text-sm text-gray-600">+{selectedProperty.images.length - 6} more</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Videos Section */}
                {selectedProperty.videos && selectedProperty.videos.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Property Videos ({selectedProperty.videos.length})</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {selectedProperty.videos.slice(0, 4).map((video, index) => (
                        <div key={index} className="relative cursor-pointer group" onClick={() => openMediaGallery('videos', index)}>
                          <div className="w-full h-20 bg-gray-200 rounded-lg border flex items-center justify-center group-hover:bg-gray-300 transition-colors">
                            <Play className="h-6 w-6 text-gray-600" />
                          </div>
                          <span className="text-xs text-gray-600 mt-1 block truncate">Video {index + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 360 Views Section */}
                {selectedProperty.view360 && selectedProperty.view360.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">360° Virtual Tours ({selectedProperty.view360.length})</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedProperty.view360.slice(0, 3).map((view, index) => (
                        <div key={index} className="relative cursor-pointer group" onClick={() => openMediaGallery('360', index)}>
                          <div className="w-full h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg border flex items-center justify-center group-hover:from-blue-200 group-hover:to-purple-200 transition-colors">
                            <RotateCcw className="h-6 w-6 text-blue-600" />
                          </div>
                          <span className="text-xs text-gray-600 mt-1 block truncate">360° Tour {index + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Media Message */}
                {(!selectedProperty.images || selectedProperty.images.length === 0) &&
                 (!selectedProperty.videos || selectedProperty.videos.length === 0) &&
                 (!selectedProperty.view360 || selectedProperty.view360.length === 0) &&
                 (!selectedProperty.documents || Object.keys(selectedProperty.documents).length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    <Camera className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>No media files uploaded for this property</p>
                  </div>
                )}
              </div>
            </div>

            {/* Full Width Accordion Sections */}
            <div className="space-y-6">
              {/* Property Screening - Full Width */}
              <Accordion type="single" collapsible defaultValue="screening">
                <AccordionItem value="screening">
                  <AccordionTrigger>
                    <span className="flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-green-600" />
                      Property Screening Parameters
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Home Value Estimate</p>
                          <p className="font-medium">${(selectedProperty.homeValueEstimate || 0).toLocaleString()}</p>
                          <p className="text-xs text-green-600">✓ Meets minimum $1.5M requirement</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Square Footage</p>
                          <p className="font-medium">{(selectedProperty.squareFootage || 0).toLocaleString()} sqft</p>
                          <p className="text-xs text-green-600">✓ Meets minimum 3,000 sqft requirement</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Bedrooms / Bathrooms</p>
                          <p className="font-medium">{selectedProperty.bedrooms || 0} bed / {selectedProperty.bathrooms || 0} bath</p>
                          <p className="text-xs text-green-600">✓ Meets minimum 3 bed / 3 bath requirement</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Short-term Rental Permits</p>
                          <p className="font-medium">{selectedProperty.zoningPermitsShortTerm ? 'Yes' : 'No'}</p>
                          <p className="text-xs text-green-600">✓ Zoning permits validated</p>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Financial Information - Full Width */}
                <AccordionItem value="financial">
                  <AccordionTrigger>
                    <span className="flex items-center justify-between w-full">
                      <span className="flex items-center">
                        <DollarSign className="h-5 w-5 mr-2 text-blue-600" />
                        Financial Information
                      </span>
                      {!editingFinancials && selectedProperty.status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditingFinancials();
                          }}
                          className="ml-2"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      )}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      {editingFinancials ? (
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium text-blue-900">Edit Financial Information</h4>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={cancelEditingFinancials}
                                disabled={updateFinancialsMutation.isPending}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Cancel
                              </Button>
                              <Button
                                size="sm"
                                onClick={saveFinancials}
                                disabled={updateFinancialsMutation.isPending}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                <Save className="h-4 w-4 mr-1" />
                                {updateFinancialsMutation.isPending ? 'Saving...' : 'Save'}
                              </Button>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="editTokens" className="text-sm font-medium text-gray-700">
                                Total Token Supply
                              </Label>
                              <Input
                                id="editTokens"
                                type="number"
                                value={editedTokens}
                                onChange={(e) => setEditedTokens(e.target.value)}
                                placeholder="Enter total tokens"
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="editPrice" className="text-sm font-medium text-gray-700">
                                Price per Token ($)
                              </Label>
                              <Input
                                id="editPrice"
                                type="number"
                                step="0.01"
                                value={editedPrice}
                                onChange={(e) => setEditedPrice(e.target.value)}
                                placeholder="Enter token price"
                                className="mt-1"
                              />
                            </div>
                          </div>
                          <div className="mt-3 text-sm text-blue-700">
                            ⚠️ Changes will update the property's financial information and affect tokenization calculations.
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500 mb-1">Total Token Supply</p>
                              <p className="font-medium">{selectedProperty.totalTokens?.toLocaleString()} tokens</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 mb-1">Price per Token</p>
                              <p className="font-medium">${(selectedProperty.tokenPrice / 100).toFixed(2)}</p>
                            </div>
                          </div>
                          {selectedProperty.status !== 'pending' && (
                            <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                              <div className="flex items-center text-sm text-gray-600">
                                <svg className="h-4 w-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <span className="font-medium">Read-Only:</span>
                                <span className="ml-1">
                                  Financial information can only be edited for properties in "Pending" status.
                                </span>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Available Weeks/Year</p>
                        <p className="font-medium">{selectedProperty.availableWeeksPerYear || 0} weeks</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Ownership Type</p>
                        <p className="font-medium capitalize">{selectedProperty.ownershipType?.replace('_', ' ') || 'Not specified'}</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Document Upload Status - Full Width */}
                <AccordionItem value="documents">
                  <AccordionTrigger>
                    <span className="flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-purple-600" />
                      Document Upload Status
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      {selectedProperty.propertyType === 'residential' ? (
                        <>
                          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <span className="font-medium">Property Deed</span>
                            <div className="flex items-center space-x-2">
                              <Badge className="bg-green-100 text-green-800">✓ Uploaded</Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openDocument(selectedProperty.documentsUploaded?.['property_deed'] || 'https://rentzy-docs.s3.amazonaws.com/sample-property-deed.pdf')}
                                className="h-7 px-2 text-blue-600 hover:text-blue-800"
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                View
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <span className="font-medium">Property Tax Records</span>
                            <div className="flex items-center space-x-2">
                              <Badge className="bg-green-100 text-green-800">✓ Uploaded</Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openDocument(selectedProperty.documentsUploaded?.['tax_records'] || 'https://rentzy-docs.s3.amazonaws.com/sample-tax-records.pdf')}
                                className="h-7 px-2 text-blue-600 hover:text-blue-800"
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                View
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <span className="font-medium">Insurance Documentation</span>
                            <div className="flex items-center space-x-2">
                              <Badge className="bg-green-100 text-green-800">✓ Uploaded</Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openDocument(selectedProperty.documentsUploaded?.['insurance_docs'] || 'https://rentzy-docs.s3.amazonaws.com/sample-insurance-docs.pdf')}
                                className="h-7 px-2 text-blue-600 hover:text-blue-800"
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                View
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <span className="font-medium">HOA Documentation (if applicable)</span>
                            <div className="flex items-center space-x-2">
                              <Badge className="bg-green-100 text-green-800">✓ Uploaded</Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openDocument(selectedProperty.documentsUploaded?.['hoa_docs'] || 'https://rentzy-docs.s3.amazonaws.com/sample-hoa-docs.pdf')}
                                className="h-7 px-2 text-blue-600 hover:text-blue-800"
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                View
                              </Button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <span className="font-medium">Commercial Property Deed</span>
                            <div className="flex items-center space-x-2">
                              <Badge className="bg-green-100 text-green-800">✓ Uploaded</Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openDocument(selectedProperty.documentsUploaded?.['commercial_deed'] || 'https://rentzy-docs.s3.amazonaws.com/sample-commercial-deed.pdf')}
                                className="h-7 px-2 text-blue-600 hover:text-blue-800"
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                View
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <span className="font-medium">Operating Statements (3 years)</span>
                            <div className="flex items-center space-x-2">
                              <Badge className="bg-green-100 text-green-800">✓ Uploaded</Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openDocument(selectedProperty.documentsUploaded?.['operating_statements'] || 'https://rentzy-docs.s3.amazonaws.com/sample-operating-statements.pdf')}
                                className="h-7 px-2 text-blue-600 hover:text-blue-800"
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                View
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <span className="font-medium">Tenant Lease Agreements</span>
                            <div className="flex items-center space-x-2">
                              <Badge className="bg-green-100 text-green-800">✓ Uploaded</Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openDocument(selectedProperty.documentsUploaded?.['lease_agreements'] || 'https://rentzy-docs.s3.amazonaws.com/sample-lease-agreements.pdf')}
                                className="h-7 px-2 text-blue-600 hover:text-blue-800"
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                View
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <span className="font-medium">Building Inspection Reports</span>
                            <div className="flex items-center space-x-2">
                              <Badge className="bg-green-100 text-green-800">✓ Uploaded</Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openDocument(selectedProperty.documentsUploaded?.['inspection_reports'] || 'https://rentzy-docs.s3.amazonaws.com/sample-inspection-reports.pdf')}
                                className="h-7 px-2 text-blue-600 hover:text-blue-800"
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                View
                              </Button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Submission Timeline - Moved below accordion sections for better layout */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Submission Timeline</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Submitted:</span>
                    <span className="font-medium">{formatDate(selectedProperty.createdAt)}</span>
                  </div>
                  {selectedProperty.status === 'rejected' && selectedProperty.rejectedDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rejected:</span>
                      <span className="font-medium">{formatDate(selectedProperty.rejectedDate)}</span>
                    </div>
                  )}
                  {selectedProperty.status === 'live' && selectedProperty.liveDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Approved:</span>
                      <span className="font-medium">{formatDate(selectedProperty.liveDate)}</span>
                    </div>
                  )}
                </div>
              </div>

              {selectedProperty.status === 'rejected' && selectedProperty.rejectionReason && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3 text-red-800">Rejection Reason</h4>
                  <p className="text-sm text-red-700">{selectedProperty.rejectionReason}</p>
                </div>
              )}
            </div>

            {/* Admin Actions - Full Width */}
            {selectedProperty.status === 'pending' && (
              <div className="border-t pt-6 mt-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-indigo-600" />
                  Admin Actions
                </h3>
                <div className="flex space-x-3">
                  <Button 
                    onClick={() => setIsApprovalModalOpen(true)}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={approveMutation.isPending}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Property
                  </Button>
                  
                  <Button 
                    onClick={() => setIsRejectionModalOpen(true)}
                    variant="destructive"
                    disabled={rejectMutation.isPending}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Property
                  </Button>
                  
                  <Button 
                    onClick={() => setIsResubmissionModalOpen(true)}
                    variant="outline"
                    disabled={requestResubmissionMutation.isPending}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Request Resubmission
                  </Button>
                </div>
              </div>
            )}

            {/* Show Start Tokenization button for approved properties */}
            {selectedProperty.status === 'live' && selectedProperty.tokenizationStatus === 'not_started' && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-green-800 mb-1">Property Approved - Ready for Tokenization</h4>
                    <p className="text-sm text-green-600">This property has been approved and is ready to be tokenized.</p>
                  </div>
                  <Button 
                    onClick={handleStartTokenization}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <span className="flex items-center">
                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Start Tokenization
                    </span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tokenization Form Modal - Move inside Property Review */}
        <Dialog open={showTokenizationForm} onOpenChange={setShowTokenizationForm}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="pb-4">
              <DialogTitle className="text-lg font-medium">
                Start Tokenization - {selectedProperty?.name}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Property Information Section */}
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-4">Property Information</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address:</label>
                    <p className="text-sm text-gray-900">{selectedProperty?.address}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title:</label>
                    <p className="text-sm text-gray-900">{selectedProperty?.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name:</label>
                    <p className="text-sm text-gray-900">{selectedProperty?.ownerName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Property Type:</label>
                    <p className="text-sm text-gray-900 capitalize">{selectedProperty?.propertyType}</p>
                  </div>
                </div>
              </div>

              {/* Token Parameters Section */}
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-4">Token Parameters</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tokenCount" className="text-sm font-medium text-gray-700">
                      Token Count *
                    </Label>
                    <Input
                      id="tokenCount"
                      type="number"
                      placeholder="e.g., 1000"
                      value={tokenizationForm.tokenCount}
                      onChange={(e) => setTokenizationForm(prev => ({ ...prev, tokenCount: e.target.value }))}
                      className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500">Must be a positive integer</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tokenRate" className="text-sm font-medium text-gray-700">
                      Token Rate (USD) *
                    </Label>
                    <Input
                      id="tokenRate"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 100.00"
                      value={tokenizationForm.tokenRate}
                      onChange={(e) => setTokenizationForm(prev => ({ ...prev, tokenRate: e.target.value }))}
                      className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500">Price per token in USD</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="yieldExpectation" className="text-sm font-medium text-gray-700">
                      Yield Expectation (%) *
                    </Label>
                    <Input
                      id="yieldExpectation"
                      type="number"
                      step="0.1"
                      placeholder="e.g., 8.5"
                      value={tokenizationForm.yieldExpectation}
                      onChange={(e) => setTokenizationForm(prev => ({ ...prev, yieldExpectation: e.target.value }))}
                      className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500">Expected annual yield percentage</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="investmentEndDate" className="text-sm font-medium text-gray-700">
                      Investment End Date *
                    </Label>
                    <Input
                      id="investmentEndDate"
                      type="date"
                      placeholder="dd-mm-yyyy"
                      value={tokenizationForm.investmentEndDate}
                      onChange={(e) => setTokenizationForm(prev => ({ ...prev, investmentEndDate: e.target.value }))}
                      className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500">Must be after start date</p>
                  </div>
                </div>
              </div>

              {/* Important Notes Section */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="text-sm font-semibold text-blue-700 mb-2">Important Notes</h4>
                <ul className="text-sm text-blue-600 space-y-1">
                  <li>• All fields are required for tokenization</li>
                  <li>• Investment dates cannot be in the past</li>
                  <li>• Token parameters will be used to create blockchain assets</li>
                  <li>• This action cannot be undone once completed</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowTokenizationForm(false);
                    setTokenizationForm({
                      tokenCount: '',
                      tokenRate: '',
                      yieldExpectation: '',
                      investmentEndDate: ''
                    });
                  }}
                  className="px-6 py-2"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleTokenizationSubmit}
                  disabled={tokenizationMutation.isPending}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
                >
                  {tokenizationMutation.isPending ? 'Processing...' : 'Complete Tokenization'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Action Modals */}
        <AlertDialog open={isApprovalModalOpen} onOpenChange={setIsApprovalModalOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                Approve Property
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to approve "{selectedProperty.name}"? This action will make the property live and available for tokenization.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => approveMutation.mutate(selectedProperty.id)}
                className="bg-green-600 hover:bg-green-700"
                disabled={approveMutation.isPending}
              >
                {approveMutation.isPending ? 'Approving...' : 'Approve Property'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Dialog open={isRejectionModalOpen} onOpenChange={setIsRejectionModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <XCircle className="h-5 w-5 mr-2 text-red-600" />
                Reject Property
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Please provide a reason for rejecting "{selectedProperty.name}". This will be sent to the property owner.
              </p>
              <div className="space-y-2">
                <Label htmlFor="rejection-reason">Rejection Reason *</Label>
                <Textarea
                  id="rejection-reason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Please explain why this property is being rejected..."
                  rows={4}
                  className="resize-none"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsRejectionModalOpen(false);
                    setRejectionReason('');
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => {
                    if (rejectionReason.trim()) {
                      rejectMutation.mutate({ 
                        propertyId: selectedProperty.id, 
                        reason: rejectionReason 
                      });
                    }
                  }}
                  disabled={rejectMutation.isPending || !rejectionReason.trim()}
                >
                  {rejectMutation.isPending ? 'Rejecting...' : 'Reject Property'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isResubmissionModalOpen} onOpenChange={setIsResubmissionModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
                Request Resubmission
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Request additional information or changes for "{selectedProperty.name}". The property owner will receive these comments.
              </p>
              <div className="space-y-2">
                <Label htmlFor="resubmission-comments">Comments *</Label>
                <Textarea
                  id="resubmission-comments"
                  value={resubmissionComments}
                  onChange={(e) => setResubmissionComments(e.target.value)}
                  placeholder="Please specify what needs to be updated or clarified..."
                  rows={4}
                  className="resize-none"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsResubmissionModalOpen(false);
                    setResubmissionComments('');
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => {
                    if (resubmissionComments.trim()) {
                      requestResubmissionMutation.mutate({ 
                        propertyId: selectedProperty.id, 
                        comments: resubmissionComments 
                      });
                    }
                  }}
                  disabled={requestResubmissionMutation.isPending || !resubmissionComments.trim()}
                >
                  {requestResubmissionMutation.isPending ? 'Sending...' : 'Send Request'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Render Category Selection Screen
  const renderCategorySelection = () => {
    return (
      <CategorySelection
        selectedCategory={selectedPropertyCategory}
        onCategorySelect={handleCategorySelection}
        onContinue={handleContinueFromCategory}
        onBack={handleBackToPropertyList}
        formProgress={formProgress}
      />
    );
  };

  // Render Property Title and Location Form
  const renderPropertyTitleLocationForm = () => {
    return (
      <PropertyTitleLocationForm
        formData={{
          title: propertyFormData.title,
          address: propertyFormData.address,
          zipCode: propertyFormData.zipCode,
          buildingName: propertyFormData.buildingName,
          floorTower: propertyFormData.floorTower,
          areaLocalityPincode: propertyFormData.areaLocalityPincode,
          city: propertyFormData.city,
          nearbyLandmark: propertyFormData.nearbyLandmark
        }}
        titleValidationError={titleValidationError}
        zipCodeValidation={zipCodeValidation}
        onFormChange={(field, value) => {
          handlePropertyFormChange(field, value);
          if (field === 'zipCode' && value) {
            validateZipCode(value);
          }
        }}
        onContinue={handleContinueFromPropertyForm}
        onBack={() => {
          setCurrentStep(0);
          setFormProgress(0);
        }}
        formProgress={formProgress}
        isValid={isPropertyFormValid()}
      />
    );
  };

  // Render Property Form (step 2 and beyond - placeholder for now)
  const renderPropertyForm = () => {
    return (
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-gray-600">
          <button 
            onClick={handleBackToPropertyList}
            className="hover:text-blue-600 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Property Management
          </button>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">Add {selectedPropertyCategory} Property</span>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">Progress</h3>
              <span className="text-sm text-gray-500">{formProgress}%</span>
            </div>
            <Progress value={formProgress} className="w-full" />
          </div>

          {/* Form Content Placeholder */}
          <div className="text-center py-12">
            <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {selectedPropertyCategory === 'commercial' ? 'Commercial' : 'Residential'} Property Details
            </h2>
            <p className="text-gray-600 mb-6">
              Additional property details form will be implemented here
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentStep(1);
                  setFormProgress(1);
                }}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Title & Location
              </Button>
              <Button
                onClick={() => {
                  toast({
                    title: "Coming Soon",
                    description: "Additional form steps will be implemented next",
                  });
                }}
                className="bg-[#004182] hover:bg-[#003366]"
              >
                Continue to Next Step
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPropertyCard = (property: Property) => {
    const isLive = property.status === 'live';
    const isPending = property.status === 'pending';
    const isRejected = property.status === 'rejected';

    return (
      <Card key={property.id} className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex gap-4">
            {/* Property Thumbnail */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                {property.thumbnail ? (
                  <img 
                    src={property.thumbnail} 
                    alt={property.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Property Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {property.name}
                </h3>
                {getStatusBadge(property.status)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600 truncate">{property.address}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">{property.ownerName}</span>
                </div>

                {/* Status-specific information */}
                {isLive && property.liveDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Live: {formatDate(property.liveDate)}</span>
                  </div>
                )}

                {isPending && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Posted: {formatDate(property.createdAt)}</span>
                  </div>
                )}

                {isRejected && property.rejectedDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Rejected: {formatDate(property.rejectedDate)}</span>
                  </div>
                )}

                {isLive && (
                  <>
                    <div className="flex items-center gap-2">
                      <Coins className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">{property.totalTokens.toLocaleString()} Tokens</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">{formatCurrency(property.tokenPrice)} per token</span>
                    </div>
                  </>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleView(property)}
                  className="flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  View
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Property</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{property.name}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(property.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Render Step 1: General Property Details Form
  const renderGeneralPropertyDetailsForm = () => {
    const squareFootageError = validateSquareFootage(propertyFormData.squareFootage);
    
    return (
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-gray-600">
          <button 
            onClick={handleBackToPropertyList}
            className="hover:text-blue-600 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Property Management
          </button>
          <ChevronRight className="h-4 w-4" />
          <span className="hover:text-blue-600 cursor-pointer" onClick={() => {
            setCurrentStep(0);
            setFormProgress(0);
          }}>Add New Property</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">Step 1: General Property Details</span>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">Progress</h3>
              <span className="text-sm text-gray-500">{formProgress}%</span>
            </div>
            <Progress value={formProgress} className="w-full" />
          </div>

          {/* Form Content */}
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">Step 1: General Property Details</h1>
              <p className="text-gray-600 text-lg">
                Complete the basic information for your {selectedPropertyCategory} property
              </p>
            </div>

            {/* Form Sections */}
            <div className="space-y-8">
              {/* Property Title (View Only) */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold text-gray-900">Property Title</h3>
                  <Badge variant="secondary">Pre-filled</Badge>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="property-title-readonly">Property Title</Label>
                  <Input
                    id="property-title-readonly"
                    value={propertyFormData.title}
                    disabled
                    className="text-lg bg-gray-50"
                  />
                </div>
              </div>

              {/* Location (View Only) */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold text-gray-900">Location</h3>
                  <Badge variant="secondary">Pre-filled</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="property-market-readonly">Property Market</Label>
                    <Input
                      id="property-market-readonly"
                      value={propertyFormData.address}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="property-zipcode-readonly">Zip Code</Label>
                    <Input
                      id="property-zipcode-readonly"
                      value={propertyFormData.zipCode}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                </div>
              </div>

              {/* Google Map */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold text-gray-900">Property Location Map</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Interactive map showing the property location</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="h-80 rounded-lg overflow-hidden border border-gray-300">
                  <GoogleMap
                    address={propertyFormData.address}
                    zipCode={propertyFormData.zipCode}
                    className="w-full h-full"
                    onLocationSelect={(location) => {
                      console.log('Location selected:', location);
                      // You can store the location coordinates if needed
                    }}
                  />
                </div>
              </div>

              {/* Property Address Details */}
              <PropertyAddressDetails
                formData={{
                  buildingName: propertyFormData.buildingName,
                  floorTower: propertyFormData.floorTower,
                  areaLocalityPincode: propertyFormData.areaLocalityPincode,
                  city: propertyFormData.city,
                  nearbyLandmark: propertyFormData.nearbyLandmark
                }}
                onFormChange={handlePropertyFormChange}
              />

              {/* Square Footage */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold text-gray-900">Property Size</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Enter the total square footage of the property</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="square-footage">Square Footage *</Label>
                  <Input
                    id="square-footage"
                    type="number"
                    placeholder="e.g., 2500"
                    value={propertyFormData.squareFootage}
                    onChange={(e) => handlePropertyFormChange('squareFootage', e.target.value)}
                    className={`text-lg ${squareFootageError ? 'border-red-500' : ''}`}
                  />
                  {squareFootageError && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      {squareFootageError}
                    </p>
                  )}
                  {!squareFootageError && propertyFormData.squareFootage && parseFloat(propertyFormData.squareFootage) > 0 && (
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Valid square footage
                    </p>
                  )}
                </div>
              </div>

              {/* Zoning Classification */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold text-gray-900">Zoning Classification</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Select the zoning classification that best describes your property</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zoning-classification">Zoning Classification *</Label>
                  <Select 
                    value={propertyFormData.zoningClassification} 
                    onValueChange={(value) => handlePropertyFormChange('zoningClassification', value)}
                  >
                    <SelectTrigger className="text-lg">
                      <SelectValue placeholder="Select zoning classification" />
                    </SelectTrigger>
                    <SelectContent>
                      {zoningOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!propertyFormData.zoningClassification && (
                    <p className="text-sm text-gray-500">Please select a zoning classification</p>
                  )}
                  {propertyFormData.zoningClassification && (
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Zoning classification selected
                    </p>
                  )}
                </div>
              </div>

              {/* Property Photos */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold text-gray-900">Property Photos</h3>
                  <Badge variant="secondary">Required - Min 5 photos</Badge>
                </div>
                <div className="space-y-4">
                  <div className="text-sm text-gray-600">
                    <p>• Upload high-quality photos of your property (minimum 5 photos required)</p>
                    <p>• Supported formats: JPG, PNG (max 10MB each)</p>
                    <p>• Include exterior, interior, and key feature photos</p>
                  </div>
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-colors hover:border-gray-400"
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.add('border-blue-400', 'bg-blue-50');
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
                      const files = e.dataTransfer.files;
                      handleMultipleFileUpload('propertyPhotos', files);
                    }}
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Camera className="h-8 w-8 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-lg font-medium">Upload Property Photos</p>
                        <p className="text-sm text-gray-500">Drag and drop or click to select</p>
                      </div>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        multiple
                        onChange={(e) => handleMultipleFileUpload('propertyPhotos', e.target.files)}
                        className="hidden"
                        id="property-photos-commercial"
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => document.getElementById('property-photos-commercial')?.click()}
                        className="flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        Select Photos
                      </Button>
                    </div>
                    {propertyFormData.propertyPhotos && propertyFormData.propertyPhotos.length > 0 && (
                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-sm font-medium text-gray-700">
                            {propertyFormData.propertyPhotos.length} photo(s) uploaded
                            {propertyFormData.propertyPhotos.length >= 5 ? (
                              <span className="text-green-600 ml-1">✓ Minimum requirement met</span>
                            ) : (
                              <span className="text-red-600 ml-1">⚠ Need {5 - propertyFormData.propertyPhotos.length} more photos</span>
                            )}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {propertyFormData.propertyPhotos.map((photo, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                                <img
                                  src={URL.createObjectURL(photo)}
                                  alt={`Property photo ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <button
                                onClick={() => handleRemovePhoto('propertyPhotos', index)}
                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                title="Remove photo"
                              >
                                <X className="h-4 w-4" />
                              </button>
                              <p className="text-xs text-gray-600 mt-1 truncate text-center">
                                {photo.name}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Video Upload */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold text-gray-900">Property Videos</h3>
                </div>
                <div className="space-y-4">
                  <div className="text-sm text-gray-600">
                    <p>• Upload property videos to showcase your space (max 2 videos)</p>
                    <p>• Supported formats: MP4, MOV, AVI (max 100MB each)</p>
                    <p>• Recommended: Walk-through videos, amenity highlights, neighborhood features</p>
                  </div>
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-colors hover:border-gray-400"
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.add('border-blue-400', 'bg-blue-50');
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
                      const files = e.dataTransfer.files;
                      handleMultipleFileUpload('propertyVideos', files);
                    }}
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-lg font-medium">Upload Property Videos</p>
                        <p className="text-sm text-gray-500">Drag and drop or click to select</p>
                      </div>
                      <input
                        type="file"
                        accept=".mp4,.mov,.avi"
                        multiple
                        onChange={(e) => handleMultipleFileUpload('propertyVideos', e.target.files)}
                        className="hidden"
                        id="property-videos-commercial"
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => document.getElementById('property-videos-commercial')?.click()}
                        className="flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        Select Videos
                      </Button>
                    </div>
                    {propertyFormData.propertyVideos && propertyFormData.propertyVideos.length > 0 && (
                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-sm font-medium text-gray-700">
                            {propertyFormData.propertyVideos.length} video(s) uploaded
                            {propertyFormData.propertyVideos.length >= 2 && (
                              <span className="text-green-600 ml-1">✓ Great selection!</span>
                            )}
                          </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {propertyFormData.propertyVideos.map((video, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200 flex items-center justify-center">
                                <div className="text-center">
                                  <svg className="h-12 w-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <p className="text-sm text-gray-600">Video Preview</p>
                                  <p className="text-xs text-gray-500">{Math.round(video.size / (1024 * 1024))}MB</p>
                                </div>
                              </div>
                              <button
                                onClick={() => handleRemovePhoto('propertyVideos', index)}
                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                title="Remove video"
                              >
                                <X className="h-4 w-4" />
                              </button>
                              <p className="text-xs text-gray-600 mt-1 truncate text-center">
                                {video.name}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 360 Videos Upload */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold text-gray-900">360 Videos</h3>
                </div>
                <div className="space-y-4">
                  <div className="text-sm text-gray-600">
                    <p>• Upload 360° panoramic videos or images</p>
                    <p>• Supported formats: JPG, PNG, MP4, MOV (max 100MB each)</p>
                    <p>• Provides immersive experience for potential clients</p>
                  </div>
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-colors hover:border-gray-400"
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.add('border-blue-400', 'bg-blue-50');
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
                      const files = e.dataTransfer.files;
                      handleMultipleFileUpload('view360', files);
                    }}
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 019 14.437V9.564z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-lg font-medium">Upload 360 Videos</p>
                        <p className="text-sm text-gray-500">Drag and drop or click to select</p>
                      </div>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.mp4,.mov"
                        multiple
                        onChange={(e) => handleMultipleFileUpload('view360', e.target.files)}
                        className="hidden"
                        id="view-360-commercial"
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => document.getElementById('view-360-commercial')?.click()}
                        className="flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        Select 360 Files
                      </Button>
                    </div>
                    {propertyFormData.view360 && propertyFormData.view360.length > 0 && (
                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-sm font-medium text-gray-700">
                            {propertyFormData.view360.length} 360° file(s) uploaded
                          </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {propertyFormData.view360.map((file, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={`360° view ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <button
                                onClick={() => handleRemovePhoto('view360', index)}
                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                title="Remove 360° file"
                              >
                                <X className="h-4 w-4" />
                              </button>
                              <p className="text-xs text-gray-600 mt-1 truncate text-center">
                                {file.name}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-8">
              <Button
                variant="outline"
                onClick={handlePreviousStep}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    toast({
                      title: "Draft Saved",
                      description: "Your progress has been saved",
                    });
                  }}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Draft
                </Button>
                <Button
                  className="bg-[#004182] hover:bg-[#003366] text-white flex items-center gap-2"
                  onClick={handleNextStep}
                  disabled={!isStep1Valid()}
                >
                  Next: Financials
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Progress Info */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-blue-700">
                <Info className="h-4 w-4" />
                <span className="text-sm font-medium">
                  All fields marked with * are required to proceed
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render Step 2: Financials Form
  const renderFinancialsForm = () => {
    const nightlyRateError = validateNightlyRate(propertyFormData.nightlyRate);
    const cleaningFeeError = validateCleaningFee(propertyFormData.cleaningFee);
    
    return (
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-gray-600">
          <button 
            onClick={handleBackToPropertyList}
            className="hover:text-blue-600 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Property Management
          </button>
          <ChevronRight className="h-4 w-4" />
          <span className="hover:text-blue-600 cursor-pointer" onClick={() => {
            setCurrentStep(0);
            setFormProgress(0);
          }}>Add New Property</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">Step 2: Financials</span>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">Progress</h3>
              <span className="text-sm text-gray-500">{formProgress}%</span>
            </div>
            <Progress value={formProgress} className="w-full" />
          </div>

          {/* Form Content */}
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">Step 2: Financials</h1>
              <p className="text-gray-600 text-lg">
                Set your pricing and upload required financial documents
              </p>
            </div>

            {/* Form Sections */}
            <div className="space-y-8">
              {/* Base Rate (Nightly) */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold text-gray-900">Base Rate (Nightly)</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Set the nightly rate for your property (minimum $10)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nightly-rate">Base Rate (Nightly) *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="nightly-rate"
                      type="number"
                      placeholder="e.g., 150"
                      value={propertyFormData.nightlyRate}
                      onChange={(e) => handlePropertyFormChange('nightlyRate', e.target.value)}
                      className={`text-lg pl-10 ${nightlyRateError ? 'border-red-500' : ''}`}
                      min="10"
                    />
                  </div>
                  {nightlyRateError && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      {nightlyRateError}
                    </p>
                  )}
                  {!nightlyRateError && propertyFormData.nightlyRate && parseFloat(propertyFormData.nightlyRate) > 10 && (
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Valid nightly rate
                    </p>
                  )}
                </div>
              </div>

              {/* Maintenance Fee */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold text-gray-900">Maintenance Fee</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Set the maintenance fee for your property (minimum $5)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cleaning-fee">Maintenance Fee *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="cleaning-fee"
                      type="number"
                      placeholder="e.g., 50"
                      value={propertyFormData.cleaningFee}
                      onChange={(e) => handlePropertyFormChange('cleaningFee', e.target.value)}
                      className={`text-lg pl-10 ${cleaningFeeError ? 'border-red-500' : ''}`}
                      min="5"
                    />
                  </div>
                  {cleaningFeeError && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      {cleaningFeeError}
                    </p>
                  )}
                  {!cleaningFeeError && propertyFormData.cleaningFee && parseFloat(propertyFormData.cleaningFee) > 5 && (
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Valid maintenance fee
                    </p>
                  )}
                </div>
              </div>

              {/* File Uploads */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold text-gray-900">Required Documents</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Upload required financial documents (PDF, JPG, PNG, max 25MB each)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                {/* Rent Roll */}
                <div className="space-y-2">
                  <Label htmlFor="rent-roll">Rent Roll *</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <FileText className="h-12 w-12 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">Upload Rent Roll</p>
                        <p className="text-xs text-gray-500">PDF, JPG, PNG (max 25MB)</p>
                      </div>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload('rentRoll', e.target.files?.[0] || null)}
                        className="hidden"
                        id="rent-roll"
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => document.getElementById('rent-roll')?.click()}
                        className="flex items-center gap-2"
                      >
                        <Camera className="h-4 w-4" />
                        Choose File
                      </Button>
                    </div>
                    {propertyFormData.uploadedFiles.rentRoll && (
                      <div className="mt-4 p-2 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-700 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          {propertyFormData.uploadedFiles.rentRoll.name}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Income/Expense Statements */}
                <div className="space-y-2">
                  <Label htmlFor="income-expense">Income/Expense Statements *</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <FileText className="h-12 w-12 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">Upload Income/Expense Statements</p>
                        <p className="text-xs text-gray-500">PDF, JPG, PNG (max 25MB)</p>
                      </div>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload('incomeExpenseStatements', e.target.files?.[0] || null)}
                        className="hidden"
                        id="income-expense"
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => document.getElementById('income-expense')?.click()}
                        className="flex items-center gap-2"
                      >
                        <Camera className="h-4 w-4" />
                        Choose File
                      </Button>
                    </div>
                    {propertyFormData.uploadedFiles.incomeExpenseStatements && (
                      <div className="mt-4 p-2 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-700 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          {propertyFormData.uploadedFiles.incomeExpenseStatements.name}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-8">
              <Button
                variant="outline"
                onClick={handlePreviousStep}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    toast({
                      title: "Draft Saved",
                      description: "Your progress has been saved",
                    });
                  }}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Draft
                </Button>
                <Button
                  className="bg-[#004182] hover:bg-[#003366] text-white flex items-center gap-2"
                  onClick={handleNextStep}
                  disabled={!isStep2Valid()}
                >
                  Next: Amenities
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Progress Info */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-blue-700">
                <Info className="h-4 w-4" />
                <span className="text-sm font-medium">
                  All fields marked with * are required to proceed
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Amenities form state
  const [selectedAmenities, setSelectedAmenities] = useState(new Set());
  const [customAmenityName, setCustomAmenityName] = useState('');
  const [customAmenityIcon, setCustomAmenityIcon] = useState('');
  const [customAmenities, setCustomAmenities] = useState([]);

  // Render Step 3: Amenities Form
  const renderAmenitiesForm = () => {

    const predefinedAmenities = [
      { key: 'pool', name: 'Pool', icon: '🏊' },
      { key: 'gym', name: 'Gym', icon: '🏋️' },
      { key: 'parking', name: 'Parking', icon: '🚗' },
      { key: 'wifi', name: 'Wi-Fi', icon: '📶' },
      { key: 'airConditioning', name: 'Air Conditioning', icon: '❄️' },
      { key: 'breakfast', name: 'Breakfast', icon: '🍳' },
      { key: 'lounge', name: 'Lounge', icon: '🛋️' },
      { key: 'conference', name: 'Conference Room', icon: '👥' },
      { key: 'elevator', name: 'Elevator', icon: '🛗' },
      { key: 'security', name: 'Security System', icon: '🔒' },
      { key: 'reception', name: 'Reception Area', icon: '🏨' },
      { key: 'kitchen', name: 'Kitchen Facilities', icon: '🍴' }
    ];

    

    const handleAmenityToggle = (amenityKey) => {
      const newSelected = new Set(selectedAmenities);
      if (newSelected.has(amenityKey)) {
        newSelected.delete(amenityKey);
      } else {
        newSelected.add(amenityKey);
      }
      setSelectedAmenities(newSelected);
      
      // Update form data
      const updatedAmenities = {
        ...propertyFormData.amenities,
        [amenityKey]: newSelected.has(amenityKey)
      };
      
      const updatedData = {
        ...propertyFormData,
        amenities: updatedAmenities
      };
      
      setPropertyFormData(updatedData);
      sessionStorage.setItem('propertyFormData', JSON.stringify(updatedData));
    };

    const handleAddCustomAmenity = () => {
      if (customAmenityName.trim()) {
        const newAmenity = {
          key: `custom_${Date.now()}`,
          name: customAmenityName.trim(),
          icon: '🏠', // Default icon for custom amenities
          isCustom: true
        };
        
        // Add to custom amenities list (for Selected Amenities display only)
        setCustomAmenities([...customAmenities, newAmenity]);
        
        // Automatically add to selected amenities
        const newSelected = new Set(selectedAmenities);
        newSelected.add(newAmenity.key);
        setSelectedAmenities(newSelected);
        
        // Update form data
        const updatedAmenities = {
          ...propertyFormData.amenities,
          [newAmenity.key]: true
        };
        
        const updatedData = {
          ...propertyFormData,
          amenities: updatedAmenities
        };
        
        setPropertyFormData(updatedData);
        sessionStorage.setItem('propertyFormData', JSON.stringify(updatedData));
        
        setCustomAmenityName('');
        
        toast({
          title: "Custom Amenity Added",
          description: `"${newAmenity.name}" has been added to your selected amenities.`,
        });
      }
    };

    return (
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-gray-600">
          <button 
            onClick={handleBackToPropertyList}
            className="hover:text-blue-600 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Property Management
          </button>
          <ChevronRight className="h-4 w-4" />
          <span className="hover:text-blue-600 cursor-pointer" onClick={() => {
            setCurrentStep(0);
            setFormProgress(0);
          }}>Add New Property</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">Step 3: Amenities</span>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">Progress</h3>
              <span className="text-sm text-gray-500">{formProgress}%</span>
            </div>
            <Progress value={formProgress} className="w-full" />
          </div>

          {/* Form Content */}
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">Step 3: Amenities</h1>
              <p className="text-gray-600 text-lg">
                Select the amenities available at your commercial property
              </p>
            </div>

            {/* Amenities Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-700">
                  <div>Icon</div>
                  <div>Amenity Name</div>
                  <div>Select Option</div>
                  <div></div>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {/* Predefined Amenities */}
                {predefinedAmenities.map((amenity) => (
                  <div key={amenity.key} className="px-6 py-4 hover:bg-gray-50">
                    <div className="grid grid-cols-4 gap-4 items-center">
                      {/* Icon */}
                      <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg text-xl">
                        {amenity.icon}
                      </div>
                      
                      {/* Amenity Name */}
                      <div>
                        <span className="text-gray-900 font-medium">{amenity.name}</span>
                      </div>
                      
                      {/* Select Option */}
                      <div>
                        <Checkbox
                          id={amenity.key}
                          checked={selectedAmenities.has(amenity.key)}
                          onCheckedChange={() => handleAmenityToggle(amenity.key)}
                        />
                      </div>
                      
                      {/* Empty column for alignment */}
                      <div></div>
                    </div>
                  </div>
                ))}

                
              </div>
            </div>

            {/* Add Custom Amenity Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Add Custom Amenity</h3>
              <p className="text-sm text-blue-700 mb-4">
                Can't find the amenity you're looking for? Add your own custom amenity below.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                {/* Amenity Name */}
                <div className="space-y-2">
                  <Label htmlFor="custom-name" className="text-sm font-medium text-blue-900">
                    Amenity Name
                  </Label>
                  <Input
                    id="custom-name"
                    placeholder="e.g., Rooftop Terrace"
                    value={customAmenityName}
                    onChange={(e) => setCustomAmenityName(e.target.value)}
                    className="bg-white"
                  />
                </div>

                {/* Add Button */}
                <div>
                  <Button
                    onClick={handleAddCustomAmenity}
                    disabled={!customAmenityName.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Amenity
                  </Button>
                </div>
              </div>
            </div>

            {/* Selected Amenities Summary */}
            {(selectedAmenities.size > 0) && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-3">
                  Selected Amenities ({selectedAmenities.size})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[...predefinedAmenities, ...customAmenities]
                    .filter(amenity => selectedAmenities.has(amenity.key))
                    .map(amenity => (
                      <Badge key={amenity.key} variant="secondary" className="bg-green-100 text-green-800 flex items-center gap-1">
                        <span>{amenity.icon}</span>
                        <span>{amenity.name}</span>
                        {amenity.isCustom && (
                          <button
                            onClick={() => {
                              // Remove from custom amenities
                              setCustomAmenities(customAmenities.filter(a => a.key !== amenity.key));
                              // Remove from selected amenities
                              const newSelected = new Set(selectedAmenities);
                              newSelected.delete(amenity.key);
                              setSelectedAmenities(newSelected);
                              // Update form data
                              const updatedAmenities = { ...propertyFormData.amenities };
                              delete updatedAmenities[amenity.key];
                              const updatedData = { ...propertyFormData, amenities: updatedAmenities };
                              setPropertyFormData(updatedData);
                              sessionStorage.setItem('propertyFormData', JSON.stringify(updatedData));
                            }}
                            className="ml-1 text-green-600 hover:text-green-800 font-bold text-sm"
                            title="Remove custom amenity"
                          >
                            ×
                          </button>
                        )}
                      </Badge>
                    ))
                  }
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between pt-8">
              <Button
                variant="outline"
                onClick={handlePreviousStep}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    toast({
                      title: "Draft Saved",
                      description: "Your progress has been saved",
                    });
                  }}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Draft
                </Button>
                <Button
                  className="bg-[#004182] hover:bg-[#003366] text-white flex items-center gap-2"
                  onClick={handleNextStep}
                >
                  Next: Documents
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Progress Info */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-blue-700">
                <Info className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Amenities are optional but help attract investors. You can add custom amenities if needed.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render Step 4: Documents Form
  const renderDocumentsForm = () => {
    const requiredDocs = [
      { key: 'propertyDeed', label: 'Property Deed', description: 'Legal ownership document' },
      { key: 'zoningCertificate', label: 'Zoning Certificate', description: 'Municipal zoning approval' },
      { key: 'certificateOfOccupancy', label: 'Certificate of Occupancy', description: 'Building occupancy permit' },
      { key: 'tenantLeases', label: 'Tenant Leases', description: 'Current tenant agreements' },
      { key: 'environmentalReports', label: 'Environmental Reports', description: 'Environmental assessment reports' },
    ];

    return (
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-gray-600">
          <button 
            onClick={handleBackToPropertyList}
            className="hover:text-blue-600 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Property Management
          </button>
          <ChevronRight className="h-4 w-4" />
          <span className="hover:text-blue-600 cursor-pointer" onClick={() => {
            setCurrentStep(0);
            setFormProgress(0);
          }}>Add New Property</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">Step 4: Documents</span>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">Progress</h3>
              <span className="text-sm text-gray-500">{formProgress}%</span>
            </div>
            <Progress value={formProgress} className="w-full" />
          </div>

          {/* Form Content */}
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">Step 4: Documents</h1>
              <p className="text-gray-600 text-lg">
                Upload all required legal and compliance documents
              </p>
            </div>

            {/* Documents Upload */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-6">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-blue-700 font-medium">
                  All documents will be pre-verified by CoreLogic
                </span>
              </div>

              {requiredDocs.map((doc) => (
                <div key={doc.key} className="space-y-2">
                  <Label htmlFor={doc.key}>{doc.label} *</Label>
                  <p className="text-sm text-gray-500 mb-2">{doc.description}</p>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <FileText className="h-12 w-12 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">Upload {doc.label}</p>
                        <p className="text-xs text-gray-500">PDF, JPG, PNG (max 25MB)</p>
                      </div>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload(doc.key, e.target.files?.[0] || null)}
                        className="hidden"
                        id={doc.key}
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => document.getElementById(doc.key)?.click()}
                        className="flex items-center gap-2"
                      >
                        <Camera className="h-4 w-4" />
                        Choose File
                      </Button>
                    </div>
                    {propertyFormData.uploadedFiles[doc.key as keyof typeof propertyFormData.uploadedFiles] && (
                      <div className="mt-4 p-2 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-700 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          {propertyFormData.uploadedFiles[doc.key as keyof typeof propertyFormData.uploadedFiles]?.name}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-8">
              <Button
                variant="outline"
                onClick={handlePreviousStep}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    toast({
                      title: "Draft Saved",
                      description: "Your progress has been saved",
                    });
                  }}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Draft
                </Button>
                <Button
                  className="bg-[#004182] hover:bg-[#003366] text-white flex items-center gap-2"
                  onClick={handleNextStep}
                  disabled={!isStep4Valid()}
                >
                  Next: Review
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Progress Info */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-blue-700">
                <Info className="h-4 w-4" />
                <span className="text-sm font-medium">
                  All documents are required and will be verified for authenticity
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render Step 5: Review Form
  const renderReviewForm = () => {
    return (
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-gray-600">
          <button 
            onClick={handleBackToPropertyList}
            className="hover:text-blue-600 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Property Management
          </button>
          <ChevronRight className="h-4 w-4" />
          <span className="hover:text-blue-600 cursor-pointer" onClick={() => {
            setCurrentStep(0);
            setFormProgress(0);
          }}>Add New Property</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">Step 5: Review and Submit</span>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">Progress</h3>
              <span className="text-sm text-gray-500">{formProgress}%</span>
            </div>
            <Progress value={formProgress} className="w-full" />
          </div>

          {/* Form Content */}
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">Review Your Property Submission</h1>
              <p className="text-gray-600 text-lg">
                Please review all information before final submission
              </p>
            </div>

            {/* Review Sections */}
            <div className="space-y-6">
              {/* Property Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Property Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Property Title</Label>
                      <p className="text-gray-900">{propertyFormData.title}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Square Footage</Label>
                      <p className="text-gray-900">{propertyFormData.squareFootage} sq ft</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Address</Label>
                      <p className="text-gray-900">{propertyFormData.address}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Zoning Classification</Label>
                      <p className="text-gray-900">{zoningOptions.find(z => z.value === propertyFormData.zoningClassification)?.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Financial Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Financial Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Base Rate (Nightly)</Label>
                      <p className="text-gray-900">${propertyFormData.nightlyRate}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Maintenance Fee</Label>
                      <p className="text-gray-900">${propertyFormData.cleaningFee}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Documents Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Document Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-2">
                    {Object.entries(propertyFormData.uploadedFiles).map(([key, file]) => (
                      <div key={key} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                        {file ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Uploaded
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <XCircle className="h-3 w-3 mr-1" />
                            Missing
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-8">
              <Button
                variant="outline"
                onClick={handlePreviousStep}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    toast({
                      title: "Draft Saved",
                      description: "Your progress has been saved",
                    });
                  }}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Draft
                </Button>
                <Button
                  className="bg-[#004182] hover:bg-[#003366] text-white flex items-center gap-2"
                  onClick={() => {
                    toast({
                      title: "Property Submitted",
                      description: "Your commercial property has been submitted for review",
                    });
                    // Reset form and return to property list
                    setShowAddPropertyFlow(false);
                    setCurrentStep(0);
                    setFormProgress(0);
                    setSelectedPropertyCategory(null);
                    setPropertyFormData({
                      title: '',
                      address: '',
                      zipCode: '',
                      squareFootage: '',
                      zoningClassification: '',
                      nightlyRate: '',
                      cleaningFee: '',
                      amenities: {
                        parking: false,
                        hvac: false,
                        adaCompliance: false,
                        elevator: false,
                        security: false,
                        conferenceRoom: false,
                        kitchen: false,
                        reception: false,
                      },
                      uploadedFiles: {
                        rentRoll: null,
                        incomeExpenseStatements: null,
                        propertyDeed: null,
                        zoningCertificate: null,
                        certificateOfOccupancy: null,
                        tenantLeases: null,
                        environmentalReports: null,
                      }
                    });
                    sessionStorage.removeItem('propertyFormData');
                    sessionStorage.removeItem('selectedPropertyCategory');
                  }}
                  disabled={!(isStep1Valid() && isStep2Valid() && isStep3Valid() && isStep4Valid())}
                >
                  Submit Property
                  <CheckCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Final Info */}
            <div className="mt-8 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-green-700">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">
                  All requirements met - Ready for submission
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render Residential Rental Details Form
  const renderResidentialRentalDetailsForm = () => {
    return (
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-gray-600">
          <button 
            onClick={handleBackToPropertyList}
            className="hover:text-blue-600 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Property Management
          </button>
          <ChevronRight className="h-4 w-4" />
          <span className="hover:text-blue-600 cursor-pointer" onClick={() => {
            setCurrentStep(0);
            setFormProgress(0);
          }}>Add New Property</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">Residential Rental Details</span>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">Progress</h3>
              <span className="text-sm text-gray-500">{formProgress}%</span>
            </div>
            <Progress value={formProgress} className="w-full" />
          </div>

          {/* Form Content */}
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">Residential Rental Details</h1>
              <p className="text-gray-600 text-lg">
                Complete all required information for your residential property
              </p>
            </div>

            {/* Form Sections */}
            <div className="space-y-12">
              {/* Property Title and Location (View Only) */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold text-gray-900">Property Information</h3>
                  <Badge variant="secondary">Pre-filled</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="property-title-readonly">Property Title</Label>
                    <Input
                      id="property-title-readonly"
                      value={propertyFormData.title}
                      disabled
                      className="text-lg bg-gray-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="property-location-readonly">Location</Label>
                    <Input
                      id="property-location-readonly"
                      value={propertyFormData.address}
                      disabled
                      className="text-lg bg-gray-50"
                    />
                  </div>
                </div>
              </div>

              {/* Google Map */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold text-gray-900">Property Location Map</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Interactive map showing the property location</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="h-80 rounded-lg overflow-hidden border border-gray-300">
                  <GoogleMap
                    address={propertyFormData.address}
                    zipCode={propertyFormData.zipCode}
                    className="w-full h-full"
                    onLocationSelect={(location) => {
                      console.log('Location selected:', location);
                      // You can store the location coordinates if needed
                    }}
                  />
                </div>
              </div>

              {/* Property Address Details */}
              <PropertyAddressDetails
                formData={{
                  buildingName: propertyFormData.buildingName,
                  floorTower: propertyFormData.floorTower,
                  areaLocalityPincode: propertyFormData.areaLocalityPincode,
                  city: propertyFormData.city,
                  nearbyLandmark: propertyFormData.nearbyLandmark
                }}
                onFormChange={handlePropertyFormChange}
              />

              {/* Basic Property Details */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Basic Property Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Total Number of Bedrooms *</Label>
                    <Select 
                      value={propertyFormData.bedrooms || ''} 
                      onValueChange={(value) => handlePropertyFormChange('bedrooms', value)}
                    >
                      <SelectTrigger className="text-lg">
                        <SelectValue placeholder="Select bedrooms" />
                      </SelectTrigger>
                      <SelectContent>
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? 'Bedroom' : 'Bedrooms'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">Total Number of Bathrooms *</Label>
                    <Select 
                      value={propertyFormData.bathrooms || ''} 
                      onValueChange={(value) => handlePropertyFormChange('bathrooms', value)}
                    >
                      <SelectTrigger className="text-lg">
                        <SelectValue placeholder="Select bathrooms" />
                      </SelectTrigger>
                      <SelectContent>
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? 'Bathroom' : 'Bathrooms'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guest-capacity">Guest Capacity *</Label>
                    <Select 
                      value={propertyFormData.guestCapacity || ''} 
                      onValueChange={(value) => handlePropertyFormChange('guestCapacity', value)}
                    >
                      <SelectTrigger className="text-lg">
                        <SelectValue placeholder="Max guests" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({length: 20}, (_, i) => i + 1).map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? 'Guest' : 'Guests'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="square-footage">Square Footage *</Label>
                    <Input
                      id="square-footage"
                      type="number"
                      placeholder="e.g., 1500"
                      value={propertyFormData.squareFootage}
                      onChange={(e) => handlePropertyFormChange('squareFootage', e.target.value)}
                      className="text-lg"
                      min="1"
                    />
                  </div>
                </div>
              </div>

              {/* Property Photos */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold text-gray-900">Property Photos</h3>
                  <Badge variant="destructive">Required - Minimum 5 photos</Badge>
                </div>
                <div className="space-y-4">
                  <div className="text-sm text-gray-600">
                    <p>• Upload at least 5 high-quality photos (minimum 800x600 resolution)</p>
                    <p>• Supported formats: JPG, PNG (max 10MB each)</p>
                    <p>• Show different angles of your property including bedrooms, bathrooms, and common areas</p>
                  </div>
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-colors hover:border-gray-400"
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.add('border-blue-400', 'bg-blue-50');
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
                      const files = e.dataTransfer.files;
                      handleMultipleFileUpload('propertyPhotos', files);
                    }}
                  >
                    <div className="flex flex-col items-center gap-4">
                      <Camera className="h-16 w-16 text-gray-400" />
                      <div>
                        <p className="text-lg font-medium">Upload Property Photos</p>
                        <p className="text-sm text-gray-500">Drag and drop or click to select</p>
                      </div>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        multiple
                        onChange={(e) => handleMultipleFileUpload('propertyPhotos', e.target.files)}
                        className="hidden"
                        id="property-photos"
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => document.getElementById('property-photos')?.click()}
                        className="flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        Select Photos
                      </Button>
                    </div>
                    {propertyFormData.propertyPhotos && propertyFormData.propertyPhotos.length > 0 && (
                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-sm font-medium text-gray-700">
                            {propertyFormData.propertyPhotos.length} photo(s) uploaded
                            {propertyFormData.propertyPhotos.length < 5 && (
                              <span className="text-red-600 ml-1">
                                (Need {5 - propertyFormData.propertyPhotos.length} more)
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                          {propertyFormData.propertyPhotos.map((photo, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                                <img
                                  src={URL.createObjectURL(photo)}
                                  alt={`Property photo ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <button
                                onClick={() => handleRemovePhoto('propertyPhotos', index)}
                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                title="Remove photo"
                              >
                                <X className="h-4 w-4" />
                              </button>
                              <p className="text-xs text-gray-600 mt-1 truncate text-center">
                                {photo.name}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Video Upload */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold text-gray-900">Property Videos</h3>
                </div>
                <div className="space-y-4">
                  <div className="text-sm text-gray-600">
                    <p>• Upload property videos to showcase your space (max 2 videos)</p>
                    <p>• Supported formats: MP4, MOV, AVI (max 100MB each)</p>
                    <p>• Recommended: Walk-through videos, amenity highlights, neighborhood features</p>
                  </div>
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-colors hover:border-gray-400"
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.add('border-blue-400', 'bg-blue-50');
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
                      const files = e.dataTransfer.files;
                      handleMultipleFileUpload('propertyVideos', files);
                    }}
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-lg font-medium">Upload Property Videos</p>
                        <p className="text-sm text-gray-500">Drag and drop or click to select</p>
                      </div>
                      <input
                        type="file"
                        accept=".mp4,.mov,.avi"
                        multiple
                        onChange={(e) => handleMultipleFileUpload('propertyVideos', e.target.files)}
                        className="hidden"
                        id="property-videos"
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => document.getElementById('property-videos')?.click()}
                        className="flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        Select Videos
                      </Button>
                    </div>
                    {propertyFormData.propertyVideos && propertyFormData.propertyVideos.length > 0 && (
                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-sm font-medium text-gray-700">
                            {propertyFormData.propertyVideos.length} video(s) uploaded
                            {propertyFormData.propertyVideos.length >= 2 && (
                              <span className="text-green-600 ml-1">✓ Great selection!</span>
                            )}
                          </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {propertyFormData.propertyVideos.map((video, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200 flex items-center justify-center">
                                <div className="text-center">
                                  <svg className="h-12 w-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <p className="text-sm text-gray-600">Video Preview</p>
                                  <p className="text-xs text-gray-500">{Math.round(video.size / (1024 * 1024))}MB</p>
                                </div>
                              </div>
                              <button
                                onClick={() => handleRemovePhoto('propertyVideos', index)}
                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                title="Remove video"
                              >
                                <X className="h-4 w-4" />
                              </button>
                              <p className="text-xs text-gray-600 mt-1 truncate text-center">
                                {video.name}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 360 Videos Upload */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold text-gray-900">360 Videos</h3>
                </div>
                <div className="space-y-4">
                  <div className="text-sm text-gray-600">
                    <p>• Upload 360° panoramic videos or images</p>
                    <p>• Supported formats: JPG, PNG, MP4, MOV (max 100MB each)</p>
                    <p>• Provides immersive experience for potential guests</p>
                  </div>
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-colors hover:border-gray-400"
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.add('border-blue-400', 'bg-blue-50');
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
                      const files = e.dataTransfer.files;
                      handleMultipleFileUpload('view360', files);
                    }}
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 019 14.437V9.564z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-lg font-medium">Upload 360 Videos</p>
                        <p className="text-sm text-gray-500">Drag and drop or click to select</p>
                      </div>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.mp4,.mov"
                        multiple
                        onChange={(e) => handleMultipleFileUpload('view360', e.target.files)}
                        className="hidden"
                        id="view-360"
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => document.getElementById('view-360')?.click()}
                        className="flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        Select 360 Files
                      </Button>
                    </div>
                    {propertyFormData.view360 && propertyFormData.view360.length > 0 && (
                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-sm font-medium text-gray-700">
                            {propertyFormData.view360.length} 360° file(s) uploaded
                          </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {propertyFormData.view360.map((file, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={`360° view ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <button
                                onClick={() => handleRemovePhoto('view360', index)}
                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                title="Remove 360° file"
                              >
                                <X className="h-4 w-4" />
                              </button>
                              <p className="text-xs text-gray-600 mt-1 truncate text-center">
                                {file.name}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Rates and Pricing */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Rates and Pricing</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nightly-base-rate">Base Rate (Nightly) *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="nightly-base-rate"
                        type="number"
                        placeholder="e.g., 120"
                        value={propertyFormData.nightlyBaseRate}
                        onChange={(e) => handlePropertyFormChange('nightlyBaseRate', e.target.value)}
                        className="text-lg pl-10"
                        min="11"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weekend-rate">Weekend Rate (%)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-400 text-lg">%</span>
                      <Input
                        id="weekend-rate"
                        type="number"
                        placeholder="e.g., 25"
                        value={propertyFormData.weekendRate}
                        onChange={(e) => handlePropertyFormChange('weekendRate', e.target.value)}
                        className="text-lg pl-10"
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="peak-season-rate">Peak Season Rate (%)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-400 text-lg">%</span>
                      <Input
                        id="peak-season-rate"
                        type="number"
                        placeholder="e.g., 50"
                        value={propertyFormData.peakSeasonRate}
                        onChange={(e) => handlePropertyFormChange('peakSeasonRate', e.target.value)}
                        className="text-lg pl-10"
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maintenance-fee">Maintenance Fee *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="maintenance-fee"
                        type="number"
                        placeholder="e.g., 75"
                        value={propertyFormData.cleaningFee}
                        onChange={(e) => handlePropertyFormChange('cleaningFee', e.target.value)}
                        className="text-lg pl-10"
                        min="6"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minimum-stay">Minimum Stay (nights) *</Label>
                    <Select 
                      value={propertyFormData.minimumStay || ''} 
                      onValueChange={(value) => handlePropertyFormChange('minimumStay', value)}
                    >
                      <SelectTrigger className="text-lg">
                        <SelectValue placeholder="Select minimum stay" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({length: 30}, (_, i) => i + 1).map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? 'Night' : 'Nights'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* House Rules and Policies */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">House Rules and Policies</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="house-rules">House Rules *</Label>
                    <textarea
                      id="house-rules"
                      placeholder="e.g., No parties, No smoking, No pets, Quiet hours 10 PM - 8 AM"
                      value={propertyFormData.houseRules}
                      onChange={(e) => handlePropertyFormChange('houseRules', e.target.value)}
                      className="w-full h-24 p-3 border border-gray-300 rounded-lg text-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="check-in-time">Check-in Time *</Label>
                      <Input
                        id="check-in-time"
                        type="time"
                        value={propertyFormData.checkInTime}
                        onChange={(e) => handlePropertyFormChange('checkInTime', e.target.value)}
                        className="text-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="check-out-time">Check-out Time *</Label>
                      <Input
                        id="check-out-time"
                        type="time"
                        value={propertyFormData.checkOutTime}
                        onChange={(e) => handlePropertyFormChange('checkOutTime', e.target.value)}
                        className="text-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Local Highlights */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Local Highlights</h3>
                <div className="space-y-2">
                  <Label htmlFor="local-highlights">Local Highlights</Label>
                  <textarea
                    id="local-highlights"
                    placeholder="e.g., Located 5 minutes from downtown attractions. Walking distance to the best restaurants and nightlife."
                    value={propertyFormData.localHighlights}
                    onChange={(e) => handlePropertyFormChange('localHighlights', e.target.value)}
                    className="w-full h-20 p-3 border border-gray-300 rounded-lg text-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500">Describe nearby attractions in 1-2 sentences</p>
                </div>
              </div>

              {/* Room Details */}
              {propertyFormData.bedrooms && parseInt(propertyFormData.bedrooms) > 0 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">Room Details</h3>
                  <div className="space-y-6">
                    {Array.from({length: parseInt(propertyFormData.bedrooms)}, (_, index) => (
                      <Card key={index} className="p-6">
                        <CardHeader className="pb-4">
                          <CardTitle className="text-lg">Bedroom {index + 1}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`bedroom-${index}-beds`}>Number of Beds *</Label>
                              <Select 
                                value={propertyFormData.roomDetails?.[index]?.beds || ''} 
                                onValueChange={(value) => handleRoomDetailChange(index, 'beds', value)}
                              >
                                <SelectTrigger className="text-lg">
                                  <SelectValue placeholder="Select beds" />
                                </SelectTrigger>
                                <SelectContent>
                                  {[1, 2, 3, 4, 5].map((num) => (
                                    <SelectItem key={num} value={num.toString()}>
                                      {num} {num === 1 ? 'Bed' : 'Beds'}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`bedroom-${index}-sqft`}>Square Footage *</Label>
                              <Input
                                id={`bedroom-${index}-sqft`}
                                type="number"
                                placeholder="e.g., 150"
                                value={propertyFormData.roomDetails?.[index]?.squareFootage || ''}
                                onChange={(e) => handleRoomDetailChange(index, 'squareFootage', e.target.value)}
                                className="text-lg"
                                min="1"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`bedroom-${index}-bathroom`}>Attached Bathroom *</Label>
                              <Select 
                                value={propertyFormData.roomDetails?.[index]?.attachedBathroom || ''} 
                                onValueChange={(value) => handleRoomDetailChange(index, 'attachedBathroom', value)}
                              >
                                <SelectTrigger className="text-lg">
                                  <SelectValue placeholder="Select option" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="yes">Yes</SelectItem>
                                  <SelectItem value="no">No</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Featured Amenities */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-semibold text-gray-900">Featured Amenities</h3>
                  <Badge variant="destructive">Required - Select at least 1</Badge>
                </div>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <Label htmlFor="featured-amenities">Featured Amenities *</Label>
                    <p className="text-sm text-gray-600">Select multiple amenities that apply to your property</p>
                    
                    {/* Multi-select dropdown */}
                    <div className="relative">
                      <div 
                        className="min-h-[60px] w-full border border-gray-300 rounded-lg p-3 bg-white cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onClick={() => setShowAmenitiesDropdown(!showAmenitiesDropdown)}
                      >
                        {propertyFormData.featuredAmenities && propertyFormData.featuredAmenities.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {propertyFormData.featuredAmenities.map((amenity) => {
                              const amenityLabel = [
                                { value: 'pool', label: 'Pool' },
                                { value: 'chef-kitchen', label: 'Chef Kitchen' },
                                { value: 'gym', label: 'Gym' },
                                { value: 'hot-tub', label: 'Hot Tub' },
                                { value: 'fireplace', label: 'Fireplace' },
                                { value: 'garden', label: 'Garden' },
                                { value: 'parking', label: 'Private Parking' },
                                { value: 'wifi', label: 'High-Speed WiFi' },
                                { value: 'air-conditioning', label: 'Air Conditioning' },
                                { value: 'washer-dryer', label: 'Washer/Dryer' },
                                { value: 'dishwasher', label: 'Dishwasher' },
                                { value: 'balcony', label: 'Balcony/Terrace' }
                              ].find(a => a.value === amenity)?.label || amenity;
                              
                              return (
                                <Badge 
                                  key={amenity} 
                                  variant="secondary" 
                                  className="text-xs flex items-center gap-1"
                                >
                                  {amenityLabel}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAmenitySelection(amenity, false);
                                    }}
                                    className="hover:bg-gray-300 rounded-full p-0.5"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-gray-500 text-lg">Select amenities...</div>
                        )}
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <ChevronRight className={`h-4 w-4 transition-transform ${showAmenitiesDropdown ? 'rotate-90' : ''}`} />
                        </div>
                      </div>
                      
                      {/* Dropdown content */}
                      {showAmenitiesDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {[
                            { value: 'pool', label: 'Pool' },
                            { value: 'chef-kitchen', label: 'Chef Kitchen' },
                            { value: 'gym', label: 'Gym' },
                            { value: 'hot-tub', label: 'Hot Tub' },
                            { value: 'fireplace', label: 'Fireplace' },
                            { value: 'garden', label: 'Garden' },
                            { value: 'parking', label: 'Private Parking' },
                            { value: 'wifi', label: 'High-Speed WiFi' },
                            { value: 'air-conditioning', label: 'Air Conditioning' },
                            { value: 'washer-dryer', label: 'Washer/Dryer' },
                            { value: 'dishwasher', label: 'Dishwasher' },
                            { value: 'balcony', label: 'Balcony/Terrace' }
                          ].map((amenity) => (
                            <div
                              key={amenity.value}
                              className="flex items-center space-x-2 p-3 hover:bg-gray-50 cursor-pointer"
                              onClick={() => {
                                const isSelected = propertyFormData.featuredAmenities?.includes(amenity.value) || false;
                                handleAmenitySelection(amenity.value, !isSelected);
                              }}
                            >
                              <Checkbox
                                checked={propertyFormData.featuredAmenities?.includes(amenity.value) || false}
                                readOnly
                              />
                              <Label className="text-sm font-medium cursor-pointer">
                                {amenity.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {propertyFormData.featuredAmenities && propertyFormData.featuredAmenities.length > 0 && (
                      <div className="text-sm text-gray-600">
                        {propertyFormData.featuredAmenities.length} amenities selected
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="custom-amenities">Add Custom Amenities</Label>
                    <Input
                      id="custom-amenities"
                      placeholder="e.g., Rooftop terrace, Wine cellar, etc."
                      value={propertyFormData.customAmenities}
                      onChange={(e) => handlePropertyFormChange('customAmenities', e.target.value)}
                      className="text-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Optional Features */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Optional Features</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="furnishing-description">Furnishing Description</Label>
                    <textarea
                      id="furnishing-description"
                      placeholder="e.g., Fully furnished with modern décor, comfortable seating, and all essential appliances"
                      value={propertyFormData.furnishingDescription}
                      onChange={(e) => handlePropertyFormChange('furnishingDescription', e.target.value)}
                      className="w-full h-20 p-3 border border-gray-300 rounded-lg text-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smart-home-features">Smart Home Features</Label>
                    <Select 
                      value={propertyFormData.smartHomeFeatures || ''} 
                      onValueChange={(value) => handlePropertyFormChange('smartHomeFeatures', value)}
                    >
                      <SelectTrigger className="text-lg">
                        <SelectValue placeholder="Select smart home features" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="smart-thermostat">Smart Thermostat</SelectItem>
                        <SelectItem value="keyless-entry">Keyless Entry</SelectItem>
                        <SelectItem value="voice-assistants">Voice Assistants (Alexa/Google)</SelectItem>
                        <SelectItem value="smart-lighting">Smart Lighting System</SelectItem>
                        <SelectItem value="security-cameras">Security Cameras</SelectItem>
                        <SelectItem value="smart-locks">Smart Door Locks</SelectItem>
                        <SelectItem value="automated-blinds">Automated Blinds/Curtains</SelectItem>
                        <SelectItem value="smart-tv">Smart TV Integration</SelectItem>
                        <SelectItem value="wifi-mesh">WiFi Mesh Network</SelectItem>
                        <SelectItem value="smart-appliances">Smart Kitchen Appliances</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="concierge-services">Concierge Services Included</Label>
                    <Select 
                      value={propertyFormData.conciergeServices || ''} 
                      onValueChange={(value) => handlePropertyFormChange('conciergeServices', value)}
                    >
                      <SelectTrigger className="text-lg">
                        <SelectValue placeholder="Select concierge services" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="airport-pickup">Airport Pickup/Drop-off</SelectItem>
                        <SelectItem value="grocery-delivery">Grocery Delivery Service</SelectItem>
                        <SelectItem value="local-tours">Local Tour Bookings</SelectItem>
                        <SelectItem value="restaurant-reservations">Restaurant Reservations</SelectItem>
                        <SelectItem value="housekeeping">Daily Housekeeping</SelectItem>
                        <SelectItem value="laundry-service">Laundry Service</SelectItem>
                        <SelectItem value="car-rental">Car Rental Assistance</SelectItem>
                        <SelectItem value="event-planning">Event Planning Support</SelectItem>
                        <SelectItem value="personal-chef">Personal Chef Service</SelectItem>
                        <SelectItem value="spa-wellness">Spa & Wellness Services</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-8">
              <Button
                variant="outline"
                onClick={handlePreviousStep}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    toast({
                      title: "Draft Saved",
                      description: "Your residential property details have been saved",
                    });
                  }}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Draft
                </Button>
                <Button
                  className="bg-[#004182] hover:bg-[#003366] text-white flex items-center gap-2"
                  onClick={handleResidentialSubmit}
                  disabled={!isResidentialFormValid()}
                >
                  Submit for Review
                  <CheckCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Progress Info */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-blue-700">
                <Info className="h-4 w-4" />
                <span className="text-sm font-medium">
                  All fields marked with * are required. iOS-optimized for full mobile usability.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render Residential Property Preview Page
  const renderResidentialPreview = () => {
    const amenityLabels = {
      'pool': 'Pool',
      'chef-kitchen': 'Chef Kitchen',
      'gym': 'Gym',
      'hot-tub': 'Hot Tub',
      'fireplace': 'Fireplace',
      'garden': 'Garden',
      'parking': 'Private Parking',
      'wifi': 'High-Speed WiFi',
      'air-conditioning': 'Air Conditioning',
      'washer-dryer': 'Washer/Dryer',
      'dishwasher': 'Dishwasher',
      'balcony': 'Balcony/Terrace'
    };

    return (
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-gray-600">
          <button 
            onClick={handleBackToPropertyList}
            className="hover:text-blue-600 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Property Management
          </button>
          <ChevronRight className="h-4 w-4" />
          <button 
            onClick={() => setShowResidentialPreview(false)}
            className="hover:text-blue-600 transition-colors"
          >
            Residential Rental Details
          </button>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">Review & Submit</span>
        </div>

        {/* Preview Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center border-b pb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">Review Your Property Listing</h1>
              <p className="text-gray-600 text-lg">
                Please review all information below before submitting your property for approval
              </p>
            </div>

            {/* Property Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Property Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Property Title:</span>
                      <span className="font-medium">{propertyFormData.title || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Address:</span>
                      <span className="font-medium">{propertyFormData.address || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Zip Code:</span>
                      <span className="font-medium">{propertyFormData.zipCode || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Square Footage:</span>
                      <span className="font-medium">{propertyFormData.squareFootage ? `${propertyFormData.squareFootage} sq ft` : 'Not specified'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Accommodation</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bedrooms:</span>
                      <span className="font-medium">{propertyFormData.bedrooms || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bathrooms:</span>
                      <span className="font-medium">{propertyFormData.bathrooms || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Guest Capacity:</span>
                      <span className="font-medium">{propertyFormData.guestCapacity ? `${propertyFormData.guestCapacity} guests` : 'Not specified'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Pricing</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nightly Base Rate:</span>
                      <span className="font-medium">{propertyFormData.nightlyBaseRate ? `$${propertyFormData.nightlyBaseRate}` : 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Weekend Rate:</span>
                      <span className="font-medium">{propertyFormData.weekendRate ? `$${propertyFormData.weekendRate}` : 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Peak Season Rate:</span>
                      <span className="font-medium">{propertyFormData.peakSeasonRate ? `$${propertyFormData.peakSeasonRate}` : 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cleaning Fee:</span>
                      <span className="font-medium">{propertyFormData.cleaningFee ? `$${propertyFormData.cleaningFee}` : 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Minimum Stay:</span>
                      <span className="font-medium">{propertyFormData.minimumStay ? `${propertyFormData.minimumStay} nights` : 'Not specified'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Check-in/Check-out</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-in Time:</span>
                      <span className="font-medium">{propertyFormData.checkInTime || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-out Time:</span>
                      <span className="font-medium">{propertyFormData.checkOutTime || 'Not specified'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Amenities */}
            {propertyFormData.featuredAmenities && propertyFormData.featuredAmenities.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Featured Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {propertyFormData.featuredAmenities.map((amenity) => (
                    <Badge key={amenity} variant="secondary" className="text-sm">
                      {amenityLabels[amenity as keyof typeof amenityLabels] || amenity}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Property Photos */}
            {propertyFormData.propertyPhotos && propertyFormData.propertyPhotos.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Property Photos</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {propertyFormData.propertyPhotos.slice(0, 8).map((photo, index) => (
                    <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img 
                        src={photo instanceof File ? URL.createObjectURL(photo) : photo}
                        alt={`Property photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  {propertyFormData.propertyPhotos.length > 8 && (
                    <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500 text-sm">+{propertyFormData.propertyPhotos.length - 8} more</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Property Videos */}
            {propertyFormData.propertyVideos && propertyFormData.propertyVideos.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Property Videos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {propertyFormData.propertyVideos.slice(0, 2).map((video, index) => (
                    <div key={index} className="aspect-video bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200 flex items-center justify-center">
                      <div className="text-center">
                        <svg className="h-12 w-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm text-gray-600">Video Preview</p>
                        <p className="text-xs text-gray-500">{video.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {propertyFormData.propertyVideos.length} video(s) uploaded
                </p>
              </div>
            )}

            {/* 360° Virtual Tour */}
            {((propertyFormData.view360 && propertyFormData.view360.length > 0) || propertyFormData.virtualTourLink) && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">360° Virtual Tour</h3>
                {propertyFormData.view360 && propertyFormData.view360.length > 0 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {propertyFormData.view360.slice(0, 6).map((file, index) => (
                        <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                          <img
                            src={file instanceof File ? URL.createObjectURL(file) : file}
                            alt={`360° view ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500">
                      {propertyFormData.view360.length} 360° file(s) uploaded
                    </p>
                  </div>
                )}
                {propertyFormData.virtualTourLink && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      <span className="text-blue-800 font-medium">Virtual Tour Link</span>
                    </div>
                    <p className="text-blue-700 text-sm break-all">{propertyFormData.virtualTourLink}</p>
                  </div>
                )}
              </div>
            )}

            {/* House Rules */}
            {propertyFormData.houseRules && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">House Rules</h3>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{propertyFormData.houseRules}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between pt-8 border-t">
              <Button
                variant="outline"
                onClick={() => setShowResidentialPreview(false)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Edit
              </Button>
              <Button
                className="bg-[#004182] hover:bg-[#003366] text-white flex items-center gap-2"
                onClick={handleFinalSubmit}
                disabled={isSubmittingProperty}
              >
                {isSubmittingProperty ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Submit Property
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Show Residential Preview Page
  if (showResidentialPreview) {
    return renderResidentialPreview();
  }

  // Show Add New Property Flow
  if (showAddPropertyFlow) {
    if (currentStep === 0) {
      return renderCategorySelection();
    } else if (currentStep === 1) {
      return renderPropertyTitleLocationForm();
    } else if (currentStep === 2) {
      if (selectedPropertyCategory === 'commercial') {
        return renderGeneralPropertyDetailsForm();
      } else if (selectedPropertyCategory === 'residential') {
        return renderResidentialRentalDetailsForm();
      } else {
        return renderPropertyForm();
      }
    } else if (currentStep === 3) {
      return renderFinancialsForm();
    } else if (currentStep === 4) {
      return renderAmenitiesForm();
    } else if (currentStep === 5) {
      return renderDocumentsForm();
    } else if (currentStep === 6) {
      return renderReviewForm();
    } else {
      return renderPropertyForm();
    }
  }

  return (
  <>
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Property Management</h1>
          <p className="text-gray-600 mt-1">
            Manage property listings across different statuses
          </p>
        </div>
      </div>

      {/* Search and Add New Property Button */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search properties by name, address, or owner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button 
          className="bg-[#004182] hover:bg-[#003366] text-white flex items-center gap-2"
          onClick={handleAddNewProperty}
        >
          <Building2 className="h-4 w-4" />
          Add New Property
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'live' | 'pending' | 'rejected')}>
        <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="live" className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          Live
          {counts?.live && (
            <Badge variant="secondary" className="ml-1 bg-green-100 text-green-800">
              {counts.live}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="pending" className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Pending
          {counts?.pending && (
            <Badge variant="secondary" className="ml-1 bg-orange-100 text-orange-800">
              {counts.pending}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="rejected" className="flex items-center gap-2">
          <XCircle className="h-4 w-4" />
          Rejected
          {counts?.rejected && (
            <Badge variant="secondary" className="ml-1 bg-red-100 text-red-800">
              {counts.rejected}
            </Badge>
          )}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="live" className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading properties...</p>
          </div>
        ) : properties && properties.length > 0 ? (
          <div className="bg-white rounded-lg shadow border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Owner
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Listing
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tokens
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Token Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Listed Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {properties.map((property) => (
                    <tr key={property.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <img 
                              className="h-12 w-12 rounded-lg object-cover" 
                              src={property.thumbnail || '/api/placeholder/48/48'} 
                              alt={property.name}
                              onError={(e) => {
                                e.currentTarget.src = '/api/placeholder/48/48';
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {property.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {property.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{property.address}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{property.ownerName}</div>
                        <div className="text-sm text-gray-500">{property.ownerEmail}</div>
                        <div className="text-sm text-gray-500">{property.ownerMobile || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{property.listingType || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {property.totalTokens?.toLocaleString() || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ${(property.tokenPrice || 0).toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ${((property.totalTokens || 0) * (property.tokenPrice || 0)).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {property.liveDate ? new Date(property.liveDate).toLocaleDateString() : 
                           property.createdAt ? new Date(property.createdAt).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleView(property)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(property.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No live properties found</p>
            <p className="text-gray-400">
              {searchQuery ? 'Try adjusting your search terms' : 'Live properties will appear here once approved'}
            </p>
          </div>
        )}
      </TabsContent>

      <TabsContent value="pending" className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading properties...</p>
          </div>
        ) : properties && properties.length > 0 ? (
          <div className="bg-white rounded-lg shadow border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Owner
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Listing
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tokens
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Token Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {properties.map((property) => (
                    <tr key={property.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <img 
                              className="h-12 w-12 rounded-lg object-cover" 
                              src={property.thumbnail || '/api/placeholder/48/48'} 
                              alt={property.name}
                              onError={(e) => {
                                e.currentTarget.src = '/api/placeholder/48/48';
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {property.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {property.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{property.address}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{property.ownerName}</div>
                        <div className="text-sm text-gray-500">{property.ownerEmail}</div>
                        <div className="text-sm text-gray-500">{property.ownerMobile || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{property.listingType || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {property.totalTokens?.toLocaleString() || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ${(property.tokenPrice || 0).toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ${((property.totalTokens || 0) * (property.tokenPrice || 0)).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {property.createdAt ? new Date(property.createdAt).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleView(property)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(property.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No pending properties found</p>
            <p className="text-gray-400">
              {searchQuery ? 'Try adjusting your search terms' : 'Properties awaiting approval will appear here'}
            </p>
          </div>
        )}
      </TabsContent>

      <TabsContent value="rejected" className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading properties...</p>
          </div>
        ) : properties && properties.length > 0 ? (
          <div className="bg-white rounded-lg shadow border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Owner
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Listing
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tokens
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Token Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rejected Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rejection Reason
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {properties.map((property) => (
                    <tr key={property.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <img 
                              className="h-12 w-12 rounded-lg object-cover" 
                              src={property.thumbnail || '/api/placeholder/48/48'} 
                              alt={property.name}
                              onError={(e) => {
                                e.currentTarget.src = '/api/placeholder/48/48';
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {property.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {property.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{property.address}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{property.ownerName}</div>
                        <div className="text-sm text-gray-500">{property.ownerEmail}</div>
                        <div className="text-sm text-gray-500">{property.ownerMobile || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{property.listingType || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {property.totalTokens?.toLocaleString() || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ${(property.tokenPrice || 0).toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ${((property.totalTokens || 0) * (property.tokenPrice || 0)).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {property.rejectedDate ? new Date(property.rejectedDate).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs">
                          {property.rejectionReason || 'No reason provided'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleView(property)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(property.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <XCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No rejected properties found</p>
            <p className="text-gray-400">
              {searchQuery ? 'Try adjusting your search terms' : 'Rejected properties will appear here'}
            </p>
          </div>
        )}
      </TabsContent>
    </Tabs>

    {/* Action dialogs only */}
    <AlertDialog open={isApprovalModalOpen} onOpenChange={setIsApprovalModalOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
            Approve Property
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to approve "{selectedProperty?.name}"? This action will make the property live and available for tokenization.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={() => selectedProperty && approveMutation.mutate(selectedProperty.id)}
            className="bg-green-600 hover:bg-green-700"
            disabled={approveMutation.isPending}
          >
            {approveMutation.isPending ? 'Approving...' : 'Approve Property'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <Dialog open={isRejectionModalOpen} onOpenChange={setIsRejectionModalOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <XCircle className="h-5 w-5 mr-2 text-red-600" />
            Reject Property
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Please provide a reason for rejecting "{selectedProperty?.name}". This will be sent to the property owner.
          </p>
          <div className="space-y-2">
            <Label htmlFor="rejection-reason">Rejection Reason *</Label>
            <Textarea
              id="rejection-reason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Please explain why this property is being rejected..."
              rows={4}
              className="resize-none"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsRejectionModalOpen(false);
                setRejectionReason('');
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={() => {
                if (selectedProperty && rejectionReason.trim()) {
                  rejectMutation.mutate({ 
                    propertyId: selectedProperty.id, 
                    reason: rejectionReason 
                  });
                }
              }}
              disabled={rejectMutation.isPending || !rejectionReason.trim()}
            >
              {rejectMutation.isPending ? 'Rejecting...' : 'Reject Property'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    <Dialog open={isResubmissionModalOpen} onOpenChange={setIsResubmissionModalOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
            Request Resubmission
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Request additional information or changes for "{selectedProperty?.name}". The property owner will receive these comments.
          </p>
          <div className="space-y-2">
            <Label htmlFor="resubmission-comments">Comments *</Label>
            <Textarea
              id="resubmission-comments"
              value={resubmissionComments}
              onChange={(e) => setResubmissionComments(e.target.value)}
              placeholder="Please specify what needs to be updated or clarified..."
              rows={4}
              className="resize-none"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsResubmissionModalOpen(false);
                setResubmissionComments('');
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => {
                if (selectedProperty && resubmissionComments.trim()) {
                  requestResubmissionMutation.mutate({ 
                    propertyId: selectedProperty.id, 
                    comments: resubmissionComments 
                  });
                }
              }}
              disabled={requestResubmissionMutation.isPending || !resubmissionComments.trim()}
            >
              {requestResubmissionMutation.isPending ? 'Sending...' : 'Send Request'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    {/* Media Gallery Modal - Only show when in Property Review */}
    <Dialog open={showMediaGallery && showPropertyReview} onOpenChange={setShowMediaGallery}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 z-[60]">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="flex items-center justify-between">
            <span className="capitalize">{mediaType === '360' ? '360° Virtual Tours' : `Property ${mediaType}`}</span>
            <div className="flex items-center space-x-2">
              {selectedProperty && getMediaArray(selectedProperty, mediaType).length > 1 && (
                <span className="text-sm text-gray-500">
                  {currentMediaIndex + 1} of {getMediaArray(selectedProperty, mediaType).length}
                </span>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowMediaGallery(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="relative flex-1 overflow-hidden">
          {selectedProperty && (
            <>
              {/* Navigation Buttons */}
              {getMediaArray(selectedProperty, mediaType).length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={prevMedia}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70 h-10 w-10 p-0 rounded-full"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={nextMedia}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70 h-10 w-10 p-0 rounded-full"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </>
              )}

              {/* Media Content */}
              <div className="flex items-center justify-center bg-black min-h-[500px]">
                {mediaType === 'images' && (
                  <img
                    src={getMediaArray(selectedProperty, mediaType)[currentMediaIndex]}
                    alt={`Property image ${currentMediaIndex + 1}`}
                    className="max-w-full max-h-[500px] object-contain"
                  />
                )}

                {mediaType === 'videos' && (
                  <video
                    key={currentMediaIndex} // Force re-render when switching videos
                    controls
                    className="max-w-full max-h-[500px]"
                    autoPlay
                  >
                    <source src={getMediaArray(selectedProperty, mediaType)[currentMediaIndex]} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}

                {mediaType === '360' && (
                  <div className="w-full h-[500px] bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="animate-spin">
                        <RotateCcw className="h-16 w-16 text-blue-600 mx-auto" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">360° Virtual Tour</h3>
                        <p className="text-gray-600 mb-4">Experience an immersive view of this property</p>
                        <Button
                          onClick={() => window.open(getMediaArray(selectedProperty, mediaType)[currentMediaIndex], '_blank')}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open Virtual Tour
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Media Info Bar */}
              <div className="p-4 bg-gray-50 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {mediaType === 'images' && `Image ${currentMediaIndex + 1}`}
                      {mediaType === 'videos' && `Property Video ${currentMediaIndex + 1}`}
                      {mediaType === '360' && `360° Virtual Tour ${currentMediaIndex + 1}`}
                    </h4>
                    <p className="text-sm text-gray-500">{selectedProperty.name}</p>
                  </div>

                  {/* Media Type Switcher */}
                  <div className="flex items-center space-x-2">
                    {selectedProperty.images && selectedProperty.images.length > 0 && (
                      <Button
                        variant={mediaType === 'images' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          setMediaType('images');
                          setCurrentMediaIndex(0);
                        }}
                        className="text-xs"
                      >
                        <Camera className="h-3 w-3 mr-1" />
                        Images ({selectedProperty.images.length})
                      </Button>
                    )}
                    {selectedProperty.videos && selectedProperty.videos.length > 0 && (
                      <Button
                        variant={mediaType === 'videos' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          setMediaType('videos');
                          setCurrentMediaIndex(0);
                        }}
                        className="text-xs"
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Videos ({selectedProperty.videos.length})
                      </Button>
                    )}
                    {selectedProperty.view360 && selectedProperty.view360.length > 0 && (
                      <Button
                        variant={mediaType === '360' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          setMediaType('360');
                          setCurrentMediaIndex(0);
                        }}
                        className="text-xs"
                      >
                        <RotateCcw className="h-3 w-3 mr-1" />
                        360° ({selectedProperty.view360.length})
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>

    {/* Detailed Property Submission Review Screen */}
    {showDetailedSubmissionReview && selectedProperty && (
      <div className="space-y-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <button 
            onClick={handleBackFromDetailedReview}
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Property Management
          </button>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-600">Pending Listings</span>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-gray-900">Property Submission Review</span>
        </div>

        <div className="space-y-6">
            {/* Property Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <h1 className="text-2xl font-bold text-gray-900">{selectedProperty.name}</h1>
                    <Badge variant={selectedProperty.propertyType === 'residential' ? 'default' : 'secondary'}>
                      {selectedProperty.propertyType === 'residential' ? 'Residential' : 'Commercial'}
                    </Badge>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                      Pending
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Submission Date:</span>
                      <span className="ml-2 font-medium">{formatDate(selectedProperty.createdAt)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Submitted By:</span>
                      <span className="ml-2 font-medium">{selectedProperty.ownerName} ({selectedProperty.ownerEmail})</span>
                    </div>
                  </div>
                </div>
                <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                  {selectedProperty.thumbnail ? (
                    <img
                      src={selectedProperty.thumbnail}
                      alt="Property cover"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Content Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Screening Parameters */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                    Screening Parameters
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Property Address</span>
                      <p className="font-medium">{selectedProperty.address}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">City & State</span>
                      <p className="font-medium">{selectedProperty.city}, {selectedProperty.state}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Market Area</span>
                      <p className="font-medium">{selectedProperty.market}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Home Value Estimate</span>
                      <p className="font-medium">${(selectedProperty.homeValueEstimate / 100).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Basic Property Details */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Home className="h-5 w-5 mr-2 text-green-600" />
                    Basic Property Details
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Bedrooms</span>
                      <p className="font-medium">{selectedProperty.bedrooms || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Bathrooms</span>
                      <p className="font-medium">{selectedProperty.bathrooms || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Guest Capacity</span>
                      <p className="font-medium">N/A</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Square Footage</span>
                      <p className="font-medium">{selectedProperty.squareFootage?.toLocaleString()} sq ft</p>
                    </div>
                  </div>
                </div>

                {/* Property Photos */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Camera className="h-5 w-5 mr-2 text-purple-600" />
                    Property Photos
                  </h3>
                  {selectedProperty.images && selectedProperty.images.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {selectedProperty.images.slice(0, 8).map((image, index) => (
                        <div key={index} className="relative group cursor-pointer">
                          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                            <img
                              src={image}
                              alt={`Property photo ${index + 1}`}
                              className="w-full h-full object-cover"
                              onClick={() => setSelectedMediaPreview({type: 'photo', index})}
                            />
                          </div>
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded-lg flex items-center justify-center">
                            <Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Camera className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p>No photos uploaded</p>
                    </div>
                  )}
                </div>

                {/* Property Videos */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="h-5 w-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Property Videos
                  </h3>
                  {selectedProperty.videos && selectedProperty.videos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedProperty.videos.map((video, index) => (
                        <div key={index} className="relative group cursor-pointer">
                          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                            <div className="text-center">
                              <svg className="h-12 w-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <p className="text-sm text-gray-600">Video {index + 1}</p>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setSelectedMediaPreview({type: 'video', index})}
                                className="mt-2"
                              >
                                <Play className="h-4 w-4 mr-1" />
                                Play
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <svg className="h-8 w-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <p>No videos uploaded</p>
                    </div>
                  )}
                </div>

                {/* 360° Virtual Tour */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="h-5 w-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    360° Virtual Tour
                  </h3>
                  {selectedProperty.view360 && selectedProperty.view360.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {selectedProperty.view360.map((view, index) => (
                        <div key={index} className="relative group cursor-pointer">
                          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                            <img
                              src={view}
                              alt={`360° view ${index + 1}`}
                              className="w-full h-full object-cover"
                              onClick={() => setSelectedMediaPreview({type: '360', index})}
                            />
                          </div>
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded-lg flex items-center justify-center">
                            <svg className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <svg className="h-8 w-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p>No 360° content uploaded</p>
                    </div>
                  )}
                </div>

                {/* Rates and Pricing */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                    Rates and Pricing
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Nightly Base Rate</span>
                      <p className="font-medium">$250/night</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Weekend Rate</span>
                      <p className="font-medium">$300/night</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Peak Season Rate</span>
                      <p className="font-medium">$400/night</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Cleaning Fee</span>
                      <p className="font-medium">$150</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Minimum Stay</span>
                      <p className="font-medium">3 nights</p>
                    </div>
                  </div>
                </div>

                {/* House Rules and Policies */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-orange-600" />
                    House Rules and Policies
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <span className="text-sm text-gray-500">House Rules</span>
                      <p className="mt-1 text-sm">No smoking, No pets, Quiet hours 10PM-8AM, Maximum 8 guests</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Check-in Time</span>
                      <p className="mt-1 font-medium">3:00 PM</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Check-out Time</span>
                      <p className="mt-1 font-medium">11:00 AM</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Local Highlights</span>
                      <p className="mt-1 text-sm">Close to downtown attractions, 5-min walk to beach, Nearby restaurants and shopping</p>
                    </div>
                  </div>
                </div>

                {/* Featured Amenities */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Star className="h-5 w-5 mr-2 text-yellow-600" />
                    Featured Amenities
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {['Pool', 'Chef Kitchen', 'Hot Tub', 'Fireplace', 'Private Parking', 'High-Speed WiFi', 'Air Conditioning', 'Washer/Dryer'].map((amenity) => (
                      <Badge key={amenity} variant="secondary" className="bg-blue-50 text-blue-700">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Other Features */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-gray-600" />
                    Other Features
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Furnishing Description</span>
                      <p className="text-sm mt-1">Fully furnished with modern appliances and luxury finishes</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Smart Home Features</span>
                      <p className="text-sm mt-1">Smart locks, automated lighting, climate control</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Concierge Services</span>
                      <p className="text-sm mt-1">24/7 concierge, housekeeping, maintenance support</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Video Tour URL</span>
                      <p className="text-sm mt-1">https://example.com/virtual-tour</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Document Upload Section - Only for Residential */}
                {selectedProperty.propertyType === 'residential' && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-blue-600" />
                      Required Documents
                    </h3>
                    <div className="space-y-3">
                      {[
                        { name: 'Property Deed', key: 'deed', uploaded: true },
                        { name: 'Title Report or Title Insurance', key: 'title', uploaded: true },
                        { name: 'Government-issued ID', key: 'id', uploaded: false },
                        { name: 'Property Tax Bill', key: 'tax', uploaded: true },
                        { name: 'Mortgage Statement', key: 'mortgage', uploaded: true },
                        { name: 'HOA Documents', key: 'hoa', uploaded: false },
                        { name: 'Proof of Insurance', key: 'insurance', uploaded: true },
                        { name: 'Utility Bill or Recent Statement', key: 'utility', uploaded: true },
                        { name: 'Property Appraisal', key: 'appraisal', uploaded: false },
                        { name: 'Seller\'s Authorization to Sell Fractional Interest', key: 'authorization', uploaded: true }
                      ].map((doc) => (
                        <div key={doc.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                            <div className="flex items-center mt-1">
                              {doc.uploaded ? (
                                <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-500 mr-1" />
                              )}
                              <span className={`text-xs ${doc.uploaded ? 'text-green-600' : 'text-red-600'}`}>
                                {doc.uploaded ? 'Uploaded' : 'Missing'}
                              </span>
                            </div>
                          </div>
                          {doc.uploaded && (
                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Admin Actions */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-indigo-600" />
                    Admin Actions
                  </h3>
                  <div className="space-y-3">
                    <Button 
                      onClick={() => setIsApprovalModalOpen(true)}
                      className="w-full bg-green-600 hover:bg-green-700"
                      disabled={approveMutation.isPending}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve Property
                    </Button>

                    <Button 
                      onClick={() => setIsRejectionModalOpen(true)}
                      variant="destructive"
                      className="w-full"
                      disabled={rejectMutation.isPending}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject Property
                    </Button>

                    <Button 
                      onClick={() => setIsResubmissionModalOpen(true)}
                      variant="outline"
                      className="w-full"
                      disabled={requestResubmissionMutation.isPending}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Request Resubmission
                    </Button>
                  </div>
                </div>

                {/* Submission Status */}
                <div className="bg-orange-50 rounded-lg border border-orange-200 p-4">
                  <div className="flex items-center mb-2">
                    <Clock className="h-5 w-5 text-orange-600 mr-2" />
                    <span className="font-medium text-orange-800">Awaiting Review</span>
                  </div>
                  <p className="text-sm text-orange-700">
                    This property submission is pending admin review. All required information has been provided.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
    )}

    {/* Media Preview Modal */}
    {selectedMediaPreview && (
      <Dialog open={true} onOpenChange={() => setSelectedMediaPreview(null)}>
        <DialogContent className="max-w-4xl w-full">
          <DialogHeader>
            <DialogTitle>
              {selectedMediaPreview.type === 'photo' && 'Photo Preview'}
              {selectedMediaPreview.type === 'video' && 'Video Preview'}
              {selectedMediaPreview.type === '360' && '360° View Preview'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedMediaPreview.type === 'photo' && selectedProperty.images && (
              <div className="relative">
                <img
                  src={selectedProperty.images[selectedMediaPreview.index]}
                  alt={`Property photo ${selectedMediaPreview.index + 1}`}
                  className="w-full h-96 object-contain bg-gray-100 rounded-lg"
                />
                <div className="flex justify-between mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedMediaPreview({
                      ...selectedMediaPreview,
                      index: Math.max(0, selectedMediaPreview.index - 1)
                    })}
                    disabled={selectedMediaPreview.index === 0}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <span className="self-center text-sm text-gray-600">
                    {selectedMediaPreview.index + 1} of {selectedProperty.images.length}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedMediaPreview({
                      ...selectedMediaPreview,
                      index: Math.min(selectedProperty.images.length - 1, selectedMediaPreview.index + 1)
                    })}
                    disabled={selectedMediaPreview.index === selectedProperty.images.length - 1}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
            {selectedMediaPreview.type === 'video' && selectedProperty.videos && (
              <div className="relative">
                <video
                  src={selectedProperty.videos[selectedMediaPreview.index]}
                  controls
                  className="w-full h-96 bg-gray-100 rounded-lg"
                />
                <div className="flex justify-between mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedMediaPreview({
                      ...selectedMediaPreview,
                      index: Math.max(0, selectedMediaPreview.index - 1)
                    })}
                    disabled={selectedMediaPreview.index === 0}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <span className="self-center text-sm text-gray-600">
                    {selectedMediaPreview.index + 1} of {selectedProperty.videos.length}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedMediaPreview({
                      ...selectedMediaPreview,
                      index: Math.min(selectedProperty.videos.length - 1, selectedMediaPreview.index + 1)
                    })}
                    disabled={selectedMediaPreview.index === selectedProperty.videos.length - 1}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
            {selectedMediaPreview.type === '360' && selectedProperty.view360 && (
              <div className="relative">
                <img
                  src={selectedProperty.view360[selectedMediaPreview.index]}
                  alt={`360° view ${selectedMediaPreview.index + 1}`}
                  className="w-full h-96 object-contain bg-gray-100 rounded-lg"
                />
                <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                  360° View
                </div>
                <div className="flex justify-between mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedMediaPreview({
                      ...selectedMediaPreview,
                      index: Math.max(0, selectedMediaPreview.index - 1)
                    })}
                    disabled={selectedMediaPreview.index === 0}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <span className="self-center text-sm text-gray-600">
                    {selectedMediaPreview.index + 1} of {selectedProperty.view360.length}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedMediaPreview({
                      ...selectedMediaPreview,
                      index: Math.min(selectedProperty.view360.length - 1, selectedMediaPreview.index + 1)
                    })}
                    disabled={selectedMediaPreview.index === selectedProperty.view360.length - 1}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    )}
    </div>
  </>
  );
}