import { Link } from "react-router-dom";
import { Facebook, Instagram, Share2, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/98 to-primary/95 text-primary-foreground border-t border-primary-foreground/20">
      {/* Luxury background accent */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 py-20 md:py-28">
          {/* Brand */}
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center">
              <img
                src="/assets/white-logo.svg"
                alt="Luxence Logo"
                className="h-12 object-contain"
              />
            </div>
            <p className="text-sm text-primary-foreground/75 font-roboto leading-relaxed max-w-xs">
              Luminaires d'art conçus pour sublimer vos intérieurs avec design
              et excellence.
            </p>
          </div>

          {/* À propos */}
          <div
            className="space-y-4 animate-fade-in"
            style={{ animationDelay: "100ms" }}
          >
            <h4 className="font-futura font-bold text-lg">À propos</h4>
            <ul className="space-y-3 font-roboto text-sm">
              <li>
                <Link
                  to="/about"
                  className="text-primary-foreground/80 hover:text-accent transition-all duration-300 flex items-center gap-2 group"
                >
                  <span className="inline-block w-0 h-0.5 bg-accent group-hover:w-4 transition-all duration-300" />
                  Notre histoire
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-primary-foreground/80 hover:text-accent transition-all duration-300 flex items-center gap-2 group"
                >
                  <span className="inline-block w-0 h-0.5 bg-accent group-hover:w-4 transition-all duration-300" />
                  Nos valeurs
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-primary-foreground/80 hover:text-accent transition-all duration-300 flex items-center gap-2 group"
                >
                  <span className="inline-block w-0 h-0.5 bg-accent group-hover:w-4 transition-all duration-300" />
                  Design éthique
                </a>
              </li>
            </ul>
          </div>

          {/* Support Client */}
          <div
            className="space-y-4 animate-fade-in"
            style={{ animationDelay: "200ms" }}
          >
            <h4 className="font-futura font-bold text-lg">Support client</h4>
            <ul className="space-y-3 font-roboto text-sm">
              <li>
                <Link
                  to="/contact"
                  className="text-primary-foreground/80 hover:text-accent transition-all duration-300 flex items-center gap-2 group"
                >
                  <span className="inline-block w-0 h-0.5 bg-accent group-hover:w-4 transition-all duration-300" />
                  Nous contacter
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-primary-foreground/80 hover:text-accent transition-all duration-300 flex items-center gap-2 group"
                >
                  <span className="inline-block w-0 h-0.5 bg-accent group-hover:w-4 transition-all duration-300" />
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-primary-foreground/80 hover:text-accent transition-all duration-300 flex items-center gap-2 group"
                >
                  <span className="inline-block w-0 h-0.5 bg-accent group-hover:w-4 transition-all duration-300" />
                  Retours & échanges
                </a>
              </li>
            </ul>
          </div>

          {/* Catégories */}
          <div
            className="space-y-4 animate-fade-in"
            style={{ animationDelay: "300ms" }}
          >
            <h4 className="font-futura font-bold text-lg">Catégories</h4>
            <ul className="space-y-3 font-roboto text-sm">
              <li>
                <Link
                  to="/products"
                  className="text-primary-foreground/80 hover:text-accent transition-all duration-300 flex items-center gap-2 group"
                >
                  <span className="inline-block w-0 h-0.5 bg-accent group-hover:w-4 transition-all duration-300" />
                  Suspensions
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-primary-foreground/80 hover:text-accent transition-all duration-300 flex items-center gap-2 group"
                >
                  <span className="inline-block w-0 h-0.5 bg-accent group-hover:w-4 transition-all duration-300" />
                  Lampadaires
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-primary-foreground/80 hover:text-accent transition-all duration-300 flex items-center gap-2 group"
                >
                  <span className="inline-block w-0 h-0.5 bg-accent group-hover:w-4 transition-all duration-300" />
                  Lampes de table
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-primary-foreground/20 py-8 md:py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Copyright */}
            <p className="text-sm text-primary-foreground/70 font-roboto">
              © 2025 Luxence. Tous droits réservés.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="p-3 bg-primary-foreground/10 hover:bg-accent text-primary-foreground hover:text-white rounded-lg transition-all duration-300 hover:scale-110 group"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 group-hover:animate-pulse" />
              </a>
              <a
                href="#"
                className="p-3 bg-primary-foreground/10 hover:bg-accent text-primary-foreground hover:text-white rounded-lg transition-all duration-300 hover:scale-110 group"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 group-hover:animate-pulse" />
              </a>
              <a
                href="#"
                className="p-3 bg-primary-foreground/10 hover:bg-accent text-primary-foreground hover:text-white rounded-lg transition-all duration-300 hover:scale-110 group"
                aria-label="Share"
              >
                <Share2 className="w-5 h-5 group-hover:animate-pulse" />
              </a>
              <a
                href="#"
                className="p-3 bg-primary-foreground/10 hover:bg-accent text-primary-foreground hover:text-white rounded-lg transition-all duration-300 hover:scale-110 group"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5 group-hover:animate-pulse" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
