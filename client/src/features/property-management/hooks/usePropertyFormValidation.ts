
import { useState, useCallback } from 'react';

interface ValidationState {
  isValidating: boolean;
  isValid: boolean | null;
  message: string;
}

export const usePropertyFormValidation = () => {
  const [zipCodeValidation, setZipCodeValidation] = useState<ValidationState>({
    isValidating: false,
    isValid: null,
    message: '',
  });

  const validatePropertyTitle = useCallback((title: string) => {
    if (!title.trim()) return "Property title is required";
    if (title.length < 2) return "Property title must be at least 2 characters";
    if (title.length > 100) return "Property title must be less than 100 characters";
    // Check for special characters (only hyphen and slash allowed)
    if (!/^[a-zA-Z0-9\s\-\/]+$/.test(title)) return "Only letters, numbers, spaces, hyphens, and slashes are allowed";
    return "";
  }, []);

  const validateSquareFootage = useCallback((value: string) => {
    if (!value.trim()) return "Square footage is required";
    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) return "Square footage must be greater than 0";
    return "";
  }, []);

  const validateNightlyRate = useCallback((value: string) => {
    if (!value.trim()) return "Nightly rate is required";
    const num = parseFloat(value);
    if (isNaN(num) || num <= 10) return "Nightly rate must be greater than $10";
    return "";
  }, []);

  const validateCleaningFee = useCallback((value: string) => {
    if (!value.trim()) return "Cleaning fee is required";
    const num = parseFloat(value);
    if (isNaN(num) || num <= 5) return "Cleaning fee must be greater than $5";
    return "";
  }, []);

  const validateFileUpload = useCallback((file: File | null, fieldName: string) => {
    if (!file) return `${fieldName} is required`;
    if (file.size > 25 * 1024 * 1024) return `${fieldName} must be less than 25MB`;
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) return `${fieldName} must be PDF, JPG, or PNG`;
    return "";
  }, []);

  const validateZipCode = useCallback(async (zipCode: string) => {
    setZipCodeValidation({
      isValidating: true,
      isValid: null,
      message: ''
    });

    try {
      // Simulate API call for zip code validation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation - eligible zip codes
      const eligibleZipCodes = ['10001', '10002', '90210', '33139', '60601', '94102', '02101', '78701'];
      
      const isValid = eligibleZipCodes.includes(zipCode);
      
      setZipCodeValidation({
        isValidating: false,
        isValid,
        message: isValid 
          ? 'Location verified! You can proceed.' 
          : 'Unfortunately, Rentzy is not managing the properties on selected location.'
      });
    } catch (error) {
      setZipCodeValidation({
        isValidating: false,
        isValid: false,
        message: 'Error validating zip code. Please try again.'
      });
    }
  }, []);

  return {
    zipCodeValidation,
    validatePropertyTitle,
    validateSquareFootage,
    validateNightlyRate,
    validateCleaningFee,
    validateFileUpload,
    validateZipCode,
  };
};

export default usePropertyFormValidation;
