import { CheckCircle } from "lucide-react";

export function AboutSection() {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto px-4 w-full">
        <div
          className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center animate-fade-in"
          style={{ animation: "fade-in 0.8s ease-out forwards" }}
        >
          {/* Image */}
          <div className="order-2 md:order-1">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl group h-80 md:h-96">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F4bd5a48984ac41abb50f4c9c327d1d89%2F912ded31f1c040bbb8e059f551179c76?format=webp&width=800"
                alt="Luxence brand banner"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>

          {/* Content */}
          <div className="order-1 md:order-2 space-y-5">
            <div className="space-y-2 animate-fade-in">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-futura font-bold text-primary leading-tight">
                Rejoignez l'univers <span className="text-accent">Luxence</span>
              </h2>
              <div className="h-1 w-20 bg-gradient-to-r from-accent to-accent/50 rounded-full" />
            </div>

            <p
              className="text-sm md:text-base text-muted-foreground font-roboto leading-relaxed animate-fade-in"
              style={{ animationDelay: "100ms" }}
            >
              Depuis vingt ans, Luxence crée des luminaires d'exception en
              fusionnant design artistique et excellence fonctionnelle.
            </p>

            <div
              className="space-y-2 animate-fade-in"
              style={{ animationDelay: "200ms" }}
            >
              <div className="flex items-start gap-2 group">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent group-hover:scale-110 transition-all duration-300 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-accent group-hover:text-white" />
                </div>
                <div>
                  <h3 className="font-futura font-bold text-primary text-sm md:text-base">
                    Design artistique
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground font-roboto">
                    Œuvres conçues par des designers renommés
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 group">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent group-hover:scale-110 transition-all duration-300 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-accent group-hover:text-white" />
                </div>
                <div>
                  <h3 className="font-futura font-bold text-primary text-sm md:text-base">
                    Matériaux premium
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground font-roboto">
                    Sélection de matériaux nobles
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 group">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent group-hover:scale-110 transition-all duration-300 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-accent group-hover:text-white" />
                </div>
                <div>
                  <h3 className="font-futura font-bold text-primary text-sm md:text-base">
                    Excellence lumière
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground font-roboto">
                    Esthétique et performance
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
