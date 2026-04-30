import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  images?: string[];
  price?: number;
}

interface RecommendedProductsSectionProps {
  productId: string;
}

export function RecommendedProductsSection({
  productId,
}: RecommendedProductsSectionProps) {
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/products/${productId}/recommendations`,
        );
        if (response.ok) {
          const data = await response.json();
          setRecommendedProducts(data);
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      fetchRecommendations();
    }
  }, [productId]);

  // Don't render if no recommendations or still loading
  if (isLoading) {
    return null;
  }

  if (recommendedProducts.length === 0) {
    return null;
  }

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
          {recommendedProducts.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.slug}`}
              className="rounded-lg border border-border overflow-hidden hover:shadow-lg hover:border-accent/50 transition-all duration-300 group bg-white"
            >
              {/* Product Image */}
              {product.images && product.images.length > 0 ? (
                <div className="w-full h-48 bg-gray-100 overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-accent/5 to-accent/10 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-accent/50 font-roboto text-sm">
                      Image du produit
                    </p>
                  </div>
                </div>
              )}

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
