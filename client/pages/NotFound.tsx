import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-futura font-bold text-accent mb-4">
            404
          </h1>
          <p className="text-2xl md:text-3xl font-futura text-primary mb-4">
            Page non trouvée
          </p>
          <p className="text-lg text-muted-foreground font-roboto mb-8">
            Désolé, la page que vous recherchez n'existe pas ou a été supprimée.
          </p>

          <Link
            to="/"
            className="inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg font-futura font-bold transition-all duration-300 hover:gap-4 group"
          >
            Retour à l'accueil
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
