import { Mail, Download } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { useState, useEffect } from "react";

interface ProductHeroPanelProps {
  id: string;
  category: string;
  name: string;
  description: string;
  price: number;
  slug: string;
}

export function ProductHeroPanel({
  id,
  category,
  name,
  description,
  price,
  slug,
}: ProductHeroPanelProps) {
  const { addItem } = useCart();
  const [pdfFile, setPdfFile] = useState<string | null>(null);
  const [pdfFilename, setPdfFilename] = useState<string>("fiche-technique.pdf");

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await fetch(`/api/products/${slug}`);
        if (response.ok) {
          const data = await response.json();
          if (data.pdfFile) {
            setPdfFile(data.pdfFile);
            setPdfFilename(data.pdfFilename || "fiche-technique.pdf");
          }
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchProductData();
  }, [slug]);

  const handleRequestQuote = () => {
    addItem({
      id,
      name,
      price,
      quantity: 1,
      slug,
    });
    toast.success(`${name} ajouté à la demande de devis!`);
  };

  const handleDownloadFile = () => {
    if (pdfFile) {
      const link = document.createElement("a");
      link.href = pdfFile;
      link.download = pdfFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Fiche technique téléchargée avec succès!");
    } else {
      toast.error("Fichier technique non disponible pour ce produit");
    }
  };

  return (
    <div className="sticky top-24 h-fit space-y-6">
      {/* Category Tag */}
      <p className="font-roboto text-sm uppercase tracking-widest text-accent font-bold">
        {category}
      </p>

      {/* Title */}
      <h1 className="font-futura text-3xl lg:text-4xl font-bold text-foreground leading-tight">
        {name}
      </h1>

      {/* Description */}
      <p className="font-roboto text-base text-muted-foreground leading-relaxed">
        {description}
      </p>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-accent to-transparent" />

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Request Quote Button - Primary */}
        <button
          onClick={handleRequestQuote}
          className="w-full bg-accent hover:bg-accent/90 text-white font-roboto font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg active:scale-95"
        >
          <Mail className="w-5 h-5" />
          Demande de devis
        </button>

        {/* Download Technical Sheet Button - Secondary */}
        <button
          onClick={handleDownloadFile}
          className="w-full bg-white hover:bg-gray-50 text-foreground hover:text-accent border-2 border-foreground hover:border-accent font-roboto font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg active:scale-95"
        >
          <Download className="w-5 h-5" />
          Télécharger fiche technique
        </button>
      </div>

      {/* Info Text */}
      <p className="text-xs text-muted-foreground text-center">
        Demandez un devis gratuit et sans engagement
      </p>
    </div>
  );
}
