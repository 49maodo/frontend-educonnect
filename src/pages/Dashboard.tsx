
import { Link } from 'react-router-dom';
import { FileText, School, TrendingUp, Plus, Loader as Loader2, CircleAlert as AlertCircle, Clock, CircleCheck as CheckCircle, Circle as XCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, 
  AlertDialogContent, AlertDialogDescription, 
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { ApplicationCard } from '../components/applications/ApplicationCard';
import { 
  useGetApplicationsQuery, 
  useDeleteApplicationMutation,
} from '../store/api/apiSlice';
import { useAuth } from '../hooks/useAuth';
import type { Application } from '../types/api';

export function Dashboard() {
  const { user } = useAuth();
  const { data: applicationsData, isLoading: isLoadingApplications, error: applicationsError } = useGetApplicationsQuery();

  const [deleteApplication, { isLoading: isDeletingApplication }] = useDeleteApplicationMutation();

  const applications = applicationsData?.data || [];


  // Group applications by status
  const groupedApplications = applications.reduce((acc, app) => {
    const status = app.status || 'pending';
    if (!acc[status]) acc[status] = [];
    acc[status].push(app);
    return acc;
  }, {} as Record<string, Application[]>);

  const stats = [
    {
      title: 'Candidatures Totales',
      value: applications.length,
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      title: 'En Attente',
      value: groupedApplications.pending?.length || 0,
      icon: Clock,
      color: 'text-yellow-600'
    },
    {
      title: 'Acceptées',
      value: groupedApplications.approved?.length || 0,
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      title: 'Rejetées',
      value: groupedApplications.rejected?.length || 0,
      icon: XCircle,
      color: 'text-red-600'
    }
  ];

  const handleDeleteApplication = async (applicationId: number) => {
    try {
      await deleteApplication(applicationId).unwrap();
      toast.success('Candidature supprimée avec succès');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Erreur lors de la suppression');
    }
  };

  if (isLoadingApplications) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Chargement de votre dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (applicationsError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Erreur lors du chargement de vos candidatures. Veuillez réessayer plus tard.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Bienvenue, {user?.name || 'Étudiant'}! Gérez vos candidatures et suivez votre progression.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <IconComponent className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Actions Rapides
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button asChild>
              <Link to="/schools">
                <School className="h-4 w-4 mr-2" />
                Explorer les Écoles
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/schools">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Candidature
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Mes Candidatures</CardTitle>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Aucune candidature</h3>
              <p className="text-muted-foreground mb-6">
                Vous n'avez encore soumis aucune candidature. Commencez par explorer nos écoles partenaires.
              </p>
              <Button asChild>
                <Link to="/schools">
                  <School className="h-4 w-4 mr-2" />
                  Découvrir les Écoles
                </Link>
              </Button>
            </div>
          ) : (
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">
                  Toutes ({applications.length})
                </TabsTrigger>
                <TabsTrigger value="pending">
                  En Attente ({groupedApplications.pending?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="approved">
                  Acceptées ({groupedApplications.approved?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="rejected">
                  Rejetées ({groupedApplications.rejected?.length || 0})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4 mt-6">
                {applications.map((application) => (
                  <AlertDialog key={application.id}>
                    <ApplicationCard 
                      application={application}
                      // onDelete={(id) => {
                      //   // This will be handled by the AlertDialog
                      //  sss
                      // }}
                    />
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                        <AlertDialogDescription>
                          Êtes-vous sûr de vouloir supprimer cette candidature ? Cette action est irréversible.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteApplication(application.id)}
                          disabled={isDeletingApplication}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {isDeletingApplication ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Suppression...
                            </>
                          ) : (
                            'Supprimer'
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ))}
              </TabsContent>

              {['pending', 'approved', 'rejected'].map((status) => (
                <TabsContent key={status} value={status} className="space-y-4 mt-6">
                  {groupedApplications[status]?.length > 0 ? (
                    groupedApplications[status].map((application) => (
                      <ApplicationCard 
                        key={application.id}
                        application={application}
                        onDelete={status === 'pending' ? handleDeleteApplication : undefined}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        Aucune candidature avec ce statut.
                      </p>
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}