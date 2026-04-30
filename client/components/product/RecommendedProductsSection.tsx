import React from "react";
import { Link } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
}

interface RecommendedProductsSectionProps {
  currentProduct: Product;
  category: string;
}

export function RecommendedProductsSection({
  currentProduct,
  category,
}: RecommendedProductsSectionProps) {
  // Placeholder products - these would come from a database query filtering by category
  const placeholderProducts = [
    {
      id: "1",
      name: "Produit Recommandé 1",
      slug: "produit-recommande-1",
      category: category,
      description: "Découvrez ce produit complémentaire de la même catégorie",
    },
    {
      id: "2",
      name: "Produit Recommandé 2",
      slug: "produit-recommande-2",
      category: category,
      description: "Un excellent choix pour compléter votre solution",
    },
    {
      id: "3",
      name: "Produit Recommandé 3",
      slug: "produit-recommande-3",
      category: category,
      description: "Autre option populaire dans la même collection",
    },
  ];

  return (
    <section className="mb-16 sm:mb-20">
      <div className="space-y-6">
        <div>
          <h2 className="font-futura text-3xl font-bold text-foreground mb-2">
            Produits recommandés
          </h2>
          <div className="h-1 w-20 bg-accent rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {placeholderProducts.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.slug}`}
              className="rounded-lg border border-border overflow-hidden hover:shadow-lg hover:border-accent/50 transition-all duration-300 group bg-white"
            >
              {/* Placeholder Image */}
              <div className="w-full h-48 bg-gradient-to-br from-accent/5 to-accent/10 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-accent/50 font-roboto text-sm">
                    Image du produit
                  </p>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6 space-y-3">
                <h3 className="font-futura text-lg font-bold text-foreground group-hover:text-accent transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground font-roboto line-clamp-2">
                  {product.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
