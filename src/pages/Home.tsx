import { Link } from 'react-router-dom';
import { ArrowRight, Search, GraduationCap, Users, Award, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetSchoolsQuery } from '../store/api/apiSlice';

export function Home() {
  const { data: schoolsData } = useGetSchoolsQuery();
  const schools = schoolsData?.data || [];

  const stats = [
    {
      icon: GraduationCap,
      title: 'Écoles Partenaires',
      value: schools.length.toString(),
      description: 'Établissements de qualité'
    },
    {
      icon: Users,
      title: 'Étudiants Inscrits',
      value: '2,500+',
      description: 'Étudiants accompagnés'
    },
    {
      icon: Award,
      title: 'Diplômes Proposés',
      value: schools.reduce((acc, school) => acc + (school.diplomas?.length || 0), 0).toString(),
      description: 'Formations disponibles'
    },
    {
      icon: TrendingUp,
      title: 'Taux de Réussite',
      value: '94%',
      description: 'Inscriptions confirmées'
    }
  ];

  const features = [
    {
      icon: Search,
      title: 'Recherche Avancée',
      description: 'Trouvez l\'école parfaite grâce à nos filtres intelligents par ville, filière, prix et accréditations.'
    },
    {
      icon: GraduationCap,
      title: 'Écoles Vérifiées',
      description: 'Toutes nos écoles partenaires sont soigneusement sélectionnées et leurs informations régulièrement mises à jour.'
    },
    {
      icon: Users,
      title: 'Accompagnement Personnel',
      description: 'Notre équipe vous guide dans toutes vos démarches, de la recherche à l\'inscription finale.'
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center bg-linear-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Trouvez l'École de Vos Rêves
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            EduConnect vous connecte aux meilleures institutions éducatives. 
            Découvrez, comparez et postulez en quelques clics pour construire votre avenir.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-lg px-8 py-6">
              <Link to="/schools">
                Découvrir les Écoles
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6">
              <Link to="/register">
                Créer un Compte
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 border-b">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center space-y-3">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-bold">{stat.value}</div>
                    <div className="text-sm font-medium">{stat.title}</div>
                    <div className="text-xs text-muted-foreground">{stat.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pourquoi Choisir EduConnect ?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Une plateforme complète conçue pour simplifier votre recherche d'établissement 
              et maximiser vos chances d'admission.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="text-center h-full hover:shadow-lg transition-all duration-200">
                  <CardHeader>
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-linear-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à Commencer Votre Parcours ?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Rejoignez des milliers d'étudiants qui ont trouvé leur voie grâce à EduConnect. 
            Votre future école vous attend.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-lg px-8 py-6">
              <Link to="/register">
                S'inscrire Gratuitement
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6">
              <Link to="/schools">
                Explorer les Écoles
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}