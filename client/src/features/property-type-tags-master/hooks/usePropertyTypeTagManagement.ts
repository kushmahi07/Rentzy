
import { useState, useMemo } from 'react';
import { PropertyTypeTag, PropertyTypeTagFormData, PropertyTypeTagFiltersType } from '../types';
import { mockPropertyTypeTags } from '../mockData';

export function usePropertyTypeTagManagement() {
  const [tags, setTags] = useState<PropertyTypeTag[]>(mockPropertyTypeTags);
  const [filters, setFilters] = useState<PropertyTypeTagFiltersType>({
    search: '',
  });

  const filteredTags = useMemo(() => {
    return tags.filter(tag => {
      const matchesSearch = !filters.search || 
        tag.tagName.toLowerCase().includes(filters.search.toLowerCase());

      return matchesSearch;
    }).sort((a, b) => a.sortOrder - b.sortOrder);
  }, [tags, filters]);

  const addTag = (tagData: PropertyTypeTagFormData) => {
    const newTag: PropertyTypeTag = {
      id: Date.now().toString(),
      tagName: tagData.tagName,
      description: tagData.description,
      sortOrder: tagData.sortOrder as number,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setTags(prev => [...prev, newTag]);
  };

  const updateTag = (id: string, tagData: PropertyTypeTagFormData) => {
    setTags(prev => prev.map(tag => 
      tag.id === id 
        ? {
            ...tag,
            tagName: tagData.tagName,
            description: tagData.description,
            sortOrder: tagData.sortOrder as number,
            updatedAt: new Date(),
          }
        : tag
    ));
  };

  const deleteTag = (id: string) => {
    setTags(prev => prev.filter(tag => tag.id !== id));
  };

  return {
    tags: filteredTags,
    allTags: tags,
    filters,
    setFilters,
    addTag,
    updateTag,
    deleteTag,
  };
}
