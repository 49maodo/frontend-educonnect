import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import type { School } from '@/types/api';
import * as React from "react";

interface SchoolFiltersProps {
  schools: School[];
  onFilterChange: (filteredSchools: School[]) => void;
}

export function SchoolFilters({ schools, onFilterChange }: SchoolFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedField, setSelectedField] = useState('');
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Extract unique values for filter options
  const cities = Array.from(new Set(schools.map(school => school.city))).sort();
  const fields = Array.from(new Set(
    schools.flatMap(school => 
      school.diplomas?.filter(d => d.is_active).map(d => d.field) || []
    )
  )).sort();

  const applyFilters = () => {
    let filtered = schools;

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(school =>
        school.name.toLowerCase().includes(term) ||
        school.description.toLowerCase().includes(term) ||
        school.city.toLowerCase().includes(term) ||
        school.accreditations.toLowerCase().includes(term) ||
        school.diplomas?.some(d => 
          d.name.toLowerCase().includes(term) ||
          d.field.toLowerCase().includes(term)
        )
      );
    }

    // City filter
    if (selectedCity) {
      filtered = filtered.filter(school => school.city === selectedCity);
    }

    // Field filter
    if (selectedField) {
      filtered = filtered.filter(school =>
        school.diplomas?.some(d => d.is_active && d.field === selectedField)
      );
    }

    // Price filter
    filtered = filtered.filter(school =>
      school.diplomas?.some(d => {
        const price = parseFloat(d.price);
        return d.is_active && price >= priceRange[0] && price <= priceRange[1];
      })
    );

    onFilterChange(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCity('');
    setSelectedField('');
    setPriceRange([0, 50000]);
    onFilterChange(schools);
  };

  const activeFiltersCount = [searchTerm, selectedCity, selectedField].filter(Boolean).length +
    (priceRange[0] > 0 || priceRange[1] < 50000 ? 1 : 0);

  // Apply filters when any filter changes
  React.useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedCity, selectedField, priceRange]);

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Rechercher une école, ville, filière..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filter controls */}
      <div className="flex items-center gap-2">
        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtres
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filtrer les écoles</SheetTitle>
            </SheetHeader>
            
            <div className="space-y-6 mt-6">
              {/* City filter */}
              <div className="space-y-2">
                <Label>Ville</Label>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les villes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les villes</SelectItem>
                    {cities.map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Field filter */}
              <div className="space-y-2">
                <Label>Filière</Label>
                <Select value={selectedField} onValueChange={setSelectedField}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les filières" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Toutes les filières</SelectItem>
                    {fields.map(field => (
                      <SelectItem key={field} value={field}>{field}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price range filter */}
              <div className="space-y-3">
                <Label>Prix (€)</Label>
                <div className="px-2">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={50000}
                    min={0}
                    step={1000}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{priceRange[0].toLocaleString()}€</span>
                  <span>{priceRange[1].toLocaleString()}€</span>
                </div>
              </div>

              {/* Clear filters */}
              <Button 
                variant="outline" 
                onClick={clearFilters}
                className="w-full"
                disabled={activeFiltersCount === 0}
              >
                <X className="h-4 w-4 mr-2" />
                Effacer les filtres
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Active filters display */}
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            Effacer tout
          </Button>
        )}
      </div>

      {/* Active filter badges */}
      {(searchTerm || selectedCity || selectedField || priceRange[0] > 0 || priceRange[1] < 50000) && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <Badge variant="secondary">
              Recherche: {searchTerm}
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 h-4 w-4 p-0"
                onClick={() => setSearchTerm('')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {selectedCity && (
            <Badge variant="secondary">
              Ville: {selectedCity}
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 h-4 w-4 p-0"
                onClick={() => setSelectedCity('')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {selectedField && (
            <Badge variant="secondary">
              Filière: {selectedField}
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 h-4 w-4 p-0"
                onClick={() => setSelectedField('')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {(priceRange[0] > 0 || priceRange[1] < 50000) && (
            <Badge variant="secondary">
              Prix: {priceRange[0].toLocaleString()}€ - {priceRange[1].toLocaleString()}€
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 h-4 w-4 p-0"
                onClick={() => setPriceRange([0, 50000])}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}