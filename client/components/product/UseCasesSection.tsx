interface UseCase {
  image: string;
  title: string;
  caption: string;
}

interface UseCasesSectionProps {
  useCases: UseCase[];
  sectionTitle?: string;
  sectionSubtitle?: string;
}

export function UseCasesSection({
  useCases,
  sectionTitle = "Cas d'usage",
  sectionSubtitle = "Applications",
}: UseCasesSectionProps) {
  if (!useCases || useCases.length === 0) {
    return null;
  }

  return (
    <section className="use-cases-section py-20 md:py-28 px-4 bg-gradient-to-b from-white to-gray-50">
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

        {/* Use Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className="group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-border animate-fade-in opacity-0 bg-white"
              style={{
                animation: `fade-in 0.6s ease-out forwards`,
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Image Container */}
              <div className="relative overflow-hidden h-64 bg-gray-100">
                <img
                  src={useCase.image}
                  alt={useCase.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Dark Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Content */}
              <div className="p-6 space-y-3">
                <h3 className="font-futura text-xl font-bold text-foreground group-hover:text-accent transition-colors duration-300">
                  {useCase.title}
                </h3>
                <p className="font-roboto text-sm text-muted-foreground leading-relaxed">
                  {useCase.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
