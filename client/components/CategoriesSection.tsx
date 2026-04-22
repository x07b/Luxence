import { CategoryCard } from "./CategoryCard";

const categories = [
  {
    name: "Suspensions",
    description: "Luminaires suspendus élégants",
    image:
      "https://images.unsplash.com/photo-1565636192335-14e9b763bd21?w=400&q=80",
    link: "/products",
  },
  {
    name: "Lampadaires",
    description: "Éclairage sur pied sophistiqué",
    image:
      "https://images.unsplash.com/photo-1584622614875-2f38dd7aaf60?w=400&q=80",
    link: "/products",
  },
  {
    name: "Lampes de table",
    description: "Design de bureau et salon",
    image:
      "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&q=80",
    link: "/products",
  },
  {
    name: "Appliques murales",
    description: "Éclairage architectural",
    image:
      "https://images.unsplash.com/photo-1578500494198-246f612d782f?w=400&q=80",
    link: "/products",
  },
];

export function CategoriesSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-futura font-bold text-primary mb-4">
            Nos catégories
          </h2>
          <p className="text-lg text-muted-foreground font-roboto max-w-2xl mx-auto">
            Explorez notre collection complète de luminaires haut de gamme
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className="animate-fade-in"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <CategoryCard {...category} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
