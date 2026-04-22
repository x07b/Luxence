interface Feature {
  icon: React.ReactNode;
  label: string;
}

interface ProductDetailHeroProps {
  name: string;
  category: string;
  description: string;
  features?: Feature[];
  children?: React.ReactNode; // For image gallery
}

export function ProductDetailHero({
  name,
  category,
  description,
  features = [],
  children,
}: ProductDetailHeroProps) {
  return (
    <section className="py-16 px-4 sm:py-20 md:py-28">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
          {/* Image Gallery Slot */}
          <div className="product-gallery-container">{children}</div>

          {/* Product Info */}
          <div className="space-y-8 animate-slide-in-up">
            <div className="space-y-4">
              <p className="font-roboto text-sm uppercase tracking-widest text-accent font-semibold">
                {category}
              </p>
              <h1 className="font-futura text-5xl md:text-6xl font-bold text-foreground leading-tight">
                {name}
              </h1>
              <p className="font-roboto text-lg text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>

            {/* Smart Features Pills */}
            {features.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full border border-accent/20 text-sm font-roboto font-medium text-accent hover:bg-accent/20 transition-colors duration-300"
                  >
                    <span className="text-accent">{feature.icon}</span>
                    {feature.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
