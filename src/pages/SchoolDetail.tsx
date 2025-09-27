import { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { MapPin, Phone, Globe, Award, Euro, Calendar, Clock, FileText, CircleCheck as CheckCircle, Loader as Loader2, CircleAlert as AlertCircle, User } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useGetSchoolQuery, useCreateApplicationMutation } from '../store/api/apiSlice';
import { useAuth } from '../hooks/useAuth';
import type { Diploma } from '../types/api';

export function SchoolDetail() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const [selectedDiploma, setSelectedDiploma] = useState<Diploma | null>(null);
  const [studentNotes, setStudentNotes] = useState('');
  const [isApplicationDialogOpen, setIsApplicationDialogOpen] = useState(false);

  const { data: schoolData, isLoading, error } = useGetSchoolQuery(Number(id));
  const [createApplication, { isLoading: isCreatingApplication }] = useCreateApplicationMutation();

  if (!id || isNaN(Number(id))) {
    return <Navigate to="/schools" replace />;
  }

  const school = schoolData?.data;
  const activeDiplomas = school?.diplomas?.filter(d => d.is_active) || [];

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
    } catch {
      return 'Date invalide';
    }
  };

  const isApplicationDeadlinePassed = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  const handleApply = async () => {
    if (!selectedDiploma) return;

    try {
      await createApplication({
        diploma_id: selectedDiploma.id,
        student_notes: studentNotes.trim() || undefined,
      }).unwrap();

      toast.success('Candidature soumise avec succès!');
      setIsApplicationDialogOpen(false);
      setStudentNotes('');
      setSelectedDiploma(null);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Erreur lors de la soumission de la candidature');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Chargement des détails de l'école...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !school) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            École introuvable. Veuillez vérifier l'URL ou retourner à la liste des écoles.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* School header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{school.name}</h1>
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <MapPin className="h-4 w-4" />
              <span>{school.address}, {school.city}, {school.country}</span>
            </div>
          </div>
          <Badge variant={school.is_active ? 'default' : 'secondary'} className="text-sm">
            {school.is_active ? 'École Active' : 'Inactive'}
          </Badge>
        </div>

        <p className="text-lg text-muted-foreground leading-relaxed">
          {school.description}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Diplomas */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Formations Disponibles</h2>
            {activeDiplomas.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Aucune formation active disponible pour le moment.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                {activeDiplomas.map((diploma) => (
                  <Card key={diploma.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">{diploma.name}</CardTitle>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge variant="secondary">{diploma.level}</Badge>
                            <Badge variant="outline">{diploma.field}</Badge>
                            <Badge variant="outline">{diploma.duration} ans</Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">
                            {parseFloat(diploma.price).toLocaleString()}€
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">{diploma.description}</p>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Rentrée: {formatDate(diploma.start_date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>Candidatures jusqu'au: {formatDate(diploma.application_deadline)}</span>
                        </div>
                      </div>

                      {diploma.conditions && (
                        <div className="space-y-2">
                          <h4 className="font-medium flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Conditions d'admission
                          </h4>
                          <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                            {diploma.conditions}
                          </p>
                        </div>
                      )}

                      <div className="flex justify-end pt-2">
                        {!isAuthenticated ? (
                          <Button variant="outline" disabled>
                            <User className="h-4 w-4 mr-2" />
                            Connectez-vous pour postuler
                          </Button>
                        ) : isApplicationDeadlinePassed(diploma.application_deadline) ? (
                          <Button variant="outline" disabled>
                            Candidatures fermées
                          </Button>
                        ) : (
                          <Dialog 
                            open={isApplicationDialogOpen && selectedDiploma?.id === diploma.id} 
                            onOpenChange={(open) => {
                              setIsApplicationDialogOpen(open);
                              if (open) setSelectedDiploma(diploma);
                              else setSelectedDiploma(null);
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Postuler
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Postuler à {diploma.name}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="bg-muted p-4 rounded-lg">
                                  <h4 className="font-medium mb-2">Résumé de la formation</h4>
                                  <div className="text-sm space-y-1">
                                    <p><strong>École:</strong> {school.name}</p>
                                    <p><strong>Formation:</strong> {diploma.name}</p>
                                    <p><strong>Niveau:</strong> {diploma.level}</p>
                                    <p><strong>Prix:</strong> {parseFloat(diploma.price).toLocaleString()}€</p>
                                    <p><strong>Rentrée:</strong> {formatDate(diploma.start_date)}</p>
                                  </div>
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor="notes">Notes personnelles (optionnel)</Label>
                                  <Textarea
                                    id="notes"
                                    placeholder="Ajoutez des informations supplémentaires sur votre candidature..."
                                    value={studentNotes}
                                    onChange={(e) => setStudentNotes(e.target.value)}
                                    rows={4}
                                  />
                                </div>

                                <div className="flex justify-end gap-2">
                                  <Button variant="outline" onClick={() => setIsApplicationDialogOpen(false)}>
                                    Annuler
                                  </Button>
                                  <Button onClick={handleApply} disabled={isCreatingApplication}>
                                    {isCreatingApplication ? (
                                      <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Envoi...
                                      </>
                                    ) : (
                                      'Confirmer la candidature'
                                    )}
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact info */}
          <Card>
            <CardHeader>
              <CardTitle>Informations de Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{school.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <a 
                  href={school.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  Site web
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="text-sm">
                  <div>{school.address}</div>
                  <div>{school.city}, {school.country}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Accreditations */}
          {school.accreditations && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Accréditations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {school.accreditations.split(',').map((accred, index) => (
                    <Badge key={index} variant="outline">
                      {accred.trim()}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Application fee */}
          {school.application_fee_amount && parseFloat(school.application_fee_amount) > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Euro className="h-5 w-5" />
                  Frais de Candidature
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {parseFloat(school.application_fee_amount).toLocaleString()}€
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Par candidature soumise
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}