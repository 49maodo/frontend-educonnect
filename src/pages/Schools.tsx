import { useState, useMemo } from 'react';
import { Loader as Loader2, School as SchoolIcon, CircleAlert as AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useGetSchoolsQuery } from '../store/api/apiSlice';
import { SchoolCard } from '../components/schools/SchoolCard';
import { SchoolFilters } from '../components/schools/SchoolFilters';
import type { School } from '../types/api';
import * as React from "react";

export function Schools() {
  const { data: schoolsData, isLoading, error } = useGetSchoolsQuery();
  const [filteredSchools, setFilteredSchools] = useState<School[]>([]);

  const schools = useMemo(() => {
    return schoolsData?.data.filter(school => school.is_active) || [];
  }, [schoolsData]);

  // Initialize filtered schools when schools data loads
  React.useEffect(() => {
    setFilteredSchools(schools);
  }, [schools]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Chargement des écoles...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Erreur lors du chargement des écoles. Veuillez réessayer plus tard.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 space-y-4">
        <div className="flex items-center gap-3">
          <SchoolIcon className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Écoles Partenaires</h1>
            <p className="text-muted-foreground">
              Découvrez {schools.length} établissement{schools.length > 1 ? 's' : ''} de qualité
            </p>
          </div>
        </div>
        
        {/* Filters */}
        <SchoolFilters schools={schools} onFilterChange={setFilteredSchools} />
      </div>

      {/* Results */}
      {filteredSchools.length === 0 ? (
        <div className="text-center py-12">
          <SchoolIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Aucune école trouvée</h3>
          <p className="text-muted-foreground">
            Essayez de modifier vos critères de recherche pour voir plus de résultats.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              {filteredSchools.length} résultat{filteredSchools.length > 1 ? 's' : ''} trouvé{filteredSchools.length > 1 ? 's' : ''}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchools.map((school) => (
              <SchoolCard key={school.id} school={school} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}