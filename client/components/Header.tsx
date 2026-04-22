import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  Home,
  Package,
  Folder,
  Info,
  Mail,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { SearchOverlay } from "./SearchOverlay";

interface Collection {
  id: string;
  name: string;
  slug: string;
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isCollectionsDropdownOpen, setIsCollectionsDropdownOpen] =
    useState(false);
  const [isMobileCollectionsOpen, setIsMobileCollectionsOpen] = useState(false);
  const { itemCount } = useCart();
  const navigate = useNavigate();

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      // Esc to close search
      if (e.key === "Escape" && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen]);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch("/api/collections");
        const data = await response.json();
        setCollections(data);
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    };

    fetchCollections();
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-md transition-shadow duration-300 hover:shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center h-12 hover:opacity-80 transition-opacity duration-300"
          >
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F4bd5a48984ac41abb50f4c9c327d1d89%2F8809a042284e4ef7a6e668ae9ec8758f?format=webp&width=800"
              alt="Luxence Logo"
              className="h-full object-contain"
            />
          </Link>

          {/* Desktop Navigation - Icon Based */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Home */}
            <Link
              to="/"
              className="flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-300 group hover:bg-secondary/50"
              title="Accueil"
            >
              <Home className="w-5 h-5 text-foreground group-hover:text-accent transition-colors duration-300" />
              <span className="text-xs text-foreground font-roboto mt-1 whitespace-nowrap font-medium">
                Accueil
              </span>
            </Link>

            {/* Products */}
            <Link
              to="/products"
              className="flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-300 group hover:bg-secondary/50"
              title="Produits"
            >
              <Package className="w-5 h-5 text-foreground group-hover:text-accent transition-colors duration-300" />
              <span className="text-xs text-foreground font-roboto mt-1 whitespace-nowrap font-medium">
                Produits
              </span>
            </Link>

            {/* Collections Dropdown */}
            <div className="relative group">
              <button
                className="flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-300 group hover:bg-secondary/50"
                title="Collections"
              >
                <Folder className="w-5 h-5 text-foreground group-hover:text-accent transition-colors duration-300" />
                <span className="text-xs text-foreground font-roboto mt-1 whitespace-nowrap font-medium">
                  Collections
                </span>
              </button>

              {/* Dropdown Menu */}
              {collections.length > 0 && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-48 bg-white border border-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 pt-2">
                  {collections.map((collection) => (
                    <Link
                      key={collection.id}
                      to={`/collections/${collection.slug}`}
                      className="block px-4 py-3 text-sm font-roboto text-foreground hover:bg-secondary hover:text-accent transition-colors duration-300 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {collection.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* About */}
            <Link
              to="/about"
              className="flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-300 group hover:bg-secondary/50"
              title="À propos"
            >
              <Info className="w-5 h-5 text-foreground group-hover:text-accent transition-colors duration-300" />
              <span className="text-xs text-foreground font-roboto mt-1 whitespace-nowrap font-medium">
                À propos
              </span>
            </Link>

            {/* Contact */}
            <Link
              to="/contact"
              className="flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-300 group hover:bg-secondary/50"
              title="Contact"
            >
              <Mail className="w-5 h-5 text-foreground group-hover:text-accent transition-colors duration-300" />
              <span className="text-xs text-foreground font-roboto mt-1 whitespace-nowrap font-medium">
                Contact
              </span>
            </Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 hover:bg-secondary rounded-lg transition-all duration-300 hover:shadow-md"
              title="Rechercher (Ctrl+K)"
            >
              <Search className="w-5 h-5 text-foreground hover:text-accent transition-colors duration-300" />
            </button>
            <button
              onClick={() => navigate("/cart")}
              className="p-2 hover:bg-secondary rounded-lg transition-all duration-300 hover:shadow-md relative group"
              title="Voir le panier"
            >
              <ShoppingCart className="w-5 h-5 text-foreground group-hover:text-accent transition-colors duration-300" />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-accent text-white rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-secondary rounded-lg transition-all duration-300 hover:shadow-md"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-foreground" />
              ) : (
                <Menu className="w-5 h-5 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4 border-t border-border animate-slide-up">
            <Link
              to="/"
              className="block py-3 px-2 text-foreground hover:text-accent hover:bg-secondary/50 rounded-lg transition-all duration-300 font-roboto text-sm font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Accueil
            </Link>
            <Link
              to="/products"
              className="block py-3 px-2 text-foreground hover:text-accent hover:bg-secondary/50 rounded-lg transition-all duration-300 font-roboto text-sm font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Produits
            </Link>

            {/* Mobile Collections Dropdown */}
            <button
              onClick={() =>
                setIsMobileCollectionsOpen(!isMobileCollectionsOpen)
              }
              className="w-full text-left py-3 px-2 text-foreground hover:text-accent hover:bg-secondary/50 rounded-lg transition-all duration-300 font-roboto text-sm font-medium flex items-center justify-between"
            >
              Collections
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${
                  isMobileCollectionsOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isMobileCollectionsOpen && collections.length > 0 && (
              <div className="pl-4 space-y-1">
                {collections.map((collection) => (
                  <Link
                    key={collection.id}
                    to={`/collections/${collection.slug}`}
                    className="block py-2 px-2 text-foreground hover:text-accent hover:bg-secondary/50 rounded-lg transition-all duration-300 font-roboto text-sm"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsMobileCollectionsOpen(false);
                    }}
                  >
                    {collection.name}
                  </Link>
                ))}
              </div>
            )}

            <Link
              to="/about"
              className="block py-3 px-2 text-foreground hover:text-accent hover:bg-secondary/50 rounded-lg transition-all duration-300 font-roboto text-sm font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              À propos
            </Link>
            <Link
              to="/contact"
              className="block py-3 px-2 text-foreground hover:text-accent hover:bg-secondary/50 rounded-lg transition-all duration-300 font-roboto text-sm font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </nav>
        )}
      </div>

      {/* Search Overlay */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </header>
  );
}
