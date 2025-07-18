
import { useState, useMemo } from 'react';
import { Amenity, AmenityFormData, AmenityFiltersType } from '../types';
import { mockAmenities } from '../mockData';

export function useAmenityManagement() {
  const [amenities, setAmenities] = useState<Amenity[]>(mockAmenities);
  const [filters, setFilters] = useState<AmenityFiltersType>({
    search: '',
    type: 'All',
  });

  // Filter amenities based on search and type
  const filteredAmenities = useMemo(() => {
    return amenities.filter((amenity) => {
      const matchesSearch = amenity.name
        .toLowerCase()
        .includes(filters.search.toLowerCase());
      const matchesType = filters.type === 'All' || amenity.type === filters.type;
      return matchesSearch && matchesType;
    });
  }, [amenities, filters]);

  const addAmenity = (data: AmenityFormData) => {
    const newAmenity: Amenity = {
      id: Date.now().toString(),
      name: data.name,
      type: data.type as 'Indoor' | 'Outdoor',
      icon: data.iconFile ? '📷' : data.icon, // Placeholder for uploaded icon
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setAmenities([...amenities, newAmenity]);
  };

  const updateAmenity = (id: string, data: AmenityFormData) => {
    setAmenities(amenities.map((amenity) => 
      amenity.id === id
        ? {
            ...amenity,
            name: data.name,
            type: data.type as 'Indoor' | 'Outdoor',
            icon: data.iconFile ? '📷' : data.icon,
            updatedAt: new Date().toISOString(),
          }
        : amenity
    ));
  };

  const deleteAmenity = (id: string) => {
    setAmenities(amenities.filter((amenity) => amenity.id !== id));
  };

  return {
    amenities: filteredAmenities,
    allAmenities: amenities,
    filters,
    setFilters,
    addAmenity,
    updateAmenity,
    deleteAmenity,
  };
}
