interface ProductDescriptionProps {
  title?: string;
  subtitle?: string;
  content?: string;
  bulletPoints?: string[];
}

export function ProductDescription({
  title = "Description du produit",
  subtitle = "Détails",
  content,
  bulletPoints = [],
}: ProductDescriptionProps) {
  return (
    <section className="product-description-section py-20 md:py-28 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="mb-12 md:mb-16 space-y-4 animate-fade-in">
          <p className="text-accent font-roboto text-sm font-semibold uppercase tracking-widest">
            {subtitle}
          </p>
          <h2 className="font-futura text-4xl md:text-5xl font-bold text-foreground">
            {title}
          </h2>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {content && (
            <div className="prose prose-lg max-w-none">
              <p className="font-roboto text-lg text-muted-foreground leading-relaxed text-justify">
                {content}
              </p>
            </div>
          )}

          {/* Bullet Points */}
          {bulletPoints.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-futura text-2xl font-semibold text-foreground">
                Points clés
              </h3>
              <ul className="space-y-3">
                {bulletPoints.map((point, index) => (
                  <li
                    key={index}
                    className="flex gap-4 items-start group"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-accent mt-1 group-hover:bg-accent/20 transition-colors duration-300">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="font-roboto text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors duration-300">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
