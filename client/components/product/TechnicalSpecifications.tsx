interface Specification {
  label: string;
  value: string;
}

interface TechnicalSpecificationsProps {
  specifications: Specification[];
  sectionTitle?: string;
  sectionSubtitle?: string;
}

export function TechnicalSpecifications({
  specifications,
  sectionTitle = "Caractéristiques techniques",
  sectionSubtitle = "Détails techniques",
}: TechnicalSpecificationsProps) {
  return (
    <section className="technical-specs-section py-20 md:py-28 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20 space-y-4 animate-fade-in">
          <p className="text-accent font-roboto text-sm font-semibold uppercase tracking-widest">
            {sectionSubtitle}
          </p>
          <h2 className="font-futura text-4xl md:text-5xl font-bold text-foreground">
            {sectionTitle}
          </h2>
        </div>

        {/* Specifications Grid/Card Layout */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-border overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
            {specifications.map((spec, index) => (
              <div
                key={index}
                className="p-8 hover:bg-accent/2 transition-colors duration-300 group"
              >
                <div className="flex justify-between items-center md:flex-col md:items-start gap-4">
                  {/* Label */}
                  <p className="font-roboto text-muted-foreground font-medium">
                    {spec.label}
                  </p>
                  {/* Value */}
                  <p className="font-roboto font-bold text-foreground text-lg group-hover:text-accent transition-colors duration-300">
                    {spec.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
