import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductHeroPanel } from "@/components/product/ProductHeroPanel";
import { ProductDetailsPanel } from "@/components/product/ProductDetailsPanel";
import { ScrollToTop } from "@/components/ScrollToTop";

interface Specification {
  label: string;
  value: string;
}

interface DetailSection {
  title: string;
  content: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
  category: string;
  slug: string;
  price: number;
  specifications: Specification[];
  pdfFile?: string;
  pdfFilename?: string;
}

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [detailSections, setDetailSections] = useState<DetailSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${slug}`);
        
        if (response.ok) {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            setProduct(data);

            // Fetch detail sections
            try {
              const detailResponse = await fetch(
                `/api/products/${data.id}/details`,
              );
              if (detailResponse.ok) {
                const detailContentType = detailResponse.headers.get("content-type");
                if (detailContentType && detailContentType.includes("application/json")) {
                  const details = await detailResponse.json();
                  setDetailSections(details);
                }
              }
            } catch (detailError) {
              console.error("Error fetching product details:", detailError);
            }
          } else {
            console.error("Invalid content type:", contentType);
            setProduct(null);
            setDetailSections([]);
          }
        } else {
          // Handle non-200 responses
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            console.error("Error fetching product:", errorData);
          }
          setProduct(null);
          setDetailSections([]);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
        setDetailSections([]);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-white to-gray-50">
        <div className="text-center">
          <p className="font-roboto text-lg text-muted-foreground animate-pulse">
            Chargement du produit...
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-white to-gray-50">
        <div className="text-center space-y-6 max-w-md">
          <h1 className="font-futura text-4xl font-bold text-foreground">
            Produit non trouvé
          </h1>
          <p className="font-roboto text-muted-foreground">
            Le produit que vous recherchez n'existe pas.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-roboto font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour aux produits
          </Link>
        </div>
      </div>
    );
  }

  // Separate benefit and application sections from other details
  const benefitsSection = detailSections.find(
    (s) =>
      s.title.toLowerCase().includes("pourquoi") ||
      s.title.toLowerCase().includes("benefit") ||
      s.title.toLowerCase().includes("avantage"),
  );

  const applicationsSection = detailSections.find(
    (s) =>
      s.title.toLowerCase().includes("application") ||
      s.title.toLowerCase().includes("use case") ||
      s.title.toLowerCase().includes("cas d"),
  );

  const otherSections =
    detailSections.length > 0
      ? detailSections.filter(
          (s) =>
            !s.title.toLowerCase().includes("pourquoi") &&
            !s.title.toLowerCase().includes("benefit") &&
            !s.title.toLowerCase().includes("avantage") &&
            !s.title.toLowerCase().includes("application") &&
            !s.title.toLowerCase().includes("use case") &&
            !s.title.toLowerCase().includes("cas d"),
        )
      : [
          {
            title: "Description du produit",
            content: product?.description || "",
          },
        ];

  const displaySections = otherSections;

  return (
    <div className="min-h-screen bg-white">
      <ScrollToTop />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
        {/* Two-Column Section: Gallery + Details Left, Sticky Panel Right */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16 sm:mb-20">
          {/* Left: Product Gallery + Details Accordion */}
          <div className="space-y-8">
            <ProductGallery
              images={product.images}
              productName={product.name}
            />
            <ProductDetailsPanel
              sections={displaySections}
              sectionTitle="Détails du produit"
              sectionSubtitle="Informations complètes"
            />
          </div>

          {/* Right: Sticky Product Info Panel */}
          <div>
            <ProductHeroPanel
              id={product.id}
              category={product.category}
              name={product.name}
              description={product.description}
              price={product.price}
              slug={product.slug}
            />
          </div>
        </section>

        {/* Specifications Section */}
        {product.specifications && product.specifications.length > 0 && (
          <section className="mb-16 sm:mb-20">
            <div className="space-y-6">
              <div>
                <h2 className="font-futura text-3xl font-bold text-foreground mb-2">
                  Spécifications techniques
                </h2>
                <div className="h-1 w-20 bg-accent rounded-full" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {product.specifications.map((spec, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-6 border border-border"
                  >
                    <p className="font-roboto text-sm uppercase tracking-widest text-accent font-bold mb-2">
                      {spec.label}
                    </p>
                    <p className="font-futura text-2xl font-bold text-foreground">
                      {spec.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Benefits Section */}
        {benefitsSection ? (
          <section className="mb-16 sm:mb-20 bg-gradient-to-br from-accent/5 to-accent/10 rounded-lg p-8 sm:p-12">
            <div className="space-y-8">
              <div>
                <h2 className="font-futura text-3xl font-bold text-foreground mb-2">
                  {benefitsSection.title}
                </h2>
                <div className="h-1 w-20 bg-accent rounded-full" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {benefitsSection.content
                  .split("\n\n")
                  .filter((item: string) => item.trim())
                  .map((item: string, index: number) => {
                    const [title, ...descLines] = item.split("\n");
                    return (
                      <div key={index}>
                        <h3 className="font-futura text-xl font-bold text-foreground mb-3">
                          {title}
                        </h3>
                        <p className="font-roboto text-muted-foreground leading-relaxed">
                          {descLines.join(" ")}
                        </p>
                      </div>
                    );
                  })}
              </div>
            </div>
          </section>
        ) : (
          <section className="mb-16 sm:mb-20 bg-gradient-to-br from-accent/5 to-accent/10 rounded-lg p-8 sm:p-12">
            <div className="space-y-8">
              <div>
                <h2 className="font-futura text-3xl font-bold text-foreground mb-2">
                  Pourquoi choisir ce produit ?
                </h2>
                <div className="h-1 w-20 bg-accent rounded-full" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-futura text-xl font-bold text-foreground mb-3">
                    Performance garantie
                  </h3>
                  <p className="font-roboto text-muted-foreground leading-relaxed">
                    Nous garantissons la performance constante de ce luminaire
                    avec une couverture complète et un support technique
                    réactif. Votre investissement est protégé.
                  </p>
                </div>
                <div>
                  <h3 className="font-futura text-xl font-bold text-foreground mb-3">
                    Solution économique
                  </h3>
                  <p className="font-roboto text-muted-foreground leading-relaxed">
                    Réduisez vos coûts énergétiques tout en profitant d'une
                    qualité d'éclairage supérieure. Amortissement rapide et
                    rentabilité garantie.
                  </p>
                </div>
                <div>
                  <h3 className="font-futura text-xl font-bold text-foreground mb-3">
                    Respect de l'environnement
                  </h3>
                  <p className="font-roboto text-muted-foreground leading-relaxed">
                    Solution écologique et durable, recyclable et certifiée.
                    Contribuez à la préservation de l'environnement sans
                    compromis.
                  </p>
                </div>
                <div>
                  <h3 className="font-futura text-xl font-bold text-foreground mb-3">
                    Support expert
                  </h3>
                  <p className="font-roboto text-muted-foreground leading-relaxed">
                    Équipe d'experts disponible pour assistance, conseil et
                    maintenance. Satisfaction client garantie à 100%.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Applications Section */}
        {applicationsSection ? (
          <section className="mb-16 sm:mb-20">
            <div className="space-y-6">
              <div>
                <h2 className="font-futura text-3xl font-bold text-foreground mb-2">
                  {applicationsSection.title}
                </h2>
                <div className="h-1 w-20 bg-accent rounded-full" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {applicationsSection.content
                  .split("\n\n")
                  .filter((item: string) => item.trim())
                  .map((item: string, index: number) => {
                    const [title, ...descLines] = item.split("\n");
                    return (
                      <div
                        key={index}
                        className="rounded-lg border border-border p-6 hover:shadow-lg hover:border-accent/50 transition-all duration-300"
                      >
                        <h3 className="font-futura text-xl font-bold text-foreground mb-3">
                          {title}
                        </h3>
                        <p className="font-roboto text-muted-foreground">
                          {descLines.join(" ")}
                        </p>
                      </div>
                    );
                  })}
              </div>
            </div>
          </section>
        ) : (
          <section className="mb-16 sm:mb-20">
            <div className="space-y-6">
              <div>
                <h2 className="font-futura text-3xl font-bold text-foreground mb-2">
                  Cas d'application
                </h2>
                <div className="h-1 w-20 bg-accent rounded-full" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="rounded-lg border border-border p-6 hover:shadow-lg hover:border-accent/50 transition-all duration-300">
                  <h3 className="font-futura text-xl font-bold text-foreground mb-3">
                    Espaces professionnels
                  </h3>
                  <p className="font-roboto text-muted-foreground">
                    Bureau, open space, salles de réunion. Créez un
                    environnement productif et confortable pour vos équipes.
                  </p>
                </div>
                <div className="rounded-lg border border-border p-6 hover:shadow-lg hover:border-accent/50 transition-all duration-300">
                  <h3 className="font-futura text-xl font-bold text-foreground mb-3">
                    Espaces résidentiels
                  </h3>
                  <p className="font-roboto text-muted-foreground">
                    Salon, cuisine, chambre. Transformez votre habitat avec un
                    éclairage adapté à votre style de vie.
                  </p>
                </div>
                <div className="rounded-lg border border-border p-6 hover:shadow-lg hover:border-accent/50 transition-all duration-300">
                  <h3 className="font-futura text-xl font-bold text-foreground mb-3">
                    Environnements commerciaux
                  </h3>
                  <p className="font-roboto text-muted-foreground">
                    Boutique, galerie, showroom. Mettez en valeur vos produits
                    avec un éclairage professionnel et élégant.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-accent to-accent/80 rounded-lg p-8 sm:p-12 text-center text-white space-y-6">
          <h2 className="font-futura text-3xl sm:text-4xl font-bold">
            Prêt à transformer votre éclairage ?
          </h2>
          <p className="font-roboto text-lg max-w-2xl mx-auto text-white/90">
            Contactez-nous dès maintenant pour obtenir un devis personnalisé ou
            télécharger la fiche technique complète.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <button className="bg-white hover:bg-white/90 text-accent font-roboto font-bold py-3 px-8 rounded-lg transition-all duration-300 hover:shadow-lg active:scale-95">
              Demander un devis
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-accent font-roboto font-bold py-3 px-8 rounded-lg transition-all duration-300 hover:shadow-lg active:scale-95">
              Documentation
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
