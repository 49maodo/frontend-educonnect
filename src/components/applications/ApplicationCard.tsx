import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Clock, CircleCheck as CheckCircle, Circle as XCircle, FileText, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import type { Application } from '../../types/api';

interface ApplicationCardProps {
  application: Application;
  onDelete?: (id: number) => void;
}

const statusConfig = {
  pending: {
    label: 'En attente',
    icon: Clock,
    variant: 'secondary' as const,
    color: 'text-yellow-600',
  },
  approved: {
    label: 'Acceptée',
    icon: CheckCircle,
    variant: 'default' as const,
    color: 'text-green-600',
  },
  rejected: {
    label: 'Rejetée',
    icon: XCircle,
    variant: 'destructive' as const,
    color: 'text-red-600',
  },
};

export function ApplicationCard({ application, onDelete }: ApplicationCardProps) {
  const status = application.status || 'pending';
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
    } catch {
      return 'Date invalide';
    }
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg leading-tight">
              {application.diploma.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {application.diploma.school?.name}
            </p>
          </div>
          <Badge variant={config.variant} className="shrink-0">
            <StatusIcon className="w-3 h-3 mr-1" />
            {config.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Diploma details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Niveau:</span>
            <p className="font-medium">{application.diploma.level}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Filière:</span>
            <p className="font-medium">{application.diploma.field}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Durée:</span>
            <p className="font-medium">{application.diploma.duration} ans</p>
          </div>
          <div>
            <span className="text-muted-foreground">Prix:</span>
            <p className="font-medium">{parseFloat(application.diploma.price).toLocaleString()}€</p>
          </div>
        </div>

        <Separator />

        {/* Application dates */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Candidature:</span>
            <p className="font-medium">{formatDate(application.created_at)}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Rentrée:</span>
            <p className="font-medium">{formatDate(application.diploma.start_date)}</p>
          </div>
        </div>

        {/* Student notes */}
        {application.student_notes && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Vos notes</span>
            </div>
            <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
              {application.student_notes}
            </p>
          </div>
        )}

        {/* Admin notes */}
        {application.admin_notes && (
          <Alert>
            <AlertDescription>
              <strong>Note de l'administration:</strong> {application.admin_notes}
            </AlertDescription>
          </Alert>
        )}

        {/* Actions */}
        <div className="flex justify-end pt-2">
          {status === 'pending' && onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(application.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Annuler
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}