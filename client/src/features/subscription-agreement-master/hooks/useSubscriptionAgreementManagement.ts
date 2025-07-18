
import { useState, useMemo } from 'react';
import { SubscriptionAgreement, SubscriptionAgreementFilters, SubscriptionAgreementFormData } from '../types';
import { MOCK_SUBSCRIPTION_AGREEMENTS } from '../mockData';

export function useSubscriptionAgreementManagement() {
  const [agreements, setAgreements] = useState<SubscriptionAgreement[]>(MOCK_SUBSCRIPTION_AGREEMENTS);
  const [filters, setFilters] = useState<SubscriptionAgreementFilters>({
    searchTerm: '',
  });

  const filteredAgreements = useMemo(() => {
    return agreements.filter(agreement => {
      const matchesSearch = !filters.searchTerm || 
        agreement.agreementName.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      return matchesSearch;
    });
  }, [agreements, filters]);

  const addAgreement = (formData: SubscriptionAgreementFormData) => {
    const newAgreement: SubscriptionAgreement = {
      id: (agreements.length + 1).toString(),
      agreementName: formData.agreementName,
      documentFilename: formData.document?.name || '',
      documentUrl: formData.document ? URL.createObjectURL(formData.document) : '',
      version: formData.version,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setAgreements(prev => [newAgreement, ...prev]);
    return newAgreement;
  };

  const updateAgreement = (id: string, formData: SubscriptionAgreementFormData) => {
    setAgreements(prev =>
      prev.map(agreement =>
        agreement.id === id
          ? {
              ...agreement,
              agreementName: formData.agreementName,
              documentFilename: formData.document?.name || agreement.documentFilename,
              documentUrl: formData.document ? URL.createObjectURL(formData.document) : agreement.documentUrl,
              version: formData.version,
              updatedAt: new Date(),
            }
          : agreement
      )
    );
  };

  const deleteAgreement = (id: string) => {
    setAgreements(prev => prev.filter(agreement => agreement.id !== id));
  };

  const isDuplicateName = (name: string, excludeId?: string) => {
    return agreements.some(agreement => 
      agreement.agreementName.toLowerCase() === name.toLowerCase() && 
      agreement.id !== excludeId
    );
  };

  return {
    agreements: filteredAgreements,
    allAgreements: agreements,
    filters,
    setFilters,
    addAgreement,
    updateAgreement,
    deleteAgreement,
    isDuplicateName,
  };
}
