import { Link } from 'react-router-dom';
import { MapPin, Euro, GraduationCap } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {School} from "@/types/api.ts";

interface SchoolCardProps {
  school: School;
}

export function SchoolCard({ school }: SchoolCardProps) {
  const activeDiplomas = school.diplomas?.filter(d => d.is_active) || [];
  const priceRange = activeDiplomas.length > 0 
    ? `${Math.min(...activeDiplomas.map(d => parseFloat(d.price)))} - ${Math.max(...activeDiplomas.map(d => parseFloat(d.price)))}€`
    : 'N/A';

  return (
    <Card className="h-full flex flex-col transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-2 leading-tight">
            {school.name}
          </CardTitle>
          <Badge variant={school.is_active ? 'default' : 'secondary'} className="shrink-0">
            {school.is_active ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {school.description}
        </p>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {school.city}, {school.country}
            </span>
          </div>

          {activeDiplomas.length > 0 && (
            <>
              <div className="flex items-center gap-2 text-sm">
                <Euro className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Prix: {priceRange}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {activeDiplomas.length} diplôme{activeDiplomas.length > 1 ? 's' : ''}
                </span>
              </div>
            </>
          )}

          {school.accreditations && (
            <div className="flex flex-wrap gap-1">
              {school.accreditations.split(',').slice(0, 2).map((accred, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {accred.trim()}
                </Badge>
              ))}
              {school.accreditations.split(',').length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{school.accreditations.split(',').length - 2}
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-4">
        <Button asChild className="w-full">
          <Link to={`/schools/${school.id}`}>
            Voir les détails
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}