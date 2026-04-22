import { useState, useEffect } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  slug: string;
}

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  // Load all products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        setAllProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Handle search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    const query = searchQuery.toLowerCase();

    // Filter products based on search query
    const filtered = allProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query),
    );

    // Simulate network delay for better UX
    setTimeout(() => {
      setResults(filtered);
      setLoading(false);
    }, 300);
  }, [searchQuery, allProducts]);

  const handleProductClick = (slug: string) => {
    navigate(`/product/${slug}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 md:pt-32 px-4 bg-black/50 backdrop-blur-sm">
      {/* Overlay container */}
      <div className="w-full max-w-2xl max-h-[70vh] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
        {/* Search Header */}
        <div className="flex items-center gap-3 border-b border-border p-4 md:p-6">
          <Search className="w-5 h-5 text-accent flex-shrink-0" />
          <input
            type="text"
            placeholder="Rechercher des produits..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            className="flex-1 text-lg font-roboto bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
          />
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-lg transition-colors flex-shrink-0"
            title="Fermer la recherche"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center h-full gap-2 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Recherche en cours...</span>
            </div>
          )}

          {!loading && searchQuery && results.length === 0 && (
            <div className="flex items-center justify-center h-full p-8 text-center">
              <div>
                <p className="text-lg font-semibold text-foreground mb-2">
                  Aucun produit trouvé
                </p>
                <p className="text-sm text-muted-foreground">
                  Essayez avec d'autres mots-clés
                </p>
              </div>
            </div>
          )}

          {!loading && !searchQuery && (
            <div className="flex items-center justify-center h-full p-8 text-center">
              <div>
                <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-lg font-semibold text-foreground mb-2">
                  Rechercher des produits
                </p>
                <p className="text-sm text-muted-foreground">
                  Entrez un terme de recherche pour voir les résultats
                </p>
              </div>
            </div>
          )}

          {!loading && searchQuery && results.length > 0 && (
            <div className="p-4 md:p-6 space-y-3">
              <p className="text-xs text-muted-foreground font-semibold">
                {results.length} résultat{results.length > 1 ? "s" : ""}
              </p>

              {results.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleProductClick(product.slug)}
                  className="w-full flex items-start gap-4 p-4 rounded-lg border border-border hover:border-accent hover:bg-secondary transition-all text-left"
                >
                  {/* Product Image */}
                  {product.images.length > 0 && (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                  )}

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-sm md:text-base line-clamp-1 hover:text-accent">
                      {product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs bg-secondary text-muted-foreground px-2 py-1 rounded">
                        {product.category}
                      </span>
                      <span className="font-futura font-bold text-accent">
                        {product.price.toFixed(2)} TND
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="border-t border-border bg-secondary/50 px-4 md:px-6 py-3 text-xs text-muted-foreground text-center">
          Appuyez sur{" "}
          <kbd className="px-2 py-1 bg-white border border-border rounded">
            Esc
          </kbd>{" "}
          pour fermer
        </div>
      </div>
    </div>
  );
}
