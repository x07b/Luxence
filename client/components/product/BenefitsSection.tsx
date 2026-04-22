import React from "react";

export interface Benefit {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface BenefitsSectionProps {
  benefits: Benefit[];
  sectionTitle?: string;
  sectionSubtitle?: string;
  sectionDescription?: string;
}

export function BenefitsSection({
  benefits,
  sectionTitle = "Avantages clés",
  sectionSubtitle = "Caractéristiques",
  sectionDescription = "Découvrez ce qui fait l'excellence de ce luminaire",
}: BenefitsSectionProps) {
  return (
    <section className="benefits-section py-20 md:py-28 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20 space-y-4 animate-fade-in">
          <p className="text-accent font-roboto text-sm font-semibold uppercase tracking-widest">
            {sectionSubtitle}
          </p>
          <h2 className="font-futura text-4xl md:text-5xl font-bold text-foreground">
            {sectionTitle}
          </h2>
          {sectionDescription && (
            <p className="text-lg text-muted-foreground font-roboto max-w-2xl mx-auto">
              {sectionDescription}
            </p>
          )}
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group text-center space-y-6 p-8 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-border animate-fade-in opacity-0"
              style={{
                animation: `fade-in 0.6s ease-out forwards`,
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Icon Container */}
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-accent/10 to-accent/5 rounded-full flex items-center justify-center text-accent group-hover:bg-accent/20 transition-all duration-300">
                  {benefit.icon}
                </div>
              </div>

              {/* Title */}
              <h3 className="font-futura text-xl font-bold text-foreground">
                {benefit.title}
              </h3>

              {/* Description */}
              <p className="font-roboto text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
