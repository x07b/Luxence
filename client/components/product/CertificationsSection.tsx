import React from "react";

interface Certification {
  icon: React.ReactNode;
  label: string;
}

interface CertificationsSectionProps {
  certifications: Certification[];
  sectionTitle?: string;
  sectionSubtitle?: string;
  sectionDescription?: string;
}

export function CertificationsSection({
  certifications,
  sectionTitle = "Certifications et conformité",
  sectionSubtitle = "Normes & Standards",
  sectionDescription = "Tous nos produits respectent les normes les plus strictes en matière de qualité et d'environnement",
}: CertificationsSectionProps) {
  return (
    <section className="certifications-section py-20 md:py-28 px-4 bg-gradient-to-b from-gray-50 to-white">
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

        {/* Certifications Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {certifications.map((cert, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-4 p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-border group animate-fade-in opacity-0"
              style={{
                animation: `fade-in 0.6s ease-out forwards`,
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="text-accent group-hover:scale-110 transition-transform duration-300">
                {cert.icon}
              </div>
              <p className="font-roboto text-sm font-semibold text-foreground text-center group-hover:text-accent transition-colors duration-300">
                {cert.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
