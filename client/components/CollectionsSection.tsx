import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const collections = [
  {
    name: "Minimal moderne",
    description: "Lignes épurées et formes géométriques",
    image:
      "https://images.unsplash.com/photo-1578500494198-246f612d782f?w=400&q=80",
    color: "bg-gradient-to-br from-primary to-primary/80",
  },
  {
    name: "Signature artistique",
    description: "Pièces uniques et sculptées",
    image:
      "https://images.unsplash.com/photo-1565636192335-14e9b763bd21?w=400&q=80",
    color: "bg-gradient-to-br from-accent to-orange-400",
  },
  {
    name: "Ambiance chaleureuse",
    description: "Teintes dorées et matières naturelles",
    image:
      "https://images.unsplash.com/photo-1584622614875-2f38dd7aaf60?w=400&q=80",
    color: "bg-gradient-to-br from-orange-300 to-orange-500",
  },
  {
    name: "Design architectural",
    description: "Intégration structurelle et minimaliste",
    image:
      "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&q=80",
    color: "bg-gradient-to-br from-gray-700 to-gray-900",
  },
];

export function CollectionsSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-futura font-bold text-primary mb-4">
            Collections
          </h2>
          <p className="text-lg text-muted-foreground font-roboto max-w-2xl mx-auto">
            Explorez nos collections thématiques curatées avec soin
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {collections.map((collection, index) => (
            <Link
              key={index}
              to="/collections"
              className="group relative overflow-hidden rounded-lg aspect-video"
            >
              <img
                src={collection.image}
                alt={collection.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div
                className={`absolute inset-0 ${collection.color} opacity-60 group-hover:opacity-50 transition-opacity`}
              />

              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                <h3 className="text-2xl md:text-3xl font-futura font-bold text-white mb-2">
                  {collection.name}
                </h3>
                <p className="text-white/90 font-roboto text-sm mb-4">
                  {collection.description}
                </p>
                <div className="flex items-center gap-2 text-white font-roboto text-sm group-hover:gap-3 transition-all w-fit">
                  Découvrir
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
