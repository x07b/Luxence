import { Link } from "react-router-dom";

interface CTASectionProps {
  productName: string;
  mainText?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
}

export function CTASection({
  productName,
  mainText = "Prêt à illuminer vos espaces avec style ?",
  description,
  primaryButtonText = "Nous contacter",
  primaryButtonLink = "/contact",
  secondaryButtonText = "Voir d'autres produits",
  secondaryButtonLink = "/products",
}: CTASectionProps) {
  return (
    <section className="cta-section py-20 md:py-28 px-4 bg-gradient-to-r from-foreground to-foreground/95">
      <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
        <h2 className="font-futura text-4xl md:text-5xl font-bold text-white leading-tight">
          {mainText}
        </h2>
        {description ? (
          <p className="font-roboto text-lg text-white/85 leading-relaxed">
            {description}
          </p>
        ) : (
          <p className="font-roboto text-lg text-white/85 leading-relaxed">
            Découvrez la performance et l'élégance du {productName}. Notre
            équipe d'experts est prête à vous conseiller.
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            to={primaryButtonLink}
            className="inline-flex items-center justify-center px-8 py-4 bg-accent hover:bg-accent/90 text-white font-roboto font-bold rounded-lg transition-all duration-300 hover:shadow-lg active:scale-95 group"
          >
            {primaryButtonText}
            <svg
              className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300"
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
          </Link>
          <Link
            to={secondaryButtonLink}
            className="inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-roboto font-bold rounded-lg border-2 border-white/30 transition-all duration-300 group"
          >
            {secondaryButtonText}
          </Link>
        </div>
      </div>
    </section>
  );
}
