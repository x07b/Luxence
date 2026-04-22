import { useState, useEffect } from "react";
import { ProductCard } from "./ProductCard";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  slug: string;
}

export function FeaturedProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        // Limit to first 6 products for featured section
        setProducts(data.slice(0, 6));
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Don't show section if no products
  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-white via-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div
          className="text-center mb-10 md:mb-12 space-y-3 animate-fade-in opacity-0"
          style={{ animation: "fade-in 0.6s ease-out forwards" }}
        >
          <p className="text-accent font-roboto text-xs md:text-sm font-semibold uppercase tracking-widest">
            Notre Collection
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-futura font-bold text-foreground mb-3 leading-tight">
            Nos luminaires emblématiques
          </h2>
          <p className="text-base md:text-lg text-muted-foreground font-roboto max-w-2xl mx-auto leading-relaxed">
            Découvrez nos luminaires les plus prisés
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <p className="text-muted-foreground font-roboto">Chargement...</p>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-full max-w-4xl">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product, index) => (
                  <div
                    key={product.id}
                    className="animate-fade-in opacity-0"
                    style={{
                      animation: `fade-in 0.6s ease-out forwards`,
                      animationDelay: `${index * 150}ms`,
                    }}
                  >
                    <ProductCard
                      {...product}
                      image={product.images[0]}
                      images={product.images}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CTA Button */}
        {!loading && products.length > 0 && (
          <div
            className="flex justify-center mt-10 animate-fade-in opacity-0"
            style={{
              animation: `fade-in 0.6s ease-out forwards`,
              animationDelay: `${products.length * 150 + 200}ms`,
            }}
          >
            <a
              href="/products"
              className="inline-flex items-center justify-center px-6 py-3 bg-foreground text-white font-futura font-bold rounded-lg hover:bg-foreground/90 transition-all duration-300 hover:shadow-lg active:scale-95 group text-sm md:text-base"
            >
              Voir tous nos produits
              <svg
                className="w-4 h-4 md:w-5 md:h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
