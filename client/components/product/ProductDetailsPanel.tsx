import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface DetailSection {
  title: string;
  content: string | string[] | any;
}

interface ProductDetailsPanelProps {
  sections: DetailSection[];
  sectionTitle?: string;
  sectionSubtitle?: string;
}

export function ProductDetailsPanel({
  sections,
  sectionTitle = "Détails du produit",
  sectionSubtitle = "Informations complètes",
}: ProductDetailsPanelProps) {
  const [openSections, setOpenSections] = useState<string[]>([]);

  return (
    <section className="product-details-panel py-16 md:py-24 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="mb-12 space-y-3">
          <p className="text-accent font-roboto text-xs uppercase tracking-widest font-bold">
            {sectionSubtitle}
          </p>
          <h2 className="font-futura text-4xl md:text-5xl font-bold text-foreground">
            {sectionTitle}
          </h2>
          <div className="h-1 w-20 bg-accent rounded-full" />
        </div>

        {/* Accordion Sections */}
        <Accordion
          type="multiple"
          value={openSections}
          onValueChange={setOpenSections}
          className="w-full space-y-4"
        >
          {sections.map((section, index) => (
            <AccordionItem
              key={`section-${index}`}
              value={`section-${index}`}
              className="border border-border rounded-xl overflow-hidden hover:border-accent/40 transition-all duration-300 hover:shadow-lg"
            >
              <AccordionTrigger className="text-lg font-bold text-foreground py-5 px-6 hover:no-underline hover:text-accent hover:bg-accent/5 transition-all duration-300">
                <span className="font-futura font-bold uppercase tracking-wider text-sm">
                  {section.title}
                </span>
              </AccordionTrigger>

              <AccordionContent className="pb-6 pt-2 px-6 bg-gradient-to-b from-white/50 to-white border-t border-border/20">
                {Array.isArray(section.content) ? (
                  <ul className="space-y-3">
                    {section.content.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="flex gap-4 items-start font-roboto text-sm text-muted-foreground leading-relaxed"
                      >
                        <span className="text-accent font-bold mt-0.5 flex-shrink-0 text-lg">
                          →
                        </span>
                        <span className="flex-grow">{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : typeof section.content === "string" &&
                  section.content.includes("\n") ? (
                  <div className="whitespace-pre-wrap font-roboto text-sm text-muted-foreground leading-relaxed prose prose-sm max-w-none">
                    {section.content}
                  </div>
                ) : (
                  <p className="font-roboto text-sm text-muted-foreground leading-relaxed">
                    {section.content}
                  </p>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
