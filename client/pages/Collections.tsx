import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ProductCard } from "../components/ProductCard";

interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
  category: string;
  slug: string;
  collectionId: string;
}

export default function Collections() {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [collectionsRes, productsRes] = await Promise.all([
          fetch("/api/collections"),
          fetch("/api/products"),
        ]);

        const collectionsData = await collectionsRes.json();
        const productsData = await productsRes.json();

        setCollections(collectionsData);

        // If slug is provided, select that collection
        if (slug) {
          const collection = collectionsData.find(
            (c: Collection) => c.slug === slug,
          );
          setSelectedCollection(collection);
          // Filter products for this collection
          const collectionProducts = productsData.filter(
            (p: Product) => p.collectionId === collection?.id,
          );
          setProducts(collectionProducts);
        } else {
          // Show all products if no specific collection
          setProducts(productsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-lg text-muted-foreground font-roboto">
          Chargement des collections...
        </p>
      </div>
    );
  }

  // View all collections
  if (!slug) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-white to-gray-50">
        <div className="container mx-auto px-4 py-16 md:py-24">
          {/* Header */}
          <div className="mb-16 md:mb-20 space-y-6 animate-fade-in">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-foreground hover:text-accent transition-all duration-300 font-roboto font-semibold group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              Retour à l'accueil
            </Link>

            <div className="space-y-4">
              <p className="text-accent font-roboto text-sm font-semibold uppercase tracking-widest">
                Nos Collections
              </p>
              <h1 className="text-5xl md:text-6xl font-futura font-bold text-foreground leading-tight">
                Collections
              </h1>
              <p className="text-xl text-muted-foreground font-roboto max-w-2xl leading-relaxed">
                Explorez nos collections curatées avec soin
              </p>
            </div>
          </div>

          {/* Collections Grid */}
          {collections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {collections.map((collection, index) => (
                <Link
                  key={collection.id}
                  to={`/collections/${collection.slug}`}
                  className="group rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 bg-white animate-fade-in"
                  style={{
                    animation: `fade-in 0.6s ease-out forwards`,
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div className="relative overflow-hidden h-64">
                    {/* Collection Image Background */}
                    {collection.image ? (
                      <img
                        src={collection.image}
                        alt={collection.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
                    )}

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />

                    {/* Collection Name Overlay */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                      <h3 className="text-2xl md:text-3xl font-futura font-bold text-white mb-2 drop-shadow-lg group-hover:text-accent transition-colors duration-300">
                        {collection.name}
                      </h3>
                      <p className="text-white/90 font-roboto text-sm drop-shadow-md">
                        {
                          products.filter(
                            (p) => p.collectionId === collection.id,
                          ).length
                        }{" "}
                        produit
                        {products.filter(
                          (p) => p.collectionId === collection.id,
                        ).length !== 1
                          ? "s"
                          : ""}
                      </p>
                    </div>

                    {/* Hover Effect Overlay */}
                    <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground font-roboto">
                Aucune collection disponible pour le moment
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // View specific collection
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-gray-50">
      <div className="container mx-auto px-4 py-16 md:py-24">
        {/* Header */}
        <div className="mb-16 md:mb-20 space-y-6 animate-fade-in">
          <Link
            to="/collections"
            className="inline-flex items-center gap-2 text-foreground hover:text-accent transition-all duration-300 font-roboto font-semibold group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            Retour aux collections
          </Link>

          <div className="space-y-4">
            <p className="text-accent font-roboto text-sm font-semibold uppercase tracking-widest">
              Collection
            </p>
            <h1 className="text-5xl md:text-6xl font-futura font-bold text-foreground leading-tight">
              {selectedCollection?.name}
            </h1>
            <p className="text-xl text-muted-foreground font-roboto max-w-2xl leading-relaxed">
              {selectedCollection?.description}
            </p>
          </div>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-16">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in opacity-0"
                style={{
                  animation: `fade-in 0.6s ease-out forwards`,
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <ProductCard {...product} images={product.images} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground font-roboto mb-6">
              Aucun produit dans cette collection pour le moment
            </p>
            <Link
              to="/collections"
              className="inline-flex items-center justify-center px-8 py-4 bg-accent text-white font-futura font-bold rounded-lg hover:bg-accent/90 transition-all duration-300 hover:shadow-lg active:scale-95"
            >
              Voir toutes les collections
            </Link>
          </div>
        )}

        {/* Other Collections */}
        {collections.length > 1 && (
          <div className="mt-20 pt-16 border-t border-border">
            <div className="text-center space-y-8 animate-fade-in">
              <h3 className="text-3xl md:text-4xl font-futura font-bold text-foreground">
                Autres Collections
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {collections
                  .filter((c) => c.slug !== slug)
                  .map((collection, index) => (
                    <Link
                      key={collection.id}
                      to={`/collections/${collection.slug}`}
                      className="group rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all p-6 bg-white border border-border hover:border-accent"
                      style={{
                        animation: `fade-in 0.6s ease-out forwards`,
                        animationDelay: `${index * 100}ms`,
                      }}
                    >
                      <h4 className="text-xl font-futura font-bold text-foreground group-hover:text-accent transition-colors">
                        {collection.name}
                      </h4>
                      <p className="text-sm text-muted-foreground font-roboto mt-2">
                        {
                          products.filter(
                            (p) => p.collectionId === collection.id,
                          ).length
                        }{" "}
                        produit
                        {products.filter(
                          (p) => p.collectionId === collection.id,
                        ).length !== 1
                          ? "s"
                          : ""}
                      </p>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
