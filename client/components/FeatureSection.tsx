import React from "react";
import { Zap, Lightbulb, Sparkles } from "lucide-react";

export function FeatureSection() {
  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Contrôle intelligent",
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Économie d'énergie",
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Design premium",
    },
  ];

  return (
    <section className="py-16 md:py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center space-y-4"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-accent/10 to-accent/5 rounded-full flex items-center justify-center text-accent">
                {feature.icon}
              </div>
              <h3 className="font-futura text-lg font-bold text-foreground">
                {feature.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
