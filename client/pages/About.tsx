import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-futura font-bold text-primary mb-4">
            À propos de Luxence
          </h1>
          <p className="text-lg text-muted-foreground font-roboto mb-8">
            Découvrez notre histoire et nos valeurs.
          </p>

          <div className="bg-white rounded-lg border border-border p-12">
            <p className="text-muted-foreground font-roboto mb-6">
              La page "À propos" est en cours de développement. Apprenez-en
              davantage sur Luxence et notre vision dans la section À propos de
              la page d'accueil.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-futura font-bold transition-all duration-300 hover:gap-4 group"
            >
              Retour à l'accueil
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
